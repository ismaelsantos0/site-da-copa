import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria ou abre o arquivo db
const dbPath = path.resolve(__dirname, 'copa.db');
const db = new sqlite3.Database(dbPath);

// Inicializa as tabelas
db.serialize(() => {
  // Cache de Análises de Confrontos
  db.run(`
    CREATE TABLE IF NOT EXISTS match_analysis_cache (
      id TEXT PRIMARY KEY,
      team1 TEXT,
      team2 TEXT,
      analysis TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Dados Básicos das Seleções (Elencos, Estratégias, Ratings)
  db.run(`
    CREATE TABLE IF NOT EXISTS teams_info (
      name TEXT PRIMARY KEY,
      sportmonks_id INTEGER,
      tactical_data TEXT,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('📦 Banco de Dados SQLite conectado e tabelas (match_cache e teams_info) garantidas.');
});

// --- Funções da Tabela match_analysis_cache ---
export const getCachedAnalysis = (matchId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT analysis FROM match_analysis_cache WHERE id = ?', [matchId], (err, row) => {
      if (err) reject(err);
      resolve(row ? row.analysis : null);
    });
  });
};

export const saveAnalysisToCache = (matchId, t1, t2, analysis) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO match_analysis_cache (id, team1, team2, analysis) VALUES (?, ?, ?, ?)');
    stmt.run([matchId, t1, t2, analysis], function (err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
    stmt.finalize();
  });
};

// --- Funções da Tabela teams_info ---
export const getTeamInfo = (teamName) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM teams_info WHERE name = ?', [teamName], (err, row) => {
      if (err) reject(err);
      resolve(row ? { ...row, tactical_data: JSON.parse(row.tactical_data) } : null);
    });
  });
};

export const saveTeamInfo = (teamName, sportmonksId, tacticalData) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO teams_info (name, sportmonks_id, tactical_data) VALUES (?, ?, ?)');
    stmt.run([teamName, sportmonksId, JSON.stringify(tacticalData)], function (err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
    stmt.finalize();
  });
};

export default db;
