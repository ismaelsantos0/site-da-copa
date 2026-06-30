import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Inicializa o Pool do PostgreSQL usando a DATABASE_URL
// Como o Railway muitas vezes usa conexões seguras, adicionamos rejectUnauthorized: false para evitar erros de SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway') 
       ? { rejectUnauthorized: false } 
       : false
});

// Inicializa as tabelas
const initDB = async () => {
  try {
    // Cache de Análises de Confrontos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_analysis_cache (
        id VARCHAR(255) PRIMARY KEY,
        team1 VARCHAR(255),
        team2 VARCHAR(255),
        analysis TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Dados Básicos das Seleções (Elencos, Estratégias, Ratings)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams_info (
        name VARCHAR(255) PRIMARY KEY,
        sportmonks_id INTEGER,
        tactical_data TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Salvamento em Nuvem Pessoal do Chaveamento
    await pool.query(`
      CREATE TABLE IF NOT EXISTS my_bracket (
        id INTEGER PRIMARY KEY,
        bracket_data TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('🐘 Banco de Dados PostgreSQL conectado e tabelas garantidas.');
  } catch (err) {
    console.error('❌ Erro ao conectar no PostgreSQL:', err);
  }
};

// Executa a inicialização
initDB();

// --- Funções da Tabela match_analysis_cache ---
export const getCachedAnalysis = async (matchId) => {
  try {
    const res = await pool.query('SELECT analysis FROM match_analysis_cache WHERE id = $1', [matchId]);
    return res.rows.length > 0 ? res.rows[0].analysis : null;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const saveAnalysisToCache = async (matchId, t1, t2, analysis) => {
  try {
    const query = `
      INSERT INTO match_analysis_cache (id, team1, team2, analysis) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET 
        team1 = EXCLUDED.team1,
        team2 = EXCLUDED.team2,
        analysis = EXCLUDED.analysis,
        created_at = CURRENT_TIMESTAMP
    `;
    await pool.query(query, [matchId, t1, t2, analysis]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// --- Funções da Tabela teams_info ---
export const getTeamInfo = async (teamName) => {
  try {
    const res = await pool.query('SELECT * FROM teams_info WHERE name = $1', [teamName]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return { ...row, tactical_data: JSON.parse(row.tactical_data) };
    }
    return null;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const saveTeamInfo = async (teamName, sportmonksId, tacticalData) => {
  try {
    const query = `
      INSERT INTO teams_info (name, sportmonks_id, tactical_data) 
      VALUES ($1, $2, $3)
      ON CONFLICT (name) DO UPDATE SET 
        sportmonks_id = EXCLUDED.sportmonks_id,
        tactical_data = EXCLUDED.tactical_data,
        last_updated = CURRENT_TIMESTAMP
    `;
    await pool.query(query, [teamName, sportmonksId, JSON.stringify(tacticalData)]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default pool;
