import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria ou abre o arquivo db
const dbPath = path.resolve(__dirname, 'copa.db');
const db = new sqlite3.Database(dbPath);

// Inicializa a tabela de cache
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS match_analysis_cache (
      id TEXT PRIMARY KEY,
      team1 TEXT,
      team2 TEXT,
      analysis TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('📦 Banco de Dados SQLite conectado e tabela garantida.');
});

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

export default db;
