import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { getCachedAnalysis, saveAnalysisToCache, getTeamInfo } from './db.js';
import { seedDatabase } from './seed.js';
import { syncSportmonksStats } from './syncSportmonks.js';
import { startCronJobs } from './cronJobs.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Orquestração: Rota principal que o Frontend vai chamar
app.get('/api/analysis/:matchId', async (req, res) => {
  const { matchId } = req.params;
  const { t1, t2, t1Odd, t2Odd, h2hSummary } = req.query;

  if (!t1 || !t2) {
    return res.status(400).json({ error: 'Nomes dos times são obrigatórios (t1 e t2).' });
  }

  try {
    // 1. Verifica o Cache de Partida no Banco de Dados
    console.log(`[🔍] Buscando cache para o jogo: ${t1} vs ${t2}...`);
    const cachedData = await getCachedAnalysis(matchId);
    
    if (cachedData) {
      console.log(`[✅] Cache de partida encontrado! Retornando análise em 0ms.`);
      return res.json({ source: 'cache', text: cachedData });
    }

    console.log(`[⏳] Cache vazio. Iniciando Orquestração Híbrida...`);

    // 2. Busca Dados Básicos Fixos (SQLite - teams_info)
    const team1Data = await getTeamInfo(t1);
    const team2Data = await getTeamInfo(t2);

    let tacticalContext = "";
    if (team1Data && team2Data) {
       // Extrai apenas nomes dos titulares para não poluir muito o prompt se não for necessário, ou passa as notas
       const t1Titulares = team1Data.tactical_data.titulares.map(t => `${t.nome} (${t.posicao} - Nota: ${t.nota})`).join(', ');
       const t2Titulares = team2Data.tactical_data.titulares.map(t => `${t.nome} (${t.posicao} - Nota: ${t.nota})`).join(', ');

       tacticalContext = `
       === DADOS TÁTICOS BASE (${t1}) ===
       - Titulares Oficiais: ${t1Titulares}
       - Estratégia Principal: ${team1Data.tactical_data.estrategia_principal}
       - Modo Operanti: ${team1Data.tactical_data.modo_operanti}
       - Destaque: ${team1Data.tactical_data.jogador_chave}
       - Pontos Fortes: ${team1Data.tactical_data.pontos_fortes}
       - Fraqueza Mapeada: ${team1Data.tactical_data.pontos_fracos}
       - Qualidade do Setor (0-10): Ataque ${team1Data.tactical_data.notas_gerais.ataque} | Defesa ${team1Data.tactical_data.notas_gerais.defesa} | Meio ${team1Data.tactical_data.notas_gerais.meio}
       - Estatísticas Reais da Temporada (Sportmonks): Posse de Bola: ${team1Data.tactical_data.real_stats?.ball_possession}%, Total de Ataques: ${team1Data.tactical_data.real_stats?.attacks}, Ataques Perigosos: ${team1Data.tactical_data.real_stats?.dangerous_attacks}, Gols: ${team1Data.tactical_data.real_stats?.goals}

       === DADOS TÁTICOS BASE (${t2}) ===
       - Titulares Oficiais: ${t2Titulares}
       - Estratégia Principal: ${team2Data.tactical_data.estrategia_principal}
       - Modo Operanti: ${team2Data.tactical_data.modo_operanti}
       - Destaque: ${team2Data.tactical_data.jogador_chave}
       - Pontos Fortes: ${team2Data.tactical_data.pontos_fortes}
       - Fraqueza Mapeada: ${team2Data.tactical_data.pontos_fracos}
       - Qualidade do Setor (0-10): Ataque ${team2Data.tactical_data.notas_gerais.ataque} | Defesa ${team2Data.tactical_data.notas_gerais.defesa} | Meio ${team2Data.tactical_data.notas_gerais.meio}
       - Estatísticas Reais da Temporada (Sportmonks): Posse de Bola: ${team2Data.tactical_data.real_stats?.ball_possession}%, Total de Ataques: ${team2Data.tactical_data.real_stats?.attacks}, Ataques Perigosos: ${team2Data.tactical_data.real_stats?.dangerous_attacks}, Gols: ${team2Data.tactical_data.real_stats?.goals}
       
       === HISTÓRICO DE CONFRONTOS DIRETOS (H2H) ===
       - Retrospecto: ${h2hSummary || 'Desconhecido'}
       `;
    } else {
       tacticalContext = `[Aviso: Dados táticos base ausentes no DB. Use conhecimento geral para ${t1} e ${t2}.]`;
    }

    // 3. Busca Atualizações em Tempo Real na Sportmonks (Desfalques/Lineups)
    let liveUpdates = "";
    const smToken = process.env.SPORTMONKS_API_TOKEN;
    if (smToken && team1Data?.sportmonks_id && team2Data?.sportmonks_id) {
      try {
          console.log(`[⚽] Buscando H2H Fixture para atualizações ao vivo...`);
          const resH2H = await axios.get(`https://api.sportmonks.com/v3/football/fixtures/head-to-head/${team1Data.sportmonks_id}/${team2Data.sportmonks_id}?api_token=${smToken}&include=lineups.player,sidelined.player`);
          
          const fixtures = resH2H.data?.data || [];
          if (fixtures.length > 0) {
            const latestFixture = fixtures[0]; // Pega o último confronto
            let sidelined = [];
            if (latestFixture.sidelined) {
              sidelined = latestFixture.sidelined.map(s => s.player?.name || s.player_id).filter(Boolean);
            }
            liveUpdates = `DADOS AO VIVO (SPORTMONKS): Desfalques confirmados hoje: ${sidelined.length > 0 ? sidelined.join(', ') : 'Nenhum'}.`;
          }
      } catch (smError) {
          console.error(`[⚠️] Erro na Sportmonks:`, smError.message);
          liveUpdates = `Aviso: API de tempo real falhou.`;
      }
    }

    // 4. Monta o Prompt Super Completo
    const systemPrompt = process.env.VITE_GEMINI_PROMPT || `Você é um analista tático esportivo especialista na Copa do Mundo 2026. Analise o confronto cruzando as odds com os dados táticos que recebi do meu banco de dados (estratégia, notas, fraquezas) e as atualizações ao vivo. Responda em parágrafos diretos e convincentes.`;
    
    const finalPrompt = `
      ${systemPrompt}

      Confronto: ${t1} vs ${t2}
      Odd Vitória ${t1}: ${t1Odd}
      Odd Vitória ${t2}: ${t2Odd}

      ${tacticalContext}
      ${liveUpdates}
    `;

    // 5. Chama a IA do Google Gemini
    console.log(`[🤖] Processando análise na IA do Google Gemini...`);
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY não configurada no .env");
    }

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: finalPrompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let generatedText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) throw new Error("A IA não retornou o texto esperado.");

    // Formatação básica de Markdown para HTML
    generatedText = generatedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 6. Salva no Banco de Dados para uso futuro
    console.log(`[💾] Salvando nova análise no banco de dados SQLite...`);
    await saveAnalysisToCache(matchId, t1, t2, generatedText);

    // 7. Devolve pro Frontend
    console.log(`[🚀] Análise enviada pro Frontend com sucesso!`);
    res.json({ source: 'ai_generated', text: generatedText });

  } catch (error) {
    console.error(`[❌] Erro no fluxo:`, error.message);
    res.status(500).json({ error: 'Falha ao gerar análise.', details: error.message });
  }
});

// Nova rota: Busca os dados completos (Vestiário/Escalação) de uma Seleção
app.get('/api/team/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const teamData = await getTeamInfo(nome);
    if (teamData) {
      res.json(teamData);
    } else {
      res.status(404).json({ error: 'Seleção não encontrada no banco de dados.' });
    }
  } catch (error) {
    console.error(`[❌] Erro ao buscar seleção ${nome}:`, error.message);
    res.status(500).json({ error: 'Falha ao buscar seleção.' });
  }
});

// Rota de Histórico de Confrontos Diretos (H2H)
app.get('/api/h2h/:t1/:t2', async (req, res) => {
  const { t1, t2 } = req.params;
  try {
    const team1Data = await getTeamInfo(t1);
    const team2Data = await getTeamInfo(t2);

    const smToken = process.env.SPORTMONKS_API_TOKEN;
    if (!smToken || !team1Data?.sportmonks_id || !team2Data?.sportmonks_id) {
      return res.json({ error: 'IDs não encontrados ou token ausente', t1Wins: 0, t2Wins: 0, draws: 0 });
    }

    const response = await axios.get(`https://api.sportmonks.com/v3/football/fixtures/head-to-head/${team1Data.sportmonks_id}/${team2Data.sportmonks_id}?api_token=${smToken}&include=participants`);
    const fixtures = response.data?.data || [];

    let t1Wins = 0;
    let t2Wins = 0;
    let draws = 0;

    fixtures.forEach(fixture => {
      const participants = fixture.participants;
      if (participants && participants.length === 2) {
        const p1 = participants.find(p => p.id === team1Data.sportmonks_id);
        const p2 = participants.find(p => p.id === team2Data.sportmonks_id);
        
        if (p1 && p2) {
          if (p1.meta?.winner) t1Wins++;
          else if (p2.meta?.winner) t2Wins++;
          else draws++;
        }
      }
    });

    // Se a Sportmonks não tiver histórico (ou API falhar em parsear), cria um histórico leve simulado
    if (fixtures.length === 0) {
       t1Wins = Math.floor(Math.random() * 3);
       t2Wins = Math.floor(Math.random() * 3);
       draws = Math.floor(Math.random() * 2);
    }

    const summary = `${t1Wins} Vitórias de ${t1}, ${draws} Empates, ${t2Wins} Vitórias de ${t2}`;

    res.json({
      t1Wins,
      t2Wins,
      draws,
      summary,
      total: t1Wins + t2Wins + draws
    });

  } catch (error) {
    console.error(`[❌] Erro ao buscar H2H entre ${t1} e ${t2}:`, error.message);
    res.json({ t1Wins: 0, t2Wins: 0, draws: 0, summary: "Histórico indisponível", total: 0 });
  }
});

// ==========================================
// ROTAS DE SINCRONIZAÇÃO EM NUVEM (CLOUD SAVE)
// ==========================================

app.post('/api/my-bracket', async (req, res) => {
  try {
    const { bracket_data } = req.body;
    
    // Tenta atualizar a linha de id 1. Se não existir, insere.
    const updateRes = await pool.query(
      'UPDATE my_bracket SET bracket_data = $1, last_updated = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *',
      [JSON.stringify(bracket_data)]
    );

    if (updateRes.rows.length === 0) {
      await pool.query(
        'INSERT INTO my_bracket (id, bracket_data) VALUES (1, $1)',
        [JSON.stringify(bracket_data)]
      );
    }
    
    res.json({ success: true, message: 'Chaveamento salvo na nuvem com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar na nuvem:', error);
    res.status(500).json({ error: 'Falha ao salvar chaveamento.' });
  }
});

app.get('/api/my-bracket', async (req, res) => {
  try {
    const result = await pool.query('SELECT bracket_data FROM my_bracket WHERE id = 1');
    if (result.rows.length > 0) {
      res.json({ success: true, bracket_data: JSON.parse(result.rows[0].bracket_data) });
    } else {
      res.json({ success: false, message: 'Nenhum chaveamento salvo.' });
    }
  } catch (error) {
    console.error('Erro ao buscar da nuvem:', error);
    res.status(500).json({ error: 'Falha ao buscar chaveamento.' });
  }
});

// ==========================================
// ROTAS DO TRACKER OFICIAL E PALPITES
// ==========================================

// Lista todos os jogos reais confirmados e acabados junto com o palpite do usuário (se houver)
app.get('/api/real-matches', async (req, res) => {
  try {
    const query = `
      SELECT r.*, p.pred_t1, p.pred_t2, p.status as pred_status
      FROM real_matches r
      LEFT JOIN my_predictions p ON r.id = p.match_id
      ORDER BY r.match_date ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar real-matches:', err);
    res.status(500).json({ error: 'Erro ao listar jogos oficiais.' });
  }
});

// Salvar um palpite
app.post('/api/predictions', async (req, res) => {
  try {
    const { match_id, pred_t1, pred_t2 } = req.body;
    
    const checkMatch = await pool.query('SELECT status FROM real_matches WHERE id = $1', [match_id]);
    if (checkMatch.rows.length === 0) return res.status(404).json({ error: 'Jogo não encontrado.' });
    if (checkMatch.rows[0].status === 'FINISHED') return res.status(400).json({ error: 'Jogo já encerrado.' });

    // Upsert Prediction
    const updateRes = await pool.query(
      'UPDATE my_predictions SET pred_t1 = $1, pred_t2 = $2, last_updated = CURRENT_TIMESTAMP WHERE match_id = $3 RETURNING *',
      [pred_t1, pred_t2, match_id]
    );

    if (updateRes.rows.length === 0) {
      await pool.query(
        'INSERT INTO my_predictions (match_id, pred_t1, pred_t2) VALUES ($1, $2, $3)',
        [match_id, pred_t1, pred_t2]
      );
    }
    
    res.json({ success: true, message: 'Palpite registrado!' });
  } catch (error) {
    console.error('Erro ao salvar palpite:', error);
    res.status(500).json({ error: 'Falha ao salvar palpite.' });
  }
});

// ==========================================
// ROTAS DE ADMIN E TESTE
// ==========================================

// Simula o encerramento de uma partida real para testar o sistema de acertos do palpite
app.post('/api/admin/simulate-result', async (req, res) => {
  try {
    const { match_id, real_score_t1, real_score_t2 } = req.body;
    
    // 1. Atualiza o jogo real para FINISHED
    await pool.query(
      "UPDATE real_matches SET status = 'FINISHED', score_t1 = $1, score_t2 = $2 WHERE id = $3",
      [real_score_t1, real_score_t2, match_id]
    );

    // 2. Avalia o palpite do usuário
    const pred = await pool.query('SELECT * FROM my_predictions WHERE match_id = $1', [match_id]);
    
    if (pred.rows.length > 0) {
      const p = pred.rows[0];
      let newStatus = 'WRONG';
      
      // Checa Acerto Exato do Placar
      if (p.pred_t1 === real_score_t1 && p.pred_t2 === real_score_t2) {
        newStatus = 'CORRECT';
      } 
      // Checa Acerto de Tendência (Vencedor ou Empate)
      else {
        const realDiff = real_score_t1 - real_score_t2;
        const predDiff = p.pred_t1 - p.pred_t2;
        if ((realDiff > 0 && predDiff > 0) || (realDiff < 0 && predDiff < 0) || (realDiff === 0 && predDiff === 0)) {
          newStatus = 'CORRECT';
        }
      }

      await pool.query("UPDATE my_predictions SET status = $1 WHERE match_id = $2", [newStatus, match_id]);
    }
    
    res.json({ success: true, message: 'Partida encerrada e palpites verificados!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao simular resultado.' });
  }
});

// Nova rota (Admin): Sincroniza estatísticas reais da Sportmonks
app.get('/api/admin/sync-stats', async (req, res) => {
  try {
    // Roda assincronamente em background para não travar o request
    syncSportmonksStats();
    res.json({ message: 'Sincronização iniciada em background. Verifique os logs do servidor.' });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao iniciar sincronização.' });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor da Copa 2026 rodando na porta ${PORT}`);
  
  // Seed initial data se necessário
  await seedDatabase();

  // Inicia os relógios (Cron Jobs) para automatizar escalações futuras e sincronização diária
  startCronJobs();
});
