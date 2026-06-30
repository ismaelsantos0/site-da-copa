import pool, { saveTeamInfo } from './db.js';
import teamsData from './teamsData.js';

export const seedDatabase = async () => {
  console.log('🌱 Iniciando o Seed Automático do Banco de Dados com Dados Táticos...');
  let count = 0;
  
  try {
      const countRes = await pool.query('SELECT COUNT(*) FROM teams_info');
      if (parseInt(countRes.rows[0].count) === 0) {
        console.log('🌱 Semeando dados iniciais no banco de dados...');
        for (const team of teamsData) {
            await pool.query(
                'INSERT INTO teams_info (name, sportmonks_id, tactical_data) VALUES ($1, $2, $3)',
                [team.nome, team.sportmonksId, JSON.stringify(team.taticas)]
            );
            count++;
        }
        console.log('✅ Dados iniciais semeados com sucesso.');
      }

      const matchCountRes = await pool.query('SELECT COUNT(*) FROM real_matches');
      if (parseInt(matchCountRes.rows[0].count) === 0) {
        console.log('🌱 Semeando jogos reais falsos para testes...');
        await pool.query(`
          INSERT INTO real_matches (id, stage, t1, t2, status, match_date) VALUES 
          ('M1', 'Oitavas de Final', 'Brasil', 'Espanha', 'CONFIRMED', '2026-07-01 16:00:00'),
          ('M2', 'Oitavas de Final', 'Argentina', 'Portugal', 'CONFIRMED', '2026-07-02 16:00:00')
        `);
      }
  } catch (err) {
      console.error(`❌ Erro ao realizar o seed:`, err.message);
  }
  
  console.log(`🎉 Seed Automático concluído! ${count} seleções cadastradas.`);
};
