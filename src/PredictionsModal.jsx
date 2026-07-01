import React, { useState, useEffect } from 'react';

const PredictionsModal = ({ onClose }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/real-matches`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMatches(data);
      } else {
        setMatches([]);
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

  const handlePredict = async (matchId, t1Goals, t2Goals) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          match_id: matchId, 
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

  // Filtrar para mostrar APENAS os jogos reais que não estão TBD
  const matchesToShow = matches.filter(m => (m.status === 'CONFIRMED' || m.status === 'FINISHED') && m.t1 !== 'TBD' && m.t2 !== 'TBD');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel predictions-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2 className="modal-title">Central de Palpites (Jogos da Vida Real)</h2>
        <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px'}}>Aqui aparecem os confrontos oficiais da Copa quando as seleções são decididas.</p>
        
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="predictions-list">
            {matchesToShow.length === 0 ? (
              <p className="no-matches">Ainda não temos nenhuma partida oficial de mata-mata com seleções definidas. Aguarde a fase de grupos terminar!</p>
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
                          if(t1G !== '' && t2G !== '') handlePredict(m.id, t1G, t2G);
                        }}
                      >
                        Salvar Palpite
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
