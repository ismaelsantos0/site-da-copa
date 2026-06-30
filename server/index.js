import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { getCachedAnalysis, saveAnalysisToCache, getTeamInfo } from './db.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Orquestração: Rota principal que o Frontend vai chamar
app.get('/api/analysis/:matchId', async (req, res) => {
  const { matchId } = req.params;
  const { t1, t2, t1Odd, t2Odd } = req.query;

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
       tacticalContext = `
       === DADOS TÁTICOS BASE (${t1}) ===
       - Escalação Base: ${team1Data.tactical_data.starters.join(', ')}
       - Estratégia: ${team1Data.tactical_data.strategy}
       - Destaque: ${team1Data.tactical_data.keyPlayer}
       - Fraqueza: ${team1Data.tactical_data.weakness}
       - Notas (0-10): Ataque ${team1Data.tactical_data.ratings.attack} | Defesa ${team1Data.tactical_data.ratings.defense} | Meio ${team1Data.tactical_data.ratings.midfield}

       === DADOS TÁTICOS BASE (${t2}) ===
       - Escalação Base: ${team2Data.tactical_data.starters.join(', ')}
       - Estratégia: ${team2Data.tactical_data.strategy}
       - Destaque: ${team2Data.tactical_data.keyPlayer}
       - Fraqueza: ${team2Data.tactical_data.weakness}
       - Notas (0-10): Ataque ${team2Data.tactical_data.ratings.attack} | Defesa ${team2Data.tactical_data.ratings.defense} | Meio ${team2Data.tactical_data.ratings.midfield}
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

app.listen(PORT, async () => {
  console.log(`🚀 Servidor da Copa 2026 rodando na porta ${PORT}`);
  
  // Roda o seed automaticamente no boot do servidor
  await seedDatabase();
});
