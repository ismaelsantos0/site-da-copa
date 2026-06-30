import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { getCachedAnalysis, saveAnalysisToCache } from './db.js';

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
    // 1. Verifica o Cache no Banco de Dados
    console.log(`[🔍] Buscando cache para o jogo: ${t1} vs ${t2}...`);
    const cachedData = await getCachedAnalysis(matchId);
    
    if (cachedData) {
      console.log(`[✅] Cache encontrado! Retornando análise em 0ms.`);
      return res.json({ source: 'cache', text: cachedData });
    }

    console.log(`[⏳] Cache vazio. Iniciando Orquestração de Inteligência...`);

    // 2. Busca Dados Reais na Sportmonks
    let sportmonksContext = "";
    const smToken = process.env.SPORTMONKS_API_TOKEN;
    if (smToken) {
      console.log(`[⚽] Buscando IDs na Sportmonks para ${t1} e ${t2}...`);
      try {
        const resT1 = await axios.get(`https://api.sportmonks.com/v3/football/teams/search/${t1}?api_token=${smToken}`);
        const idT1 = resT1.data?.data?.[0]?.id;
        
        const resT2 = await axios.get(`https://api.sportmonks.com/v3/football/teams/search/${t2}?api_token=${smToken}`);
        const idT2 = resT2.data?.data?.[0]?.id;

        if (idT1 && idT2) {
          console.log(`[⚽] Buscando H2H Fixture para os IDs ${idT1} e ${idT2}...`);
          const resH2H = await axios.get(`https://api.sportmonks.com/v3/football/fixtures/head-to-head/${idT1}/${idT2}?api_token=${smToken}&include=lineups.player,sidelined.player`);
          
          const fixtures = resH2H.data?.data || [];
          if (fixtures.length > 0) {
            const latestFixture = fixtures[0]; // Pega o último confronto
            
            // Extrai Escalações
            let lineups = [];
            if (latestFixture.lineups) {
              lineups = latestFixture.lineups.map(l => l.player?.name || l.player_id).filter(Boolean);
            }
            
            // Extrai Desfalques
            let sidelined = [];
            if (latestFixture.sidelined) {
              sidelined = latestFixture.sidelined.map(s => s.player?.name || s.player_id).filter(Boolean);
            }

            sportmonksContext = `DADOS REAIS DA PARTIDA (SPORTMONKS API):
            - Jogadores relacionados/escalados encontrados: ${lineups.length > 0 ? lineups.slice(0, 22).join(', ') : 'Escalação oficial ainda não liberada.'}
            - Desfalques/Lesões Oficiais Confirmadas para este jogo: ${sidelined.length > 0 ? sidelined.join(', ') : 'Nenhum desfalque importante reportado no momento.'}
            
            (Analise o jogo focando estritamente nestes desfalques e elencos caso estejam disponíveis, caso contrário, use sua base histórica de conhecimento sobre as equipes principais).`;
          } else {
             sportmonksContext = `Dados Reais: Não foi encontrado um Head-to-Head oficial ao vivo hoje. Preveja usando a força máxima esperada de cada seleção na Copa.`;
          }
        }
      } catch (smError) {
        console.error(`[⚠️] Erro na Sportmonks:`, smError.response?.data || smError.message);
        sportmonksContext = `Aviso: Conexão com os dados ao vivo oscilou. Faça uma previsão tática clássica baseada no elenco principal.`;
      }
    }

    // 3. Monta o Prompt Super Completo
    const systemPrompt = process.env.VITE_GEMINI_PROMPT || `Você é um analista tático esportivo especialista na Copa do Mundo 2026. Analise o histórico de estratégia desses dois times, quais foram os jogadores chaves, e quais os ataques mais usados, histórico de jogadores lesionados ou com cartão, qual a atual escalação. Compare com as odds de vitória ou empate e faça uma previsão levando todos esses fatores em questão. Cada ponto importante no futebol deve ser levado em consideração.`;
    
    const finalPrompt = `
      ${systemPrompt}

      Confronto: ${t1} vs ${t2}
      Odd Vitória ${t1}: ${t1Odd}
      Odd Vitória ${t2}: ${t2Odd}

      ${sportmonksContext}
    `;

    // 4. Chama a IA do Google Gemini
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

    // 5. Salva no Banco de Dados para uso futuro
    console.log(`[💾] Salvando nova análise no banco de dados SQLite...`);
    await saveAnalysisToCache(matchId, t1, t2, generatedText);

    // 6. Devolve pro Frontend
    console.log(`[🚀] Análise enviada pro Frontend com sucesso!`);
    res.json({ source: 'ai_generated', text: generatedText });

  } catch (error) {
    console.error(`[❌] Erro no fluxo:`, error.message);
    res.status(500).json({ error: 'Falha ao gerar análise.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor da Copa 2026 rodando na porta ${PORT}`);
});
