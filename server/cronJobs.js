import cron from 'node-cron';
import axios from 'axios';
import pool from './db.js';
import dotenv from 'dotenv';
import { syncSportmonksStats } from './syncSportmonks.js';

dotenv.config();

const smToken = process.env.SPORTMONKS_API_TOKEN;

// Função para checar jogos do dia e puxar Lineups
const checkAndSyncLiveLineups = async () => {
  console.log('⏰ [Cron] Verificando calendário de jogos de hoje na Sportmonks...');
  if (!smToken) return;

  try {
    // Para a Copa de 2026, isso buscaria as fixtures da data atual.
    // Como a Copa está no futuro, deixaremos a estrutura montada.
    const today = new Date().toISOString().split('T')[0];
    
    // URL hipotética para buscar jogos da data atual
    const url = `https://api.sportmonks.com/v3/football/fixtures/date/${today}?include=lineups.player,sidelined.player&api_token=${smToken}`;
    
    // Como não teremos dados úteis retornando para "hoje", apenas demonstramos o log
    console.log(`[Cron] Executaria requisição para: ${url}`);
    
    // Aqui haveria um map sobre as "fixtures" do dia. 
    // Se a fixture começa em menos de 2h, nós atualizaríamos os "titulares" no banco de dados.

  } catch (error) {
    console.error('❌ [Cron] Erro ao buscar jogos do dia:', error.message);
  }
};

export const startCronJobs = () => {
  console.log('⏰ Cron Jobs ativados! O servidor vigiará as escalações automaticamente.');

  // Roda a cada 1 hora ('0 * * * *')
  // Para testes podemos colocar ('*/30 * * * *') -> a cada 30 minutos
  cron.schedule('0 * * * *', () => {
    checkAndSyncLiveLineups();
  });

  // Roda a Sincronização Geral de Elencos Provisórios uma vez por dia as 03:00 da manhã
  cron.schedule('0 3 * * *', () => {
    console.log('⏰ [Cron] Rodando Sincronização Diária de Elencos e Estatísticas...');
    syncSportmonksStats();
  });
};
