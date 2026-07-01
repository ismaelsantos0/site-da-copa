import React, { useState, useEffect } from 'react';
import './App.css';

const AdminPanel = ({ onClose }) => {
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
      console.error('Erro ao buscar partidas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleUpdateTeams = async (matchId) => {
    const t1 = document.getElementById(`admin_t1_${matchId}`).value;
    const t2 = document.getElementById(`admin_t2_${matchId}`).value;
    
    if (!t1 || !t2) return alert('Preencha os dois times!');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/admin/update-teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId, t1, t2 })
      });
      if (res.ok) {
        alert('Equipes atualizadas com sucesso! A partida agora aparecerá para apostas.');
        fetchMatches();
      }
    } catch (e) {
      console.error('Erro ao atualizar equipes:', e);
    }
  };

  const handleSimulateResult = async (matchId) => {
    const score1 = document.getElementById(`admin_score1_${matchId}`).value;
    const score2 = document.getElementById(`admin_score2_${matchId}`).value;
    
    if (score1 === '' || score2 === '') return alert('Preencha os dois placares!');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/admin/simulate-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          match_id: matchId, 
          real_score_t1: parseInt(score1), 
          real_score_t2: parseInt(score2) 
        })
      });
      if (res.ok) {
        alert('Partida encerrada com sucesso!');
        fetchMatches();
      }
    } catch (e) {
      console.error('Erro ao simular resultado:', e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel admin-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '800px', width: '95%'}}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2 className="modal-title" style={{color: '#ef4444'}}>Painel de Administração (Apenas Dono)</h2>
        <p style={{textAlign: 'center', marginBottom: '15px'}}>Aqui você insere quais times passaram de fase na Vida Real para eles aparecerem na aba de Palpites.</p>
        
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="admin-list" style={{maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px'}}>
            {matches.map(m => (
              <div key={m.id} className="prediction-card" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #444', paddingBottom: '5px'}}>
                  <span style={{fontWeight: 'bold', color: '#eab308'}}>{m.id} - {m.stage}</span>
                  <span style={{color: m.status === 'FINISHED' ? '#10b981' : '#3b82f6'}}>{m.status}</span>
                </div>
                
                <div style={{display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <label style={{fontSize: '0.8rem'}}>Time 1</label>
                    <input type="text" id={`admin_t1_${m.id}`} defaultValue={m.t1 === 'TBD' ? '' : m.t1} placeholder="Ex: Brasil" style={{padding: '8px', borderRadius: '4px', border: 'none', background: '#222', color: 'white'}} disabled={m.status === 'FINISHED'} />
                  </div>
                  
                  <div style={{fontWeight: 'bold', color: '#888', marginTop: '20px'}}>X</div>
                  
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <label style={{fontSize: '0.8rem'}}>Time 2</label>
                    <input type="text" id={`admin_t2_${m.id}`} defaultValue={m.t2 === 'TBD' ? '' : m.t2} placeholder="Ex: Japão" style={{padding: '8px', borderRadius: '4px', border: 'none', background: '#222', color: 'white'}} disabled={m.status === 'FINISHED'} />
                  </div>
                </div>

                {m.status === 'CONFIRMED' && (
                  <button onClick={() => handleUpdateTeams(m.id)} style={{background: '#3b82f6', color: 'white', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>
                    Definir/Atualizar Times
                  </button>
                )}

                {/* Section for finishing the match */}
                {m.t1 !== 'TBD' && m.t2 !== 'TBD' && m.status === 'CONFIRMED' && (
                  <div style={{background: 'rgba(220, 38, 38, 0.1)', padding: '10px', borderRadius: '5px', marginTop: '10px', border: '1px solid rgba(220,38,38,0.3)'}}>
                    <p style={{fontSize: '0.9rem', marginBottom: '5px', textAlign: 'center', color: '#fca5a5'}}>Encerrar Partida (Fim de Jogo Real)</p>
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                      <input type="number" id={`admin_score1_${m.id}`} placeholder="Gols T1" style={{width: '70px', padding: '5px', textAlign: 'center'}} />
                      <input type="number" id={`admin_score2_${m.id}`} placeholder="Gols T2" style={{width: '70px', padding: '5px', textAlign: 'center'}} />
                      <button onClick={() => handleSimulateResult(m.id)} style={{background: '#dc2626', color: 'white', padding: '5px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>Confirmar Fim</button>
                    </div>
                  </div>
                )}
                
                {m.status === 'FINISHED' && (
                  <div style={{background: '#064e3b', padding: '8px', borderRadius: '4px', textAlign: 'center'}}>
                    Placar Final: {m.score_t1} x {m.score_t2}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
