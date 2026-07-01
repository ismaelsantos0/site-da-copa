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
      // Forçando o seed das partidas para atualizar com os times reais
      if (true) {
        console.log('🌱 Semeando os 32 jogos reais do mata-mata da Copa 2026 com as seleções reais...');
        // Limpa partidas falsas antigas
        await pool.query('DELETE FROM my_predictions');
        await pool.query('DELETE FROM real_matches');

        const matches = [];
        
        const r32Teams = [
          ['Brasil', 'Japão'], ['C. do Marfim', 'Noruega'], ['Espanha', 'Áustria'], ['Suíça', 'Argélia'],
          ['Argentina', 'Cabo Verde'], ['México', 'Equador'], ['Holanda', 'Marrocos'], ['Austrália', 'Egito'],
          ['França', 'Suécia'], ['África do Sul', 'Canadá'], ['Colômbia', 'Gana'], ['Inglaterra', 'RD Congo'],
          ['Alemanha', 'Paraguai'], ['Estados Unidos', 'Bósnia'], ['Portugal', 'Croácia'], ['Bélgica', 'Senegal']
        ];
        // Distribuindo os jogos ao longo de 4 dias para ser realista
        // Dia 28: jogos 1 a 4
        // Dia 29: jogos 5 a 8
        // Dia 30: jogos 9 a 12 (hoje, alguns já passaram, outros não)
        // Dia 01: jogos 13 a 16 (futuro)
        const getMatchDate = (index) => {
          if (index < 4) return '2026-06-28 15:00:00';
          if (index < 8) return '2026-06-29 15:00:00';
          if (index < 10) return '2026-06-30 14:00:00'; // Já passou
          if (index < 12) return '2026-06-30 23:00:00'; // Ainda vai acontecer hoje
          return '2026-07-01 15:00:00'; // Amanhã
        };

        // 16-avos de final (16 jogos)
        for(let i=0; i<16; i++) {
          matches.push(`('R32-${i+1}', '16-avos de Final', '${r32Teams[i][0]}', '${r32Teams[i][1]}', 'CONFIRMED', '${getMatchDate(i)}')`);
        }
        // Oitavas (8 jogos)
        for(let i=1; i<=8; i++) {
          matches.push(`('R16-${i}', 'Oitavas de Final', 'TBD', 'TBD', 'CONFIRMED', '2026-07-04 12:00:00')`);
        }
        // Quartas (4 jogos)
        for(let i=1; i<=4; i++) {
          matches.push(`('QF-${i}', 'Quartas de Final', 'TBD', 'TBD', 'CONFIRMED', '2026-07-09 12:00:00')`);
        }
        // Semis (2 jogos)
        for(let i=1; i<=2; i++) {
          matches.push(`('SF-${i}', 'Semifinal', 'TBD', 'TBD', 'CONFIRMED', '2026-07-14 12:00:00')`);
        }
        // Terceiro lugar
        matches.push(`('3RD-1', 'Disputa de 3º Lugar', 'TBD', 'TBD', 'CONFIRMED', '2026-07-18 12:00:00')`);
        // Final
        matches.push(`('FIN-1', 'Final', 'TBD', 'TBD', 'CONFIRMED', '2026-07-19 12:00:00')`);

        await pool.query(`
          INSERT INTO real_matches (id, stage, t1, t2, status, match_date) VALUES 
          ${matches.join(',\n')}
        `);


      }
  } catch (err) {
      console.error(`❌ Erro ao realizar o seed:`, err.message);
  }
  
  console.log(`🎉 Seed Automático concluído! ${count} seleções cadastradas.`);
};
