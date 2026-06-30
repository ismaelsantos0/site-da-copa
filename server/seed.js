import pool, { saveTeamInfo } from './db.js';

const teamsData = [
  {
    name: 'Brasil',
    sportmonksId: 6,
    tacticalData: {
      starters: ['Alisson', 'Danilo', 'Marquinhos', 'Gabriel Magalhães', 'Guilherme Arana', 'Bruno Guimarães', 'Lucas Paquetá', 'João Gomes', 'Raphinha', 'Rodrygo', 'Vinícius Júnior'],
      subs: ['Ederson', 'Éder Militão', 'Endrick', 'Douglas Luiz', 'Gabriel Martinelli'],
      ratings: { attack: 9.5, defense: 8.0, midfield: 8.5 },
      strategy: 'Jogo ofensivo e veloz pelas pontas, buscando o 1 contra 1 com Vini Jr e Raphinha. Transição rápida.',
      keyPlayer: 'Vinícius Júnior (Nota: 9.8)',
      weakness: 'Bolas aéreas defensivas e recomposição em contra-ataques rápidos.'
    }
  },
  {
    name: 'França',
    sportmonksId: 9,
    tacticalData: {
      starters: ['Maignan', 'Koundé', 'Saliba', 'Upamecano', 'Theo Hernández', 'Tchouaméni', 'Kanté', 'Rabiot', 'Griezmann', 'Dembélé', 'Mbappé'],
      subs: ['Areola', 'Konaté', 'Camavinga', 'Giroud', 'Kolo Muani'],
      ratings: { attack: 9.5, defense: 9.0, midfield: 9.0 },
      strategy: 'Defesa sólida com transição fulminante. Explora as costas da defesa adversária com a velocidade de Mbappé.',
      keyPlayer: 'Kylian Mbappé (Nota: 9.9)',
      weakness: 'Às vezes cede o controle do meio campo contra times que tocam muito a bola.'
    }
  },
  {
    name: 'Argentina',
    sportmonksId: 11,
    tacticalData: {
      starters: ['Dibu Martínez', 'Molina', 'Romero', 'Otamendi', 'Tagliafico', 'De Paul', 'Enzo Fernández', 'Mac Allister', 'Messi', 'Di María', 'Julián Álvarez'],
      subs: ['Rulli', 'Lisandro Martínez', 'Paredes', 'Lautaro Martínez', 'Garnacho'],
      ratings: { attack: 9.0, defense: 8.5, midfield: 9.5 },
      strategy: 'Controle intenso do meio campo, muita garra e posse de bola buscando passes verticais para Messi e Álvarez.',
      keyPlayer: 'Lionel Messi (Nota: 9.8)',
      weakness: 'Defesa pode sofrer contra atacantes muito rápidos e fortes fisicamente.'
    }
  },
  {
    name: 'Espanha',
    sportmonksId: 10,
    tacticalData: {
      starters: ['Unai Simón', 'Carvajal', 'Le Normand', 'Laporte', 'Cucurella', 'Rodri', 'Fabián Ruiz', 'Pedri', 'Lamine Yamal', 'Nico Williams', 'Morata'],
      subs: ['Raya', 'Nacho', 'Merino', 'Dani Olmo', 'Oyarzabal'],
      ratings: { attack: 8.5, defense: 8.5, midfield: 9.5 },
      strategy: 'Tiki-taka moderno. Muita posse de bola, triangulações e agora pontas muito agressivos (Yamal e Williams).',
      keyPlayer: 'Rodri (Nota: 9.7)',
      weakness: 'Falta um "camisa 9" matador consistente; sofre para furar retrancas pesadas.'
    }
  },
  {
    name: 'Inglaterra',
    sportmonksId: 14,
    tacticalData: {
      starters: ['Pickford', 'Walker', 'Stones', 'Guehi', 'Trippier', 'Rice', 'Mainoo', 'Bellingham', 'Saka', 'Foden', 'Harry Kane'],
      subs: ['Ramsdale', 'Alexander-Arnold', 'Gallagher', 'Palmer', 'Watkins'],
      ratings: { attack: 9.0, defense: 8.5, midfield: 9.0 },
      strategy: 'Forte controle tático, foca na genialidade de Bellingham e nas finalizações de Kane. Tendência a segurar resultados.',
      keyPlayer: 'Jude Bellingham (Nota: 9.6)',
      weakness: 'Pode se tornar muito defensiva e previsível sob pressão.'
    }
  },
  {
    name: 'Holanda',
    sportmonksId: 13,
    tacticalData: {
      starters: ['Verbruggen', 'Dumfries', 'De Vrij', 'Van Dijk', 'Aké', 'Schouten', 'Reijnders', 'Simons', 'Gakpo', 'Depay', 'Malen'],
      subs: ['Flekken', 'De Ligt', 'Veerman', 'Wijnaldum', 'Weghorst'],
      ratings: { attack: 8.5, defense: 9.0, midfield: 8.0 },
      strategy: 'Jogo ofensivo pelas alas, cruzamentos e infiltrações fortes de Gakpo.',
      keyPlayer: 'Cody Gakpo (Nota: 9.0)',
      weakness: 'Meio campo às vezes carece de criatividade contra defesas fechadas.'
    }
  },
  {
    name: 'Japão',
    sportmonksId: 15,
    tacticalData: {
      starters: ['Suzuki', 'Sugawara', 'Itakura', 'Tomiyasu', 'Ito', 'Endo', 'Morita', 'Kubo', 'Minamino', 'Mitoma', 'Ueda'],
      subs: ['Maekawa', 'Machida', 'Kamada', 'Doan', 'Asano'],
      ratings: { attack: 8.0, defense: 7.5, midfield: 8.5 },
      strategy: 'Disciplina tática absurda, transições muito rápidas e contra-ataques precisos.',
      keyPlayer: 'Kaoru Mitoma (Nota: 8.7)',
      weakness: 'Vulnerabilidade física e em bolas aéreas defensivas.'
    }
  },
  {
    name: 'Noruega',
    sportmonksId: 16,
    tacticalData: {
      starters: ['Nyland', 'Ryerson', 'Ajer', 'Ostigard', 'Meling', 'Odegaard', 'Berg', 'Berge', 'Bobb', 'Haaland', 'Sorloth'],
      subs: ['Selvik', 'Hanche-Olsen', 'Thorstvedt', 'Nusa', 'Larsen'],
      ratings: { attack: 9.0, defense: 7.0, midfield: 8.0 },
      strategy: 'Bolas diretas e cruzamentos buscando a imposição física surreal de Haaland.',
      keyPlayer: 'Erling Haaland (Nota: 9.8)',
      weakness: 'Defesa frágil e dependência extrema da dupla Odegaard-Haaland.'
    }
  },
  {
    name: 'Senegal',
    sportmonksId: 18,
    tacticalData: {
      starters: ['Mendy', 'Sabaly', 'Koulibaly', 'Diallo', 'Jakobs', 'Pape Sarr', 'Gueye', 'Camara', 'Sarr', 'Mané', 'Jackson'],
      subs: ['Diaw', 'Niakhaté', 'Mendy', 'Dieng', 'Ndiaye'],
      ratings: { attack: 8.5, defense: 8.0, midfield: 7.5 },
      strategy: 'Forte fisicamente, usa a experiência de Koulibaly e Mané para controlar jogos.',
      keyPlayer: 'Sadio Mané (Nota: 8.8)',
      weakness: 'Falta consistência tática contra seleções da primeira prateleira.'
    }
  },
  {
    name: 'México',
    sportmonksId: 19,
    tacticalData: {
      starters: ['Ochoa', 'Sánchez', 'Montes', 'Vásquez', 'Arteaga', 'Álvarez', 'Chávez', 'Pineda', 'Antuna', 'Quiñones', 'Giménez'],
      subs: ['Malagón', 'Romo', 'Rodríguez', 'Lozano', 'Martín'],
      ratings: { attack: 7.5, defense: 7.5, midfield: 8.0 },
      strategy: 'Jogo de intensidade, pressão alta e velocidade pelos lados.',
      keyPlayer: 'Edson Álvarez (Nota: 8.5)',
      weakness: 'Finalização e defesa em bolas paradas.'
    }
  }
];

const seedDatabase = async () => {
  console.log('🌱 Iniciando o Seed do Banco de Dados com Dados Táticos...');
  let count = 0;
  for (const team of teamsData) {
    try {
      await saveTeamInfo(team.name, team.sportmonksId, team.tacticalData);
      console.log(`✅ Time salvo: ${team.name}`);
      count++;
    } catch (err) {
      console.error(`❌ Erro ao salvar ${team.name}:`, err.message);
    }
  }
  console.log(`🎉 Seed concluído! ${count} seleções cadastradas.`);
  
  // Encerra a conexão com o banco para o script poder finalizar
  await pool.end();
};

seedDatabase();
