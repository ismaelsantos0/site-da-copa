import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { teamStats, calculateTeamStrength, getTacticalMultiplier } from './teamStats';
import './App.css';

const initialMatches = {
  left: {
    round1: [
      { id: 'm1', status: 'completed', t1: { f: '🇧🇷', n: 'Brasil', s: '2', w: true }, t2: { f: '🇯🇵', n: 'Japão', s: '1', w: false } },
      { id: 'm2', status: 'confirmed', t1: { f: '🇨🇮', n: 'C. do Marfim', s: '', w: false }, t2: { f: '🇳🇴', n: 'Noruega', s: '', w: false } },
      { id: 'm3', status: 'confirmed', t1: { f: '🇪🇸', n: 'Espanha', s: '', w: false }, t2: { f: '🇦🇹', n: 'Áustria', s: '', w: false } },
      { id: 'm4', status: 'confirmed', t1: { f: '🇨🇭', n: 'Suíça', s: '', w: false }, t2: { f: '🇩🇿', n: 'Argélia', s: '', w: false } },
      { id: 'm5', status: 'confirmed', t1: { f: '🇦🇷', n: 'Argentina', s: '', w: false }, t2: { f: '🇨🇻', n: 'Cabo Verde', s: '', w: false } },
      { id: 'm6', status: 'confirmed', t1: { f: '🇲🇽', n: 'México', s: '', w: false }, t2: { f: '🇪🇨', n: 'Equador', s: '', w: false } },
      { id: 'm7', status: 'confirmed', t1: { f: '🇳🇱', n: 'Holanda', s: '', w: false }, t2: { f: '🇲🇦', n: 'Marrocos', s: '', w: false } },
      { id: 'm8', status: 'confirmed', t1: { f: '🇦🇺', n: 'Austrália', s: '', w: false }, t2: { f: '🇪🇬', n: 'Egito', s: '', w: false } }
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
      { id: 'm9', status: 'confirmed', t1: { f: '🇫🇷', n: 'França', s: '', w: false }, t2: { f: '🇸🇪', n: 'Suécia', s: '', w: false } },
      { id: 'm10', status: 'completed', t1: { f: '🇿🇦', n: 'África do Sul', s: '0', w: false }, t2: { f: '🇨🇦', n: 'Canadá', s: '1', w: true } },
      { id: 'm11', status: 'confirmed', t1: { f: '🇨🇴', n: 'Colômbia', s: '', w: false }, t2: { f: '🇬🇭', n: 'Gana', s: '', w: false } },
      { id: 'm12', status: 'confirmed', t1: { f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', n: 'Inglaterra', s: '', w: false }, t2: { f: '🇨🇩', n: 'RD Congo', s: '', w: false } },
      { id: 'm13', status: 'completed', t1: { f: '🇩🇪', n: 'Alemanha', s: '1(3)', w: false }, t2: { f: '🇵🇾', n: 'Paraguai', s: '1(4)', w: true } },
      { id: 'm14', status: 'confirmed', t1: { f: '🇺🇸', n: 'Estados Unidos', s: '', w: false }, t2: { f: '🇧🇦', n: 'Bósnia', s: '', w: false } },
      { id: 'm15', status: 'confirmed', t1: { f: '🇵🇹', n: 'Portugal', s: '', w: false }, t2: { f: '🇭🇷', n: 'Croácia', s: '', w: false } },
      { id: 'm16', status: 'confirmed', t1: { f: '🇧🇪', n: 'Bélgica', s: '', w: false }, t2: { f: '🇸🇳', n: 'Senegal', s: '', w: false } }
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

const teamInfo = {
  'Brasil': { fifa: 'BRA', iso: 'br' },
  'Japão': { fifa: 'JPN', iso: 'jp' },
  'C. do Marfim': { fifa: 'CIV', iso: 'ci' },
  'Noruega': { fifa: 'NOR', iso: 'no' },
  'Espanha': { fifa: 'ESP', iso: 'es' },
  'Áustria': { fifa: 'AUT', iso: 'at' },
  'Suíça': { fifa: 'SUI', iso: 'ch' },
  'Argélia': { fifa: 'ALG', iso: 'dz' },
  'Argentina': { fifa: 'ARG', iso: 'ar' },
  'Cabo Verde': { fifa: 'CPV', iso: 'cv' },
  'México': { fifa: 'MEX', iso: 'mx' },
  'Equador': { fifa: 'ECU', iso: 'ec' },
  'Holanda': { fifa: 'NED', iso: 'nl' },
  'Marrocos': { fifa: 'MAR', iso: 'ma' },
  'Austrália': { fifa: 'AUS', iso: 'au' },
  'Egito': { fifa: 'EGY', iso: 'eg' },
  'França': { fifa: 'FRA', iso: 'fr' },
  'Suécia': { fifa: 'SWE', iso: 'se' },
  'África do Sul': { fifa: 'RSA', iso: 'za' },
  'Canadá': { fifa: 'CAN', iso: 'ca' },
  'Colômbia': { fifa: 'COL', iso: 'co' },
  'Gana': { fifa: 'GHA', iso: 'gh' },
  'Inglaterra': { fifa: 'ENG', iso: 'gb-eng' },
  'RD Congo': { fifa: 'COD', iso: 'cd' },
  'Alemanha': { fifa: 'GER', iso: 'de' },
  'Paraguai': { fifa: 'PAR', iso: 'py' },
  'Estados Unidos': { fifa: 'USA', iso: 'us' },
  'Bósnia': { fifa: 'BIH', iso: 'ba' },
  'Portugal': { fifa: 'POR', iso: 'pt' },
  'Croácia': { fifa: 'CRO', iso: 'hr' },
  'Bélgica': { fifa: 'BEL', iso: 'be' },
  'Senegal': { fifa: 'SEN', iso: 'sn' }
};

function App() {
  const [modalMatch, setModalMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDataCache, setTeamDataCache] = useState({});
  const [data, setData] = useState(initialMatches);
  const [lines, setLines] = useState([]);
  const [allOdds, setAllOdds] = useState([]);
  const [selectedMatchModal, setSelectedMatchModal] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiCache, setAiCache] = useState({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Efeito para buscar análise do backend quando um modal é aberto
  useEffect(() => {
    if (!selectedMatchModal) return;
    const { match, odds } = selectedMatchModal;
    if (aiCache[match.id]) return; // Já temos em memória
    if (!match.t1.n || !match.t2.n) return; // Times não definidos

    const fetchAnalysisFromBackend = async () => {
      try {
        const t1 = match.t1.n;
        const t2 = match.t2.n;
        const o1 = odds.t1Odd || 2.5;
        const o2 = odds.t2Odd || 2.5;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        // Bate no nosso servidor Node.js (que fará a orquestração com PostgreSQL, Sportmonks e Gemini)
        const res = await fetch(`${apiUrl}/api/analysis/${match.id}?t1=${encodeURIComponent(t1)}&t2=${encodeURIComponent(t2)}&t1Odd=${o1}&t2Odd=${o2}`);
        if (res.ok) {
          const data = await res.json();
          setAiCache(prev => ({ ...prev, [match.id]: data.text }));
        }
      } catch (err) {
        console.log("Backend offline ou análise indisponível no momento.");
      }
    };

    fetchAnalysisFromBackend();
  }, [selectedMatchModal, aiCache]);

  const openTeamModal = async (teamName) => {
    setSelectedTeam({ loading: true, nome: teamName });
    if (teamDataCache[teamName]) {
      setSelectedTeam(teamDataCache[teamName]);
    } else {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/team/${encodeURIComponent(teamName)}`);
        if (res.ok) {
          const tData = await res.json();
          setTeamDataCache(prev => ({ ...prev, [teamName]: tData }));
          setSelectedTeam(tData);
        } else {
          setSelectedTeam({ error: 'Ficha da seleção não encontrada.', nome: teamName });
        }
      } catch (err) {
        setSelectedTeam({ error: 'Erro de conexão com a nuvem.', nome: teamName });
      }
    }
  };

  const closeTeamModal = () => setSelectedTeam(null);

  const getMatchSchedule = (id) => {
    // Tabela realista da Copa 2026 adaptada para o Fuso UTC-4 (Horário de Roraima)
    const schedules = {
      // 16 avos de final (28 Jun - 3 Jul)
      'm1': '28 Jun 2026 • 12:00 (Roraima)', 'm2': '28 Jun 2026 • 16:00 (Roraima)',
      'm3': '29 Jun 2026 • 11:00 (Roraima)', 'm4': '29 Jun 2026 • 15:00 (Roraima)',
      'm5': '29 Jun 2026 • 19:00 (Roraima)', 'm6': '30 Jun 2026 • 12:00 (Roraima)',
      'm7': '30 Jun 2026 • 16:00 (Roraima)', 'm8': '30 Jun 2026 • 20:00 (Roraima)',
      'm9': '01 Jul 2026 • 12:00 (Roraima)', 'm10': '01 Jul 2026 • 16:00 (Roraima)',
      'm11': '02 Jul 2026 • 11:00 (Roraima)', 'm12': '02 Jul 2026 • 15:00 (Roraima)',
      'm13': '02 Jul 2026 • 19:00 (Roraima)', 'm14': '03 Jul 2026 • 12:00 (Roraima)',
      'm15': '03 Jul 2026 • 16:00 (Roraima)', 'm16': '03 Jul 2026 • 20:00 (Roraima)',
      // Oitavas (4 Jul - 7 Jul)
      'm17': '04 Jul 2026 • 14:00 (Roraima)', 'm18': '04 Jul 2026 • 18:00 (Roraima)',
      'm19': '05 Jul 2026 • 14:00 (Roraima)', 'm20': '05 Jul 2026 • 18:00 (Roraima)',
      'm21': '06 Jul 2026 • 14:00 (Roraima)', 'm22': '06 Jul 2026 • 18:00 (Roraima)',
      'm23': '07 Jul 2026 • 14:00 (Roraima)', 'm24': '07 Jul 2026 • 18:00 (Roraima)',
      // Quartas (9 Jul - 11 Jul)
      'm25': '09 Jul 2026 • 16:00 (Roraima)', 'm26': '10 Jul 2026 • 16:00 (Roraima)',
      'm27': '11 Jul 2026 • 13:00 (Roraima)', 'm28': '11 Jul 2026 • 17:00 (Roraima)',
      // Semis (14 Jul - 15 Jul)
      'm29': '14 Jul 2026 • 16:00 (Roraima)', 'm30': '15 Jul 2026 • 16:00 (Roraima)',
      // Final (19 Jul)
      'm31': '19 Jul 2026 • 15:00 (Roraima)'
    };
    return schedules[id] || 'Data a definir';
  };
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
    if (!teamName1 || !teamName2) return { t1Odd: null, t2Odd: null };

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

  const doSimulation = () => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      const processMatch = (targetObj) => {
        if (targetObj.status === 'completed') return; // Preserva resultados reais
        
        if (!targetObj.t1.n || !targetObj.t2.n) return;
        
        const { t1Odd, t2Odd } = getMatchOdds(targetObj.t1.n, targetObj.t2.n);
        if (!t1Odd || !t2Odd) return;

        const forcedT1Fav = t1Odd === t2Odd ? targetObj.t1.n.length > targetObj.t2.n.length : t1Odd < t2Odd;
        
        const favOdd = forcedT1Fav ? t1Odd : t2Odd;
        const underdogOdd = forcedT1Fav ? t2Odd : t1Odd;
        const diff = underdogOdd - favOdd;
        
        let favGoals, underGoals;
        
        if (diff > 5.0) { favGoals = '4'; underGoals = '0'; }
        else if (diff > 2.5) { favGoals = '3'; underGoals = '0'; }
        else if (diff > 1.2) { favGoals = '2'; underGoals = '0'; }
        else if (diff > 0.3) { favGoals = '2'; underGoals = '1'; }
        else {
          const favPens = 4 + (targetObj.t1.n.length % 2);
          const underPens = favPens - 1;
          favGoals = `1(${favPens})`; underGoals = `1(${underPens})`;
        }
        
        targetObj.t1.s = forcedT1Fav ? favGoals : underGoals;
        targetObj.t1.w = forcedT1Fav;
        targetObj.t2.s = forcedT1Fav ? underGoals : favGoals;
        targetObj.t2.w = !forcedT1Fav;
        targetObj.status = 'prediction';
      };

      const findNextMatch = (matchId) => {
        const conn = connectionsDef.find(c => c.from === matchId);
        if (!conn) return null;
        
        let nextMatch = null;
        if (conn.to === 'm31') nextMatch = newData.final;
        else {
          const sides = ['left', 'right'];
          const rounds = ['round1', 'round2', 'round3', 'round4'];
          for (let s of sides) {
            for (let r of rounds) {
              const m = newData[s][r].find(x => x.id === conn.to);
              if (m) nextMatch = m;
            }
          }
        }
        
        const isT1 = connectionsDef.filter(c => c.to === conn.to)[0].from === matchId;
        return { match: nextMatch, isT1 };
      };

      const propagateWinner = (matchObj) => {
        if (!matchObj.t1.w && !matchObj.t2.w) return;
        const next = findNextMatch(matchObj.id);
        if (next && next.match) {
          const winnerTeam = matchObj.t1.w ? matchObj.t1 : matchObj.t2;
          const targetTeam = next.isT1 ? next.match.t1 : next.match.t2;
          targetTeam.n = winnerTeam.n;
          targetTeam.f = winnerTeam.f;
          targetTeam.s = '';
          targetTeam.w = false;
          next.match.status = 'prediction';
        }
      };

      const roundsSequence = ['round1', 'round2', 'round3', 'round4'];
      roundsSequence.forEach(round => {
        ['left', 'right'].forEach(side => {
          newData[side][round].forEach(m => {
            processMatch(m);
            propagateWinner(m);
          });
        });
      });

      processMatch(newData.final);
      if (newData.final.t1.w !== undefined) {
        if (newData.final.t1.w) newData.final.champ = { f: newData.final.t1.f, n: newData.final.t1.n };
        else if (newData.final.t2.w) newData.final.champ = { f: newData.final.t2.f, n: newData.final.t2.n };
      }
      
      return newData;
    });
  };

  const simulateAll = () => {
    setIsSimulating(true);
    setTimeout(() => {
      try {
        doSimulation();
      } catch (err) {
        alert("Erro na simulação: " + err.message);
        console.error(err);
      } finally {
        setTimeout(() => setIsSimulating(false), 800);
      }
    }, 3500);
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
    const info = teamInfo[t.n] || { fifa: t.n ? t.n.substring(0, 3).toUpperCase() : '', iso: '' };

    return (
      <div className={`team ${t.w ? 'winner' : ''}`}>
        {info.iso ? (
          <img 
            src={`https://flagcdn.com/w40/${info.iso}.png`} 
            alt={t.n} 
            className="team-flag-img cursor-pointer" 
            draggable={false}
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              openTeamModal(t.n); 
            }} 
          />
        ) : (
          <div className="team-flag-placeholder"></div>
        )}
        <span className="team-abbr">{info.fifa}</span>
        <span className="team-score">{t.s}</span>
      </div>
    );
  };

  const renderRound = (matches, side, roundName) => {
    const connectors = [];
    for (let i = 0; i < matches.length; i += 2) {
      connectors.push(
        <div key={i} className="connector-block">
          <div 
            id={matches[i].id} 
            className={`match ${matches[i].status} clickable`}
            onClick={() => setSelectedMatchModal({ match: matches[i], side, round: roundName, odds: getMatchOdds(matches[i].t1.n, matches[i].t2.n) })}
          >
            {renderTeam(matches[i].t1, side, roundName, matches[i], 't1')}
            {renderTeam(matches[i].t2, side, roundName, matches[i], 't2')}
          </div>

          {matches[i+1] && (
            <div 
              id={matches[i+1].id} 
              className={`match ${matches[i+1].status} clickable`}
              onClick={() => setSelectedMatchModal({ match: matches[i+1], side, round: roundName, odds: getMatchOdds(matches[i+1].t1.n, matches[i+1].t2.n) })}
            >
              {renderTeam(matches[i+1].t1, side, roundName, matches[i+1], 't1')}
              {renderTeam(matches[i+1].t2, side, roundName, matches[i+1], 't2')}
            </div>
          )}
        </div>
      );
    }
    return <div className="round">{connectors}</div>;
  };

  const renderStatBar = (team1, team2, label, statKey) => {
    const s1 = teamStats[team1]?.[statKey] || 75;
    const s2 = teamStats[team2]?.[statKey] || 75;
    
    const max = 100;
    const p1 = (s1 / max) * 100;
    const p2 = (s2 / max) * 100;
    
    return (
      <div className="stat-row">
        <div className="stat-label">{label}</div>
        <div className="stat-bars">
          <span className="stat-val v1">{s1}</span>
          <div className="bar-wrapper b1">
            <div className="bar-fill" style={{width: `${p1}%`}}></div>
          </div>
          
          <div className="bar-wrapper b2">
            <div className="bar-fill" style={{width: `${p2}%`}}></div>
          </div>
          <span className="stat-val v2">{s2}</span>
        </div>
      </div>
    );
  };


  const renderMatchAnalysis = (match, odds) => {
    const t1 = match.t1;
    const t2 = match.t2;
    if (!t1.n || !t2.n) return null;

    const s1 = teamStats[t1.n] || { attack: 75, defense: 75, tactic: 'balanced' };
    const s2 = teamStats[t2.n] || { attack: 75, defense: 75, tactic: 'balanced' };
    
    const o1 = odds.t1Odd || 2.5;
    const o2 = odds.t2Odd || 2.5;

    let p1 = "";
    if (Math.abs(o1 - o2) < 0.3) {
      p1 = <span>Confronto extremamente equilibrado. As casas de apostas apontam um empate técnico.</span>;
    } else if (o1 < o2) {
      p1 = <span><strong>{t1.n}</strong> entra como favorita matemática (Odd {o1.toFixed(2)}).</span>;
    } else {
      p1 = <span><strong>{t2.n}</strong> entra como favorita matemática (Odd {o2.toFixed(2)}).</span>;
    }

    let p2 = "";
    const t1Advantage = s1.attack - s2.defense;
    const t2Advantage = s2.attack - s1.defense;
    
    if (t1Advantage > 5 && t2Advantage <= 5) {
      p2 = <span>O poder ofensivo de <strong>{t1.n}</strong> deve superar o bloqueio defensivo de {t2.n}.</span>;
    } else if (t2Advantage > 5 && t1Advantage <= 5) {
      p2 = <span>O poder ofensivo de <strong>{t2.n}</strong> leva grande vantagem sobre a defesa de {t1.n}.</span>;
    } else if (t1Advantage > 0 && t2Advantage > 0) {
      p2 = <span>Promessa de jogo aberto! Ambos os ataques são estatisticamente superiores às defesas adversárias.</span>;
    } else {
      p2 = <span>O jogo tende a ser truncado, com as defesas prevalecendo sobre os ataques de ambos os lados.</span>;
    }

    let p3 = null;
    if (match.t1.s !== '' && match.t2.s !== '') {
       const winner = match.t1.w ? t1.n : (match.t2.w ? t2.n : 'Empate');
       p3 = <div className="sim-result">🎯 <strong>Resultado Simulado:</strong> O encaixe tático resultou na vitória de <strong>{winner}</strong> por {match.t1.s} x {match.t2.s}.</div>;
    } else {
       const favored = o1 < o2 ? t1.n : t2.n;
       p3 = <div className="sim-result">🔮 <strong>Projeção:</strong> O motor tático sugere vantagem para <strong>{favored}</strong>. Rode a simulação para descobrir o placar!</div>;
    }

    return (
      <div className="match-analysis-box">
        <h3>📊 Análise Estatística</h3>
        <p>{p1} {p2}</p>
        {p3}

        <div className="ai-analysis-container">
          {aiCache[match.id] && (
            <div className="ai-response-box">
              <h4>🤖 Visão da Inteligência Artificial</h4>
              <div className="ai-text" dangerouslySetInnerHTML={{ __html: aiCache[match.id].replace(/\n/g, '<br/>') }}></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!selectedMatchModal) return null;
    const { match, side, round, odds } = selectedMatchModal;
    
    // Check if both teams are defined
    const isDefined = match.t1.n && match.t2.n;
    const schedule = getMatchSchedule(match.id);

    return (
      <div className="modal-overlay" onClick={() => setSelectedMatchModal(null)}>
        <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSelectedMatchModal(null)}>✖</button>
          
          <h2 className="modal-title">Detalhes da Partida</h2>
          <div className="modal-schedule">📅 {schedule}</div>

          {isDefined ? (
            <div className="modal-teams-stats">
              <div className="modal-team-row">
                <img src={`https://flagcdn.com/w80/${teamInfo[match.t1.n]?.iso || ''}.png`} className="modal-flag-img" alt={match.t1.n} onError={(e) => e.target.style.display='none'} />
                <span className="modal-name">{match.t1.n}</span>
                <span className="modal-odd">{odds.t1Odd ? odds.t1Odd.toFixed(2) : '-'}</span>
              </div>
              <div className="modal-vs">VS</div>
              <div className="modal-team-row">
                <img src={`https://flagcdn.com/w80/${teamInfo[match.t2.n]?.iso || ''}.png`} className="modal-flag-img" alt={match.t2.n} onError={(e) => e.target.style.display='none'} />
                <span className="modal-name">{match.t2.n}</span>
                <span className="modal-odd">{odds.t2Odd ? odds.t2Odd.toFixed(2) : '-'}</span>
              </div>
              
              <div className="stats-container">
                <h3>Estatísticas Táticas</h3>
                {renderStatBar(match.t1.n, match.t2.n, 'Ataque', 'attack')}
                {renderStatBar(match.t1.n, match.t2.n, 'Defesa', 'defense')}
                {renderStatBar(match.t1.n, match.t2.n, 'Retrospecto', 'form')}
              </div>
              
              {renderMatchAnalysis(match, odds)}
            </div>
          ) : (
            <div className="modal-tbd">
              <span className="tbd-icon">⏳</span>
              <p>Confronto a definir</p>
              <small>Esta partida depende dos resultados anteriores para sabermos quem vai jogar.</small>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderModal()}
      {isSimulating && (
        <div className="simulation-overlay">
          <div className="simulation-content">
            <div className="sim-spinner"></div>
            <h2 className="sim-title">Analisando dados...</h2>
            <div className="sim-steps">
              <p className="sim-step step-1">📊 Cruzando estatísticas de ataque e defesa</p>
              <p className="sim-step step-2">⚔️ Calculando vantagens táticas</p>
              <p className="sim-step step-3">🎯 Projetando placares prováveis</p>
              <p className="sim-step step-4">🏆 Definindo o campeão</p>
            </div>
          </div>
        </div>
      )}
      <div className="background-overlay"></div>
      
      <div className="app-header">
        <h1>🏆 Copa do Mundo 2026</h1>
        <div className="header-controls">
          <div className="legend">
            <div className="legend-item"><div className="legend-color completed"></div> Finalizado</div>
            <div className="legend-item"><div className="legend-color confirmed"></div> Confirmado</div>
            <div className="legend-item"><div className="legend-color prediction"></div> Especulação</div>
          </div>
          <button 
            className="btn-predict-all" 
            onClick={simulateAll}
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.7 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            {isSimulating ? '⏳ Aguarde...' : '🪄 Simular Tudo'}
          </button>
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
              <div className="round round-4">{renderRound(data.left.round4, 'left', 'round4')}</div>
            </div>

            <div className="final-wrapper">
              <div className="champion-box">
                <h2>CAMPEÃO</h2>
                <div className="champ-team">
                  {data.final.champ.n ? (
                    <>
                      <img src={`https://flagcdn.com/w80/${teamInfo[data.final.champ.n]?.iso || ''}.png`} className="champ-flag-img" alt={data.final.champ.n} onError={(e) => e.target.style.display='none'} />
                      <span className="champ-name-text">{data.final.champ.n}</span>
                    </>
                  ) : (
                    <span className="champ-name-text">A DEFINIR</span>
                  )}
                </div>
              </div>
              <div className="final-match-container">
                <div 
                  className={`match final-match ${data.final.status} clickable`} 
                  id={data.final.id}
                  onClick={() => setSelectedMatchModal({ match: data.final, side: 'final', round: null, odds: getMatchOdds(data.final.t1.n, data.final.t2.n) })}
                >
                   <div className="final-label">⚽ GRANDE FINAL</div>
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

      {/* MODAL DE VESTIÁRIO (ESCALAÇÃO DA SELEÇÃO) */}
      {selectedTeam && (
        <div className="modal-overlay" onClick={closeTeamModal}>
          <div className="team-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeTeamModal}>&times;</button>
            <div className="team-modal-header">
              <img src={`https://flagcdn.com/w160/${teamInfo[selectedTeam.nome]?.iso || ''}.png`} className="team-modal-flag" alt={selectedTeam.nome} />
              <h2>{selectedTeam.nome}</h2>
            </div>
            
            <div className="team-modal-body">
              {selectedTeam.loading ? (
                <div className="loading-spinner">Buscando ficha na nuvem...</div>
              ) : selectedTeam.error ? (
                <div className="error-msg">{selectedTeam.error}</div>
              ) : (
                <>
                  <div className="tactical-summary">
                    <h3>Modo Operanti</h3>
                    <p>{selectedTeam.taticas.modo_operanti}</p>
                    <p><strong>Destaque:</strong> {selectedTeam.taticas.jogador_chave}</p>
                  </div>

                  <div className="roster-section">
                    <h3>Titulares Oficiais</h3>
                    <div className="roster-list">
                      {selectedTeam.taticas.titulares.map((p, i) => (
                        <div key={i} className="player-row titular-row">
                          <span className="player-pos">{p.posicao}</span>
                          <span className="player-name">{p.nome}</span>
                          <span className="player-stats">
                            {p.gols > 0 && <span className="stat-icon">⚽ {p.gols}</span>}
                            {p.cartoes_amarelos > 0 && <span className="stat-icon yellow-card">🟨 {p.cartoes_amarelos}</span>}
                            {p.cartoes_vermelhos > 0 && <span className="stat-icon red-card">🟥 {p.cartoes_vermelhos}</span>}
                            {p.status !== "ok" && <span className="stat-icon injury">❤️‍🩹</span>}
                            <span className="player-rating">⭐ {p.nota}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="roster-section mt-4">
                    <h3>Banco de Reservas</h3>
                    <div className="roster-list">
                      {selectedTeam.taticas.reservas.map((p, i) => (
                        <div key={i} className="player-row reserva-row">
                          <span className="player-pos">{p.posicao}</span>
                          <span className="player-name">{p.nome}</span>
                          <span className="player-stats">
                            {p.gols > 0 && <span className="stat-icon">⚽ {p.gols}</span>}
                            {p.cartoes_amarelos > 0 && <span className="stat-icon yellow-card">🟨 {p.cartoes_amarelos}</span>}
                            {p.cartoes_vermelhos > 0 && <span className="stat-icon red-card">🟥 {p.cartoes_vermelhos}</span>}
                            {p.status !== "ok" && <span className="stat-icon injury">❤️‍🩹</span>}
                            <span className="player-rating">⭐ {p.nota}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
