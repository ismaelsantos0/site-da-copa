import React, { useState, useEffect } from 'react';

const PredictionsModal = ({ bracketMatches, onClose }) => {
  const [dbMatches, setDbMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/real-matches`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDbMatches(data);
      } else {
        setDbMatches([]);
      }
    } catch (error) {
      console.error('Erro ao buscar partidas reais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const getConfirmedBracketMatches = () => {
    if (!bracketMatches) return [];
    const list = [];
    const extract = (side) => {
      if (!bracketMatches[side]) return;
      ['round1', 'round2', 'round3', 'round4'].forEach(r => {
         if (bracketMatches[side][r]) list.push(...bracketMatches[side][r]);
      });
    };
    extract('left');
    extract('right');
    if (bracketMatches.final) list.push(bracketMatches.final);
    
    // Filtra apenas os que estão CONFIRMADOS (Azul) no chaveamento
    const confirmed = list.filter(m => m.status === 'confirmed');
    
    return confirmed.map(m => {
      // Busca se já tem palpite no BD
      const dbMatch = dbMatches.find(db => db.id.toLowerCase() === m.id.toLowerCase());
      return {
        id: m.id,
        stage: 'Fase Eliminatória',
        t1: m.t1?.n || 'TBD',
        t2: m.t2?.n || 'TBD',
        status: dbMatch?.status || 'CONFIRMED', // Se foi finalizado no BD, pega o status
        score_t1: dbMatch?.score_t1 ?? null,
        score_t2: dbMatch?.score_t2 ?? null,
        pred_t1: dbMatch?.pred_t1 ?? null,
        pred_t2: dbMatch?.pred_t2 ?? null,
        pred_status: dbMatch?.pred_status || 'PENDING'
      };
    });
  };

  const matchesToShow = getConfirmedBracketMatches();

  const handlePredict = async (matchId, t1Name, t2Name, t1Goals, t2Goals) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          match_id: matchId, 
          t1: t1Name,
          t2: t2Name,
          pred_t1: parseInt(t1Goals), 
          pred_t2: parseInt(t2Goals) 
        })
      });
      if (res.ok) {
        fetchMatches();
      }
    } catch (e) {
      console.error('Erro ao salvar palpite:', e);
    }
  };

  const simulateRealMatch = async (matchId, t1Name, t2Name, t1Goals, t2Goals) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      // First ensure the prediction can be saved/match exists
      await handlePredict(matchId, t1Name, t2Name, t1Goals, t2Goals);
      
      const res = await fetch(`${apiUrl}/api/admin/simulate-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId, real_score_t1: parseInt(t1Goals), real_score_t2: parseInt(t2Goals) })
      });
      if (res.ok) {
        fetchMatches();
      }
    } catch (e) {
      console.error('Erro ao simular resultado:', e);
    }
  };

  const renderStatus = (match) => {
    if (match.status === 'CONFIRMED') {
      if (match.pred_status === 'PENDING' && match.pred_t1 !== null) return <span className="pred-status pending">Pendente</span>;
      return <span className="pred-status no-bet">Sem Palpite</span>;
    }
    if (match.status === 'FINISHED') {
      if (match.pred_status === 'CORRECT') return <span className="pred-status correct">✅ Acertou!</span>;
      if (match.pred_status === 'WRONG') return <span className="pred-status wrong">❌ Errou!</span>;
      return <span className="pred-status missed">Não Palpitou</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel predictions-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2 className="modal-title">Central de Palpites (Jogos Oficiais)</h2>
        
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="predictions-list">
            {matchesToShow.length === 0 ? (
              <p className="no-matches">Nenhuma partida real confirmada ainda. O mata-mata começa em Julho de 2026!</p>
            ) : (
              matchesToShow.map(m => (
                <div key={m.id} className="prediction-card">
                  <div className="pred-header">
                    <span className="pred-stage">{m.stage}</span>
                    {renderStatus(m)}
                  </div>
                  
                  <div className="pred-teams">
                    <div className="pred-team">
                      <span className="pred-team-name">{m.t1}</span>
                      {m.status === 'FINISHED' ? (
                        <span className="real-score">{m.score_t1}</span>
                      ) : (
                        <input 
                          type="number" 
                          min="0" 
                          defaultValue={m.pred_t1 ?? ''}
                          id={`pred_t1_${m.id}`}
                        />
                      )}
                    </div>
                    <span className="pred-vs">X</span>
                    <div className="pred-team">
                      {m.status === 'FINISHED' ? (
                        <span className="real-score">{m.score_t2}</span>
                      ) : (
                        <input 
                          type="number" 
                          min="0" 
                          defaultValue={m.pred_t2 ?? ''}
                          id={`pred_t2_${m.id}`}
                        />
                      )}
                      <span className="pred-team-name">{m.t2}</span>
                    </div>
                  </div>

                  {m.status === 'CONFIRMED' && (
                    <div className="btn-group">
                      <button 
                        className="save-pred-btn"
                        onClick={() => {
                          const t1G = document.getElementById(`pred_t1_${m.id}`).value;
                          const t2G = document.getElementById(`pred_t2_${m.id}`).value;
                          if(t1G !== '' && t2G !== '') handlePredict(m.id, m.t1, m.t2, t1G, t2G);
                        }}
                      >
                        Salvar Palpite
                      </button>
                      <button 
                        className="simulate-end-btn"
                        style={{marginTop: '10px', background: '#dc2626', color: 'white', padding: '10px', borderRadius: '5px', width: '100%', cursor: 'pointer', border: 'none', fontWeight: 'bold'}}
                        onClick={() => {
                          const t1G = document.getElementById(`pred_t1_${m.id}`).value || 0;
                          const t2G = document.getElementById(`pred_t2_${m.id}`).value || 0;
                          simulateRealMatch(m.id, m.t1, m.t2, t1G, t2G);
                        }}
                      >
                        🚨 [Admin] Encerrar Jogo (Placar Acima)
                      </button>
                    </div>
                  )}

                  {m.status === 'FINISHED' && m.pred_t1 !== null && (
                    <div className="your-bet-was">
                      Seu palpite foi: <strong>{m.pred_t1} x {m.pred_t2}</strong>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionsModal;
