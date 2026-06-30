import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { teamStats, calculateTeamStrength, getTacticalMultiplier } from './teamStats';
import './App.css';

const initialMatches = {
  left: {
    round1: [
      { id: 'm1', status: 'completed', t1: { f: '🇧🇷', n: 'Brasil', s: '2', w: true }, t2: { f: '🇯🇵', n: 'Japão', s: '1', w: false } },
      { id: 'm2', status: 'prediction', t1: { f: '🇨🇮', n: 'C. do Marfim', s: '', w: false }, t2: { f: '🇳🇴', n: 'Noruega', s: '', w: false } },
      { id: 'm3', status: 'prediction', t1: { f: '🇪🇸', n: 'Espanha', s: '', w: false }, t2: { f: '🇦🇹', n: 'Áustria', s: '', w: false } },
      { id: 'm4', status: 'prediction', t1: { f: '🇨🇭', n: 'Suíça', s: '', w: false }, t2: { f: '🇩🇿', n: 'Argélia', s: '', w: false } },
      { id: 'm5', status: 'prediction', t1: { f: '🇦🇷', n: 'Argentina', s: '', w: false }, t2: { f: '🇨🇻', n: 'Cabo Verde', s: '', w: false } },
      { id: 'm6', status: 'prediction', t1: { f: '🇲🇽', n: 'México', s: '', w: false }, t2: { f: '🇪🇨', n: 'Equador', s: '', w: false } },
      { id: 'm7', status: 'prediction', t1: { f: '🇳🇱', n: 'Holanda', s: '', w: false }, t2: { f: '🇲🇦', n: 'Marrocos', s: '', w: false } },
      { id: 'm8', status: 'prediction', t1: { f: '🇦🇺', n: 'Austrália', s: '', w: false }, t2: { f: '🇪🇬', n: 'Egito', s: '', w: false } }
    ],
    round2: [
      { id: 'm17', status: 'prediction', t1: { f: '🇧🇷', n: 'Brasil', s: '2', w: true }, t2: { f: '🇳🇴', n: 'Noruega', s: '1', w: false } },
      { id: 'm18', status: 'prediction', t1: { f: '🇪🇸', n: 'Espanha', s: '2', w: true }, t2: { f: '🇨🇭', n: 'Suíça', s: '0', w: false } },
      { id: 'm19', status: 'prediction', t1: { f: '🇦🇷', n: 'Argentina', s: '3', w: true }, t2: { f: '🇲🇽', n: 'México', s: '1', w: false } },
      { id: 'm20', status: 'prediction', t1: { f: '🇳🇱', n: 'Holanda', s: '1', w: true }, t2: { f: '🇦🇺', n: 'Austrália', s: '0', w: false } }
    ],
    round3: [
      { id: 'm25', status: 'prediction', t1: { f: '🇧🇷', n: 'Brasil', s: '0', w: false }, t2: { f: '🇪🇸', n: 'Espanha', s: '1', w: true } },
      { id: 'm26', status: 'prediction', t1: { f: '🇦🇷', n: 'Argentina', s: '2', w: true }, t2: { f: '🇳🇱', n: 'Holanda', s: '1', w: false } }
    ],
    round4: [
      { id: 'm29', status: 'prediction', t1: { f: '🇪🇸', n: 'Espanha', s: '0', w: false }, t2: { f: '🇦🇷', n: 'Argentina', s: '1', w: true } }
    ]
  },
  right: {
    round1: [
      { id: 'm9', status: 'prediction', t1: { f: '🇫🇷', n: 'França', s: '', w: false }, t2: { f: '🇸🇪', n: 'Suécia', s: '', w: false } },
      { id: 'm10', status: 'completed', t1: { f: '🇿🇦', n: 'África do Sul', s: '0', w: false }, t2: { f: '🇨🇦', n: 'Canadá', s: '1', w: true } },
      { id: 'm11', status: 'prediction', t1: { f: '🇨🇴', n: 'Colômbia', s: '', w: false }, t2: { f: '🇬🇭', n: 'Gana', s: '', w: false } },
      { id: 'm12', status: 'prediction', t1: { f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', n: 'Inglaterra', s: '', w: false }, t2: { f: '🇨🇩', n: 'RD Congo', s: '', w: false } },
      { id: 'm13', status: 'completed', t1: { f: '🇩🇪', n: 'Alemanha', s: '1(3)', w: false }, t2: { f: '🇵🇾', n: 'Paraguai', s: '1(4)', w: true } },
      { id: 'm14', status: 'prediction', t1: { f: '🇺🇸', n: 'Estados Unidos', s: '', w: false }, t2: { f: '🇧🇦', n: 'Bósnia', s: '', w: false } },
      { id: 'm15', status: 'prediction', t1: { f: '🇵🇹', n: 'Portugal', s: '', w: false }, t2: { f: '🇭🇷', n: 'Croácia', s: '', w: false } },
      { id: 'm16', status: 'prediction', t1: { f: '🇧🇪', n: 'Bélgica', s: '', w: false }, t2: { f: '🇸🇳', n: 'Senegal', s: '', w: false } }
    ],
    round2: [
      { id: 'm21', status: 'prediction', t1: { f: '🇫🇷', n: 'França', s: '3', w: true }, t2: { f: '🇨🇦', n: 'Canadá', s: '0', w: false } },
      { id: 'm22', status: 'prediction', t1: { f: '🇨🇴', n: 'Colômbia', s: '1(5)', w: true }, t2: { f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', n: 'Inglaterra', s: '1(4)', w: false } },
      { id: 'm23', status: 'prediction', t1: { f: '🇵🇾', n: 'Paraguai', s: '1', w: false }, t2: { f: '🇺🇸', n: 'Estados Unidos', s: '2', w: true } },
      { id: 'm24', status: 'prediction', t1: { f: '🇵🇹', n: 'Portugal', s: '1', w: true }, t2: { f: '🇧🇪', n: 'Bélgica', s: '0', w: false } }
    ],
    round3: [
      { id: 'm27', status: 'prediction', t1: { f: '🇫🇷', n: 'França', s: '2', w: true }, t2: { f: '🇨🇴', n: 'Colômbia', s: '0', w: false } },
      { id: 'm28', status: 'prediction', t1: { f: '🇺🇸', n: 'Estados Unidos', s: '1', w: false }, t2: { f: '🇵🇹', n: 'Portugal', s: '2', w: true } }
    ],
    round4: [
      { id: 'm30', status: 'prediction', t1: { f: '🇫🇷', n: 'França', s: '2', w: true }, t2: { f: '🇵🇹', n: 'Portugal', s: '1', w: false } }
    ]
  },
  final: {
    id: 'm31', status: 'prediction', t1: { f: '🇦🇷', n: 'Argentina', s: '2', w: false }, t2: { f: '🇫🇷', n: 'França', s: '3', w: true },
    champ: { f: '🇫🇷', n: 'França' }
  }
};

const connectionsDef = [
  { from: 'm1', to: 'm17', isLeft: true }, { from: 'm2', to: 'm17', isLeft: true },
  { from: 'm3', to: 'm18', isLeft: true }, { from: 'm4', to: 'm18', isLeft: true },
  { from: 'm5', to: 'm19', isLeft: true }, { from: 'm6', to: 'm19', isLeft: true },
  { from: 'm7', to: 'm20', isLeft: true }, { from: 'm8', to: 'm20', isLeft: true },
  { from: 'm17', to: 'm25', isLeft: true }, { from: 'm18', to: 'm25', isLeft: true },
  { from: 'm19', to: 'm26', isLeft: true }, { from: 'm20', to: 'm26', isLeft: true },
  { from: 'm25', to: 'm29', isLeft: true }, { from: 'm26', to: 'm29', isLeft: true },
  { from: 'm29', to: 'm31', isLeft: true },
  { from: 'm9', to: 'm21', isLeft: false }, { from: 'm10', to: 'm21', isLeft: false },
  { from: 'm11', to: 'm22', isLeft: false }, { from: 'm12', to: 'm22', isLeft: false },
  { from: 'm13', to: 'm23', isLeft: false }, { from: 'm14', to: 'm23', isLeft: false },
  { from: 'm15', to: 'm24', isLeft: false }, { from: 'm16', to: 'm24', isLeft: false },
  { from: 'm21', to: 'm27', isLeft: false }, { from: 'm22', to: 'm27', isLeft: false },
  { from: 'm23', to: 'm28', isLeft: false }, { from: 'm24', to: 'm28', isLeft: false },
  { from: 'm27', to: 'm30', isLeft: false }, { from: 'm28', to: 'm30', isLeft: false },
  { from: 'm30', to: 'm31', isLeft: false }
];

function App() {
  const [data, setData] = useState(initialMatches);
  const [lines, setLines] = useState([]);
  const [allOdds, setAllOdds] = useState([]);
  const [oddsFetched, setOddsFetched] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      console.warn('VITE_API_KEY ausente. Usando odds vazias (simulado localmente).');
      setOddsFetched(true);
      return;
    }

    fetch(`https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds/?apiKey=${apiKey}&regions=us&markets=h2h`)
      .then(res => res.json())
      .then(resData => {
        if (resData.message) {
           throw new Error(resData.message);
        }
        setAllOdds(resData);
      })
      .catch(err => {
        console.error('Erro ao buscar odds:', err);
      })
      .finally(() => {
        setOddsFetched(true);
      });
  }, []);

  const getMatchOdds = (teamName1, teamName2) => {
    let matchOdds = allOdds.find(m => 
      (m.home_team.toLowerCase().includes(teamName1.toLowerCase()) || m.away_team.toLowerCase().includes(teamName1.toLowerCase())) ||
      (m.home_team.toLowerCase().includes(teamName2.toLowerCase()) || m.away_team.toLowerCase().includes(teamName2.toLowerCase()))
    );

    if (matchOdds && matchOdds.bookmakers && matchOdds.bookmakers.length > 0) {
      const h2h = matchOdds.bookmakers[0].markets[0].outcomes;
      const t1Odd = h2h.find(o => o.name === matchOdds.home_team || o.name.includes(teamName1));
      const t2Odd = h2h.find(o => o.name === matchOdds.away_team || o.name.includes(teamName2));
      return { t1Odd: t1Odd?.price || null, t2Odd: t2Odd?.price || null };
    }

    // Fallback: Motor Estatístico Tático (teamStats.js)
    const str1 = calculateTeamStrength(teamName1);
    const str2 = calculateTeamStrength(teamName2);
    const stat1 = teamStats[teamName1] || { tactic: 'balanced' };
    const stat2 = teamStats[teamName2] || { tactic: 'balanced' };
    
    // Aplica bônus/pênalti tático de acordo com o embate de estilos
    const mult1 = getTacticalMultiplier(stat1.tactic, stat2.tactic);
    const mult2 = getTacticalMultiplier(stat2.tactic, stat1.tactic);
    
    const finalStr1 = str1 * mult1;
    const finalStr2 = str2 * mult2;
    
    const diff = finalStr1 - finalStr2;
    
    // Odd base para times idênticos é ~2.60. Cada ponto de força diminui/aumenta a odd
    let calcT1Odd = 2.6 - (diff * 0.08);
    let calcT2Odd = 2.6 + (diff * 0.08);
    
    // Limita as odds a valores realistas
    calcT1Odd = Math.max(1.10, Math.min(19.0, calcT1Odd));
    calcT2Odd = Math.max(1.10, Math.min(19.0, calcT2Odd));

    return {
       t1Odd: +calcT1Odd.toFixed(2),
       t2Odd: +calcT2Odd.toFixed(2)
    };
  };

  const updateMatch = (side, round, id, team, field, value) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (side === 'final') {
        if(team === 'champ') newData.final.champ[field] = value;
        else newData.final[team][field] = value;
      } else {
        const roundArr = newData[side][round];
        const mIdx = roundArr.findIndex(m => m.id === id);
        if (mIdx !== -1) {
          roundArr[mIdx][team][field] = value;
        }
      }
      return newData;
    });
  };

  const toggleStatus = (side, round, id) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (side === 'final') {
        newData.final.status = newData.final.status === 'completed' ? 'prediction' : 'completed';
      } else {
        const roundArr = newData[side][round];
        const mIdx = roundArr.findIndex(m => m.id === id);
        if (mIdx !== -1) {
          roundArr[mIdx].status = roundArr[mIdx].status === 'completed' ? 'prediction' : 'completed';
        }
      }
      return newData;
    });
  };

  const applyMagicPrediction = (matchObjInfo, side, round) => {
    const { t1Odd, t2Odd } = getMatchOdds(matchObjInfo.t1.n, matchObjInfo.t2.n);
    if (!t1Odd || !t2Odd || t1Odd === t2Odd) return;

    const isT1Fav = t1Odd < t2Odd;
    const favOdd = isT1Fav ? t1Odd : t2Odd;
    const underdogOdd = isT1Fav ? t2Odd : t1Odd;
    const diff = underdogOdd - favOdd;
    
    let favGoals, underGoals;
    
    // Lógica inteligente de placar baseada na diferença (distância) entre as odds
    if (diff > 5.0) {
      favGoals = '4'; underGoals = '0'; // Goleada absoluta (Super Favorito)
    } else if (diff > 2.5) {
      favGoals = '3'; underGoals = '0'; // Vitória muito folgada
    } else if (diff > 1.2) {
      favGoals = '2'; underGoals = '0'; // Vitória confortável
    } else if (diff > 0.5) {
      favGoals = '2'; underGoals = '1'; // Jogo disputado
    } else {
      // Jogo extremamente acirrado (odds quase iguais), vai para os pênaltis!
      const favPens = 4 + (matchObjInfo.t1.n.length % 2); // 4 ou 5
      const underPens = favPens - 1;
      favGoals = `1(${favPens})`; 
      underGoals = `1(${underPens})`;
    }

    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let targetObj;
      if (side === 'final') targetObj = newData.final;
      else targetObj = newData[side][round].find(m => m.id === matchObjInfo.id);
      
      if (targetObj) {
         targetObj.t1.s = isT1Fav ? favGoals : underGoals;
         targetObj.t1.w = isT1Fav;
         targetObj.t2.s = isT1Fav ? underGoals : favGoals;
         targetObj.t2.w = !isT1Fav;
      }
      return newData;
    });
  };

  useEffect(() => {
    const drawLines = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scale = rect.width / containerRef.current.offsetWidth || 1;

      const newLines = connectionsDef.map(conn => {
        const elFrom = document.getElementById(conn.from);
        const elTo = document.getElementById(conn.to);
        if (!elFrom || !elTo) return null;

        const r1 = elFrom.getBoundingClientRect();
        const r2 = elTo.getBoundingClientRect();
        
        const startY = (r1.top - rect.top + r1.height / 2) / scale;
        const endY = (r2.top - rect.top + r2.height / 2) / scale;
        let startX, endX;
        
        if (conn.isLeft) {
            startX = (r1.right - rect.left) / scale;
            endX = (r2.left - rect.left) / scale;
        } else {
            startX = (r1.left - rect.left) / scale;
            endX = (r2.right - rect.left) / scale;
        }
        
        const midX = (startX + endX) / 2;
        return {
          id: `${conn.from}-${conn.to}`,
          d: `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
        };
      }).filter(Boolean);
      setLines(newLines);
    };

    setTimeout(drawLines, 100);
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [data, allOdds]);

  const renderTeam = (t, side, round, matchObj, teamKey) => {
    const { t1Odd, t2Odd } = getMatchOdds(matchObj.t1.n, matchObj.t2.n);
    const myOdd = teamKey === 't1' ? t1Odd : t2Odd;
    const opponentOdd = teamKey === 't1' ? t2Odd : t1Odd;
    const isFav = myOdd && opponentOdd && myOdd < opponentOdd;

    return (
      <div className={`team ${t.w ? 'winner' : ''}`}>
        {myOdd && <span className={`inline-odd-badge ${isFav ? 'fav' : ''}`}>{myOdd.toFixed(2)}</span>}
        <input 
          className="editable-input team-flag-input" 
          value={t.f} 
          onChange={(e) => updateMatch(side, round, matchObj.id, teamKey, 'f', e.target.value)}
        />
        <input 
          className="editable-input" 
          value={t.n} 
          onChange={(e) => updateMatch(side, round, matchObj.id, teamKey, 'n', e.target.value)}
        />
        <input 
          className="editable-input team-score-input" 
          value={t.s} 
          onChange={(e) => updateMatch(side, round, matchObj.id, teamKey, 's', e.target.value)}
        />
      </div>
    );
  };

  const renderRound = (matches, side, roundName, isSingle = false) => {
    const connectors = [];
    for (let i = 0; i < matches.length; i += 2) {
      connectors.push(
        <div key={i} className="match-connector">
          <div className={`match ${matches[i].status}`} id={matches[i].id}>
            <button className="action-btn btn-status" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStatus(side, roundName, matches[i].id); }} title="Alternar Status">↺</button>
            <button className="action-btn btn-stats" onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyMagicPrediction(matches[i], side, roundName); }} title="Mágica: Prever Vencedor">🪄</button>
            {renderTeam(matches[i].t1, side, roundName, matches[i], 't1')}
            {renderTeam(matches[i].t2, side, roundName, matches[i], 't2')}
          </div>
          {matches[i+1] && (
            <div className={`match ${matches[i+1].status}`} id={matches[i+1].id}>
              <button className="action-btn btn-status" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStatus(side, roundName, matches[i+1].id); }} title="Alternar Status">↺</button>
              <button className="action-btn btn-stats" onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyMagicPrediction(matches[i+1], side, roundName); }} title="Mágica: Prever Vencedor">🪄</button>
              {renderTeam(matches[i+1].t1, side, roundName, matches[i+1], 't1')}
              {renderTeam(matches[i+1].t2, side, roundName, matches[i+1], 't2')}
            </div>
          )}
        </div>
      );
    }
    return connectors;
  };

  return (
    <>
      <div className="background-overlay"></div>
      
      <div className="app-header">
        <h1>🏆 Copa do Mundo 2026</h1>
        <div className="legend">
          <div className="legend-item"><div className="legend-color completed"></div> Realizado</div>
          <div className="legend-item"><div className="legend-color prediction"></div> Palpite</div>
        </div>
      </div>

      <TransformWrapper 
        initialScale={1} 
        minScale={0.3} 
        maxScale={2} 
        limitToBounds={false}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent wrapperStyle={{width: "100vw", height: "100vh"}}>
          <div className="bracket-container" ref={containerRef}>
            <svg className="bracket-lines">
              {lines.map(line => (
                <path key={line.id} d={line.d} className="line-path" />
              ))}
            </svg>

            <div className="bracket-side side-left">
              <div className="round round-1">{renderRound(data.left.round1, 'left', 'round1')}</div>
              <div className="round round-2">{renderRound(data.left.round2, 'left', 'round2')}</div>
              <div className="round round-3">{renderRound(data.left.round3, 'left', 'round3')}</div>
              <div className="round round-4">{renderRound(data.left.round4, 'left', 'round4', true)}</div>
            </div>

            <div className="center-stage">
              <div className="trophy">🏆</div>
              <div className="champion-box">
                <h2>CAMPEÃO</h2>
                <div className="champ-team">
                  <input className="editable-input team-flag-input" value={data.final.champ.f} onChange={(e) => updateMatch('final', null, null, 'champ', 'f', e.target.value)} />
                  <input className="editable-input" value={data.final.champ.n} onChange={(e) => updateMatch('final', null, null, 'champ', 'n', e.target.value)} style={{textAlign: 'center'}} />
                </div>
              </div>
              <div className="final-match-container">
                <div className="match final-match" id={data.final.id}>
                   <button className="action-btn btn-status" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStatus('final', null, data.final.id); }}>↺</button>
                   <button className="action-btn btn-stats" onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyMagicPrediction(data.final, 'final', null); }} title="Mágica: Prever Vencedor">🪄</button>
                  {renderTeam(data.final.t1, 'final', null, data.final, 't1')}
                  {renderTeam(data.final.t2, 'final', null, data.final, 't2')}
                </div>
              </div>
            </div>

            <div className="bracket-side side-right">
              <div className="round round-4">{renderRound(data.right.round4, 'right', 'round4', true)}</div>
              <div className="round round-3">{renderRound(data.right.round3, 'right', 'round3')}</div>
              <div className="round round-2">{renderRound(data.right.round2, 'right', 'round2')}</div>
              <div className="round round-1">{renderRound(data.right.round1, 'right', 'round1')}</div>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </>
  );
}

export default App;
