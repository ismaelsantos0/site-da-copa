import pool from './db.js';

export const advanceBracket = async (match_id, winner_team, loser_team) => {
  const parts = match_id.split('-');
  const stagePrefix = parts[0]; // R32, R16, QF, SF
  const matchNum = parseInt(parts[1], 10);

  let nextStagePrefix = '';
  if (stagePrefix === 'R32') nextStagePrefix = 'R16';
  else if (stagePrefix === 'R16') nextStagePrefix = 'QF';
  else if (stagePrefix === 'QF') nextStagePrefix = 'SF';
  else if (stagePrefix === 'SF') nextStagePrefix = 'FIN';
  else return; // Final ou 3º Lugar não avançam pra lugar nenhum

  const nextMatchNum = Math.ceil(matchNum / 2);
  const nextMatchId = `${nextStagePrefix}-${nextMatchNum}`;
  const isTeam1 = (matchNum % 2 !== 0);
  
  try {
    // Atualiza o vencedor na próxima partida principal
    if (isTeam1) {
      await pool.query('UPDATE real_matches SET t1 = $1 WHERE id = $2', [winner_team, nextMatchId]);
    } else {
      await pool.query('UPDATE real_matches SET t2 = $1 WHERE id = $2', [winner_team, nextMatchId]);
    }

    // Se for Semifinal, também joga o perdedor para a disputa de 3º lugar
    if (stagePrefix === 'SF') {
      const thirdPlaceId = '3RD-1';
      if (isTeam1) {
        await pool.query('UPDATE real_matches SET t1 = $1 WHERE id = $2', [loser_team, thirdPlaceId]);
      } else {
        await pool.query('UPDATE real_matches SET t2 = $1 WHERE id = $2', [loser_team, thirdPlaceId]);
      }
    }
  } catch (error) {
    console.error(`Erro ao avançar chaveamento de ${match_id}:`, error);
  }
};

export const validatePredictions = async (match_id, real_score_t1, real_score_t2) => {
  try {
    const predictions = await pool.query('SELECT * FROM my_predictions WHERE match_id = $1', [match_id]);
    
    for (let p of predictions.rows) {
      let newStatus = 'WRONG';
      
      // Acerto exato
      if (p.pred_t1 === real_score_t1 && p.pred_t2 === real_score_t2) {
        newStatus = 'CORRECT';
      } 
      // Acerto de tendência
      else {
        const realDiff = real_score_t1 - real_score_t2;
        const predDiff = p.pred_t1 - p.pred_t2;
        if ((realDiff > 0 && predDiff > 0) || (realDiff < 0 && predDiff < 0) || (realDiff === 0 && predDiff === 0)) {
          newStatus = 'CORRECT';
        }
      }

      await pool.query("UPDATE my_predictions SET status = $1 WHERE match_id = $2", [newStatus, match_id]);
    }
  } catch (error) {
    console.error(`Erro ao validar palpites de ${match_id}:`, error);
  }
};
