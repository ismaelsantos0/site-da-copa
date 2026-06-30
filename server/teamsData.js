import { missingTeams } from './missingTeams.js';

export const teamsData = [
  {
    nome: 'Brasil',
    sportmonksId: 6,
    taticas: {
      titulares: [
        { nome: "Alisson", posicao: "GOL", nota: 8.5, status: "ok" },
        { nome: "Danilo", posicao: "LAT", nota: 7.5, status: "ok" },
        { nome: "Marquinhos", posicao: "ZAG", nota: 8.8, status: "ok" },
        { nome: "Gabriel Magalhães", posicao: "ZAG", nota: 8.5, status: "ok" },
        { nome: "Guilherme Arana", posicao: "LAT", nota: 8.0, status: "ok" },
        { nome: "Bruno Guimarães", posicao: "MEI", nota: 8.7, status: "ok" },
        { nome: "Lucas Paquetá", posicao: "MEI", nota: 8.2, status: "ok" },
        { nome: "João Gomes", posicao: "MEI", nota: 8.0, status: "ok" },
        { nome: "Raphinha", posicao: "ATA", nota: 8.9, status: "ok" },
        { nome: "Rodrygo", posicao: "ATA", nota: 9.0, status: "ok" },
        { nome: "Vinícius Júnior", posicao: "ATA", nota: 9.8, status: "ok" }
      ],
      reservas: [
        { nome: "Ederson", posicao: "GOL", nota: 8.5, status: "ok" },
        { nome: "Éder Militão", posicao: "ZAG", nota: 8.6, status: "ok" },
        { nome: "Endrick", posicao: "ATA", nota: 8.4, status: "ok" },
        { nome: "Douglas Luiz", posicao: "MEI", nota: 8.1, status: "ok" },
        { nome: "Savinho", posicao: "ATA", nota: 8.3, status: "ok" }
      ],
      estrategia_principal: "Ofensiva com transição rápida e foco no talento individual das pontas.",
      modo_operanti: "Inicia o jogo pressionando alto. Busca isolar Vini Jr no mano a mano.",
      pontos_fortes: "Ataque extremamente veloz, imprevisível e letal em contra-ataques.",
      pontos_fracos: "Vulnerabilidade em bolas cruzadas na área defensiva e perda de controle no meio campo.",
      notas_gerais: { ataque: 9.5, defesa: 8.0, meio: 8.5 },
      jogador_chave: "Vinícius Júnior"
    }
  },
  {
    nome: 'França',
    sportmonksId: 9,
    taticas: {
      titulares: [
        { nome: "Maignan", posicao: "GOL", nota: 8.8, status: "ok" },
        { nome: "Koundé", posicao: "LAT", nota: 8.5, status: "ok" },
        { nome: "Saliba", posicao: "ZAG", nota: 9.2, status: "ok" },
        { nome: "Upamecano", posicao: "ZAG", nota: 8.4, status: "ok" },
        { nome: "Theo Hernández", posicao: "LAT", nota: 8.9, status: "ok" },
        { nome: "Tchouaméni", posicao: "MEI", nota: 8.7, status: "ok" },
        { nome: "Kanté", posicao: "MEI", nota: 9.0, status: "ok" },
        { nome: "Rabiot", posicao: "MEI", nota: 8.2, status: "ok" },
        { nome: "Griezmann", posicao: "MEI", nota: 9.1, status: "ok" },
        { nome: "Dembélé", posicao: "ATA", nota: 8.5, status: "ok" },
        { nome: "Mbappé", posicao: "ATA", nota: 9.9, status: "ok" }
      ],
      reservas: [
        { nome: "Camavinga", posicao: "MEI", nota: 8.8, status: "ok" },
        { nome: "Giroud", posicao: "ATA", nota: 8.0, status: "ok" },
        { nome: "Konaté", posicao: "ZAG", nota: 8.5, status: "ok" },
        { nome: "Kolo Muani", posicao: "ATA", nota: 8.2, status: "ok" },
        { nome: "Barcola", posicao: "ATA", nota: 8.3, status: "ok" }
      ],
      estrategia_principal: "Sólida base defensiva com saídas fulminantes explorando o espaço nas costas do adversário.",
      modo_operanti: "Aceita jogar sem a bola em certos momentos para atrair o rival e usar a explosão de Mbappé.",
      pontos_fortes: "Poder de fogo absurdo, transição mais rápida do mundo, defesa fisicamente dominante.",
      pontos_fracos: "Falta de criatividade para furar retrancas muito fechadas quando o adversário não dá espaços.",
      notas_gerais: { ataque: 9.8, defesa: 9.0, meio: 9.0 },
      jogador_chave: "Kylian Mbappé"
    }
  },
  {
    nome: 'Argentina',
    sportmonksId: 11,
    taticas: {
      titulares: [
        { nome: "Emiliano Martínez", posicao: "GOL", nota: 9.0, status: "ok" },
        { nome: "Molina", posicao: "LAT", nota: 8.2, status: "ok" },
        { nome: "Romero", posicao: "ZAG", nota: 9.1, status: "ok" },
        { nome: "Otamendi", posicao: "ZAG", nota: 8.3, status: "ok" },
        { nome: "Tagliafico", posicao: "LAT", nota: 8.1, status: "ok" },
        { nome: "De Paul", posicao: "MEI", nota: 8.8, status: "ok" },
        { nome: "Enzo Fernández", posicao: "MEI", nota: 8.7, status: "ok" },
        { nome: "Mac Allister", posicao: "MEI", nota: 8.9, status: "ok" },
        { nome: "Messi", posicao: "ATA", nota: 9.8, status: "ok" },
        { nome: "Di María", posicao: "ATA", nota: 8.8, status: "ok" },
        { nome: "Julián Álvarez", posicao: "ATA", nota: 8.9, status: "ok" }
      ],
      reservas: [
        { nome: "Lautaro Martínez", posicao: "ATA", nota: 8.7, status: "ok" },
        { nome: "Paredes", posicao: "MEI", nota: 8.3, status: "ok" },
        { nome: "Lisandro Martínez", posicao: "ZAG", nota: 8.6, status: "ok" },
        { nome: "Garnacho", posicao: "ATA", nota: 8.4, status: "ok" },
        { nome: "Lo Celso", posicao: "MEI", nota: 8.2, status: "ok" }
      ],
      estrategia_principal: "Intensidade altíssima no meio campo para recuperar a bola e passes geniais de Messi.",
      modo_operanti: "Cadencia o jogo quando está vencendo. O meio campo gira a bola até encontrar espaços entrelinhas.",
      pontos_fortes: "Mentalidade vencedora incrível, goleiro pegador de pênaltis, controle absoluto do meio campo.",
      pontos_fracos: "Zagueiros expostos contra atacantes muito altos e fortes fisicamente.",
      notas_gerais: { ataque: 9.2, defesa: 8.5, meio: 9.5 },
      jogador_chave: "Lionel Messi"
    }
  },
  {
    nome: 'Inglaterra',
    sportmonksId: 14,
    taticas: {
      titulares: [
        { nome: "Pickford", posicao: "GOL", nota: 8.4, status: "ok" },
        { nome: "Walker", posicao: "LAT", nota: 8.8, status: "ok" },
        { nome: "Stones", posicao: "ZAG", nota: 8.7, status: "ok" },
        { nome: "Guehi", posicao: "ZAG", nota: 8.2, status: "ok" },
        { nome: "Trippier", posicao: "LAT", nota: 8.0, status: "ok" },
        { nome: "Rice", posicao: "MEI", nota: 9.1, status: "ok" },
        { nome: "Mainoo", posicao: "MEI", nota: 8.3, status: "ok" },
        { nome: "Bellingham", posicao: "MEI", nota: 9.6, status: "ok" },
        { nome: "Saka", posicao: "ATA", nota: 9.0, status: "ok" },
        { nome: "Foden", posicao: "ATA", nota: 8.8, status: "ok" },
        { nome: "Harry Kane", posicao: "ATA", nota: 9.4, status: "ok" }
      ],
      reservas: [
        { nome: "Palmer", posicao: "MEI", nota: 8.9, status: "ok" },
        { nome: "Alexander-Arnold", posicao: "LAT", nota: 8.6, status: "ok" },
        { nome: "Watkins", posicao: "ATA", nota: 8.5, status: "ok" },
        { nome: "Gallagher", posicao: "MEI", nota: 8.0, status: "ok" },
        { nome: "Konsa", posicao: "ZAG", nota: 7.9, status: "ok" }
      ],
      estrategia_principal: "Controle tático e retenção de posse. Confia em lances de genialidade de Bellingham e finalização de Kane.",
      modo_operanti: "Tem o costume de fazer o gol e recuar suas linhas, jogando de forma mais reativa.",
      pontos_fortes: "Elenco estrelado com talento individual capaz de resolver o jogo em um toque.",
      pontos_fracos: "Falta de fluidez coletiva em momentos cruciais. Muito conservadora.",
      notas_gerais: { ataque: 9.3, defesa: 8.5, meio: 9.2 },
      jogador_chave: "Jude Bellingham"
    }
  },
  {
    nome: 'Espanha',
    sportmonksId: 10,
    taticas: {
      titulares: [
        { nome: "Unai Simón", posicao: "GOL", nota: 8.3, status: "ok" },
        { nome: "Carvajal", posicao: "LAT", nota: 8.9, status: "ok" },
        { nome: "Le Normand", posicao: "ZAG", nota: 8.4, status: "ok" },
        { nome: "Laporte", posicao: "ZAG", nota: 8.6, status: "ok" },
        { nome: "Cucurella", posicao: "LAT", nota: 8.5, status: "ok" },
        { nome: "Rodri", posicao: "MEI", nota: 9.7, status: "ok" },
        { nome: "Fabián Ruiz", posicao: "MEI", nota: 8.8, status: "ok" },
        { nome: "Dani Olmo", posicao: "MEI", nota: 8.9, status: "ok" },
        { nome: "Lamine Yamal", posicao: "ATA", nota: 9.2, status: "ok" },
        { nome: "Nico Williams", posicao: "ATA", nota: 9.0, status: "ok" },
        { nome: "Morata", posicao: "ATA", nota: 8.0, status: "ok" }
      ],
      reservas: [
        { nome: "Raya", posicao: "GOL", nota: 8.4, status: "ok" },
        { nome: "Pedri", posicao: "MEI", nota: 8.8, status: "ok" },
        { nome: "Merino", posicao: "MEI", nota: 8.3, status: "ok" },
        { nome: "Oyarzabal", posicao: "ATA", nota: 8.1, status: "ok" },
        { nome: "Navas", posicao: "LAT", nota: 7.8, status: "ok" }
      ],
      estrategia_principal: "Tiki-taka ultra ofensivo com alas espetadores (Yamal e Williams).",
      modo_operanti: "Pressiona imediatamente após perder a bola. Sufoca o adversário no campo de defesa dele.",
      pontos_fortes: "Controle absoluto da bola e pontas que quebram as linhas de marcação com dribles.",
      pontos_fracos: "Morata desperdiça muitas chances. Pode ser surpreendida em contra-ataques.",
      notas_gerais: { ataque: 9.0, defesa: 8.6, meio: 9.8 },
      jogador_chave: "Rodri"
    }
  },
  {
    nome: 'Portugal',
    sportmonksId: 12,
    taticas: {
      titulares: [
        { nome: "Diogo Costa", posicao: "GOL", nota: 8.9, status: "ok" },
        { nome: "Cancelo", posicao: "LAT", nota: 8.5, status: "ok" },
        { nome: "Rúben Dias", posicao: "ZAG", nota: 9.0, status: "ok" },
        { nome: "Pepe", posicao: "ZAG", nota: 8.2, status: "ok" },
        { nome: "Nuno Mendes", posicao: "LAT", nota: 8.6, status: "ok" },
        { nome: "Palhinha", posicao: "MEI", nota: 8.5, status: "ok" },
        { nome: "Vitinha", posicao: "MEI", nota: 8.9, status: "ok" },
        { nome: "Bruno Fernandes", posicao: "MEI", nota: 9.2, status: "ok" },
        { nome: "Bernardo Silva", posicao: "MEI", nota: 9.0, status: "ok" },
        { nome: "Rafael Leão", posicao: "ATA", nota: 8.7, status: "ok" },
        { nome: "Cristiano Ronaldo", posicao: "ATA", nota: 8.8, status: "ok" }
      ],
      reservas: [
        { nome: "Rui Patrício", posicao: "GOL", nota: 7.8, status: "ok" },
        { nome: "Diogo Jota", posicao: "ATA", nota: 8.5, status: "ok" },
        { nome: "João Félix", posicao: "ATA", nota: 8.0, status: "ok" },
        { nome: "Dalot", posicao: "LAT", nota: 8.2, status: "ok" },
        { nome: "Gonçalo Ramos", posicao: "ATA", nota: 8.1, status: "ok" }
      ],
      estrategia_principal: "Criatividade máxima no meio campo alimentando os finalizadores na área.",
      modo_operanti: "Bruno Fernandes comanda as ações, cruzamentos constantes buscando Cristiano Ronaldo.",
      pontos_fortes: "Talento absurdo no meio campo, goleiro pegador de pênaltis.",
      pontos_fracos: "Falta de intensidade defensiva na frente, dependência de cruzamentos.",
      notas_gerais: { ataque: 9.0, defesa: 8.6, meio: 9.4 },
      jogador_chave: "Bruno Fernandes"
    }
  },
  {
    nome: 'Japão',
    sportmonksId: 15,
    taticas: {
      titulares: [
        { nome: "Suzuki", posicao: "GOL", nota: 7.5, status: "ok" },
        { nome: "Sugawara", posicao: "LAT", nota: 7.8, status: "ok" },
        { nome: "Itakura", posicao: "ZAG", nota: 8.0, status: "ok" },
        { nome: "Tomiyasu", posicao: "ZAG", nota: 8.3, status: "ok" },
        { nome: "Ito", posicao: "LAT", nota: 7.9, status: "ok" },
        { nome: "Endo", posicao: "MEI", nota: 8.5, status: "ok" },
        { nome: "Morita", posicao: "MEI", nota: 8.2, status: "ok" },
        { nome: "Kubo", posicao: "MEI", nota: 8.6, status: "ok" },
        { nome: "Minamino", posicao: "ATA", nota: 8.3, status: "ok" },
        { nome: "Mitoma", posicao: "ATA", nota: 8.7, status: "ok" },
        { nome: "Ueda", posicao: "ATA", nota: 8.1, status: "ok" }
      ],
      reservas: [
        { nome: "Machida", posicao: "ZAG", nota: 7.7, status: "ok" },
        { nome: "Kamada", posicao: "MEI", nota: 8.0, status: "ok" },
        { nome: "Doan", posicao: "ATA", nota: 8.2, status: "ok" },
        { nome: "Asano", posicao: "ATA", nota: 7.9, status: "ok" },
        { nome: "Maeda", posicao: "ATA", nota: 7.8, status: "ok" }
      ],
      estrategia_principal: "Intensidade total, disciplina tática e contra-ataques fulminantes usando Mitoma e Kubo.",
      modo_operanti: "Recuam as linhas organizadamente contra times grandes e saem em bloco com muita velocidade.",
      pontos_fortes: "Transição ofensiva impecável, fôlego infinito e aplicação tática.",
      pontos_fracos: "Fraqueza em bolas aéreas e falta de imposição física contra zagueiros robustos.",
      notas_gerais: { ataque: 8.4, defesa: 7.9, meio: 8.3 },
      jogador_chave: "Kaoru Mitoma"
    }
  },
  {
    nome: 'Alemanha',
    sportmonksId: 8,
    taticas: {
      titulares: [
        { nome: "Neuer", posicao: "GOL", nota: 8.7, status: "ok" },
        { nome: "Kimmich", posicao: "LAT", nota: 9.0, status: "ok" },
        { nome: "Rüdiger", posicao: "ZAG", nota: 9.1, status: "ok" },
        { nome: "Tah", posicao: "ZAG", nota: 8.5, status: "ok" },
        { nome: "Mittelstädt", posicao: "LAT", nota: 8.0, status: "ok" },
        { nome: "Kroos", posicao: "MEI", nota: 9.6, status: "ok" },
        { nome: "Andrich", posicao: "MEI", nota: 8.3, status: "ok" },
        { nome: "Gündogan", posicao: "MEI", nota: 8.8, status: "ok" },
        { nome: "Musiala", posicao: "ATA", nota: 9.4, status: "ok" },
        { nome: "Wirtz", posicao: "ATA", nota: 9.2, status: "ok" },
        { nome: "Havertz", posicao: "ATA", nota: 8.6, status: "ok" }
      ],
      reservas: [
        { nome: "Ter Stegen", posicao: "GOL", nota: 8.8, status: "ok" },
        { nome: "Füllkrug", posicao: "ATA", nota: 8.5, status: "ok" },
        { nome: "Sané", posicao: "ATA", nota: 8.4, status: "ok" },
        { nome: "Schlotterbeck", posicao: "ZAG", nota: 8.1, status: "ok" },
        { nome: "Can", posicao: "MEI", nota: 8.0, status: "ok" }
      ],
      estrategia_principal: "Controle do ritmo com Kroos e explosão final no terço ofensivo com Musiala e Wirtz.",
      modo_operanti: "Pressão no campo do adversário e constante rotação de posições no ataque.",
      pontos_fortes: "Criação de jogadas maestral no meio campo, jogadores jovens extremamente habilidosos.",
      pontos_fracos: "Exposição na defesa em contra-ataques devido à linha muito alta.",
      notas_gerais: { ataque: 9.2, defesa: 8.6, meio: 9.5 },
      jogador_chave: "Jamal Musiala"
    }
  },
  {
    nome: 'C. do Marfim',
    sportmonksId: 44,
    taticas: {
      titulares: [
        { nome: "Fofana", posicao: "GOL", nota: 7.5, status: "ok" },
        { nome: "Aurier", posicao: "LAT", nota: 7.9, status: "ok" },
        { nome: "Kossounou", posicao: "ZAG", nota: 8.3, status: "ok" },
        { nome: "Ndicka", posicao: "ZAG", nota: 8.4, status: "ok" },
        { nome: "Konan", posicao: "LAT", nota: 7.8, status: "ok" },
        { nome: "Kessié", posicao: "MEI", nota: 8.7, status: "ok" },
        { nome: "Fofana", posicao: "MEI", nota: 8.5, status: "ok" },
        { nome: "Seri", posicao: "MEI", nota: 7.9, status: "ok" },
        { nome: "Pépé", posicao: "ATA", nota: 8.1, status: "ok" },
        { nome: "Adingra", posicao: "ATA", nota: 8.4, status: "ok" },
        { nome: "Haller", posicao: "ATA", nota: 8.5, status: "ok" }
      ],
      reservas: [
        { nome: "Boly", posicao: "ZAG", nota: 7.7, status: "ok" },
        { nome: "Gradel", posicao: "ATA", nota: 7.8, status: "ok" },
        { nome: "Diakité", posicao: "ATA", nota: 7.9, status: "ok" },
        { nome: "Singo", posicao: "LAT", nota: 8.0, status: "ok" },
        { nome: "Kouamé", posicao: "ATA", nota: 7.6, status: "ok" }
      ],
      estrategia_principal: "Física e vertical, apostando no pivô de Haller e na velocidade dos pontas.",
      modo_operanti: "Meio-campo combativo (Kessié) retomando bolas e saindo rápido.",
      pontos_fortes: "Força física, jogo aéreo, meio campo marcador forte.",
      pontos_fracos: "Lentidão dos zagueiros e falta de articulação clássica na meia central.",
      notas_gerais: { ataque: 8.2, defesa: 8.1, meio: 8.3 },
      jogador_chave: "Franck Kessié"
    }
  },
  {
    nome: 'Noruega',
    sportmonksId: 16,
    taticas: {
      titulares: [
        { nome: "Nyland", posicao: "GOL", nota: 7.3, status: "ok" },
        { nome: "Ryerson", posicao: "LAT", nota: 8.0, status: "ok" },
        { nome: "Ajer", posicao: "ZAG", nota: 7.8, status: "ok" },
        { nome: "Ostigard", posicao: "ZAG", nota: 7.7, status: "ok" },
        { nome: "Meling", posicao: "LAT", nota: 7.5, status: "ok" },
        { nome: "Odegaard", posicao: "MEI", nota: 9.3, status: "ok" },
        { nome: "Berg", posicao: "MEI", nota: 7.6, status: "ok" },
        { nome: "Berge", posicao: "MEI", nota: 7.8, status: "ok" },
        { nome: "Bobb", posicao: "ATA", nota: 8.3, status: "ok" },
        { nome: "Sorloth", posicao: "ATA", nota: 8.4, status: "ok" },
        { nome: "Haaland", posicao: "ATA", nota: 9.9, status: "ok" }
      ],
      reservas: [
        { nome: "Nusa", posicao: "ATA", nota: 8.0, status: "ok" },
        { nome: "Thorstvedt", posicao: "MEI", nota: 7.5, status: "ok" },
        { nome: "Larsen", posicao: "ATA", nota: 7.7, status: "ok" },
        { nome: "Hanche-Olsen", posicao: "ZAG", nota: 7.4, status: "ok" }
      ],
      estrategia_principal: "Foco absoluto em criar chances para Haaland e Sorloth através da visão de Odegaard.",
      modo_operanti: "Defesa compacta buscando bolas longas para a parede dos atacantes.",
      pontos_fortes: "O atacante mais letal do mundo e bolas aéreas indefensáveis.",
      pontos_fracos: "Defesa fraca e muito vazada; se Odegaard é marcado, o time morre criativamente.",
      notas_gerais: { ataque: 9.2, defesa: 7.2, meio: 8.0 },
      jogador_chave: "Erling Haaland"
    }
  }
];

const allTeams = [...teamsData, ...missingTeams];

// Injeta os novos atributos de estatísticas (gols e cartões) em todos os jogadores automaticamente
const enrichedTeams = allTeams.map(team => {
  const enrichPlayer = (p) => ({
    ...p,
    gols: p.gols || 0,
    cartoes_amarelos: p.cartoes_amarelos || 0,
    cartoes_vermelhos: p.cartoes_vermelhos || 0
  });
  
  return {
    ...team,
    taticas: {
      ...team.taticas,
      titulares: team.taticas.titulares.map(enrichPlayer),
      reservas: team.taticas.reservas.map(enrichPlayer)
    }
  };
});

export default enrichedTeams;
