import pool, { saveTeamInfo } from './db.js';
import teamsData from './teamsData.js';

export const seedDatabase = async () => {
  console.log('🌱 Iniciando o Seed Automático do Banco de Dados com Dados Táticos...');
  let count = 0;
  for (const team of teamsData) {
    try {
      await saveTeamInfo(team.nome, team.sportmonksId, team.taticas);
      console.log(`✅ Time salvo: ${team.nome}`);
      count++;
    } catch (err) {
      console.error(`❌ Erro ao salvar ${team.nome}:`, err.message);
    }
  }
  console.log(`🎉 Seed Automático concluído! ${count} seleções cadastradas.`);
};
