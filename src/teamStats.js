export const teamStats = {
  'Brasil': { attack: 92, defense: 85, form: 88, tactic: 'offensive' },
  'Argentina': { attack: 94, defense: 88, form: 95, tactic: 'possession' },
  'França': { attack: 95, defense: 89, form: 93, tactic: 'balanced' },
  'Inglaterra': { attack: 92, defense: 87, form: 90, tactic: 'possession' },
  'Espanha': { attack: 89, defense: 88, form: 91, tactic: 'possession' },
  'Alemanha': { attack: 88, defense: 85, form: 86, tactic: 'offensive' },
  'Portugal': { attack: 91, defense: 87, form: 90, tactic: 'offensive' },
  'Holanda': { attack: 87, defense: 88, form: 88, tactic: 'balanced' },
  'Bélgica': { attack: 86, defense: 84, form: 85, tactic: 'offensive' },
  'Croácia': { attack: 85, defense: 86, form: 87, tactic: 'balanced' },
  'Colômbia': { attack: 84, defense: 85, form: 89, tactic: 'counter-attack' },
  'Japão': { attack: 82, defense: 81, form: 86, tactic: 'counter-attack' },
  'Marrocos': { attack: 83, defense: 87, form: 88, tactic: 'defensive' },
  'Senegal': { attack: 84, defense: 83, form: 85, tactic: 'balanced' },
  'Suíça': { attack: 81, defense: 83, form: 83, tactic: 'defensive' },
  'Áustria': { attack: 80, defense: 81, form: 86, tactic: 'balanced' },
  'Estados Unidos': { attack: 81, defense: 80, form: 84, tactic: 'offensive' },
  'México': { attack: 80, defense: 79, form: 81, tactic: 'balanced' },
  'Equador': { attack: 81, defense: 84, form: 83, tactic: 'defensive' },
  'Austrália': { attack: 76, defense: 78, form: 80, tactic: 'defensive' },
  'C. do Marfim': { attack: 82, defense: 80, form: 85, tactic: 'offensive' },
  'Noruega': { attack: 83, defense: 76, form: 80, tactic: 'offensive' }, 
  'Argélia': { attack: 79, defense: 78, form: 79, tactic: 'balanced' },
  'Cabo Verde': { attack: 75, defense: 74, form: 77, tactic: 'counter-attack' },
  'Egito': { attack: 80, defense: 79, form: 80, tactic: 'balanced' },
  'Suécia': { attack: 81, defense: 80, form: 79, tactic: 'balanced' },
  'África do Sul': { attack: 76, defense: 75, form: 78, tactic: 'defensive' },
  'Canadá': { attack: 79, defense: 77, form: 80, tactic: 'counter-attack' },
  'Gana': { attack: 78, defense: 77, form: 78, tactic: 'balanced' },
  'RD Congo': { attack: 77, defense: 78, form: 81, tactic: 'defensive' },
  'Paraguai': { attack: 76, defense: 80, form: 79, tactic: 'defensive' },
  'Bósnia': { attack: 78, defense: 76, form: 77, tactic: 'counter-attack' }
};

export const calculateTeamStrength = (teamName) => {
  const stats = teamStats[teamName];
  if (!stats) return 75; // Default genérico para seleções não mapeadas
  
  // A força geral é a média ponderada (Ataque, Defesa, Momento)
  const strength = (stats.attack * 0.4) + (stats.defense * 0.4) + (stats.form * 0.2);
  return strength;
};

export const getTacticalMultiplier = (tacticA, tacticB) => {
  // Pedra, papel, tesoura tático simplificado
  // 1.0 = normal, > 1 = A tem vantagem, < 1 = A tem desvantagem
  if (tacticA === 'possession' && tacticB === 'defensive') return 0.95; 
  if (tacticA === 'counter-attack' && tacticB === 'possession') return 1.05;
  if (tacticA === 'defensive' && tacticB === 'offensive') return 1.05;
  if (tacticA === 'offensive' && tacticB === 'defensive') return 0.95;
  if (tacticA === 'offensive' && tacticB === 'balanced') return 1.02;
  return 1.0; 
};
