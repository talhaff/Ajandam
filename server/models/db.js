const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'planner.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Veritabanına bağlanırken hata:', err.message);
  else console.log('SQLite veritabanına başarıyla bağlanıldı (V2).');
});

db.serialize(() => {
  // category ve priority sütunları eklendi
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    category TEXT DEFAULT 'Genel',
    priority TEXT DEFAULT 'Orta',
    completed INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS daily_notes (
    id TEXT PRIMARY KEY,
    date TEXT UNIQUE,
    content TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS weekly_reviews (
    id TEXT PRIMARY KEY,
    week TEXT UNIQUE,
    summary TEXT
  )`);
});

module.exports = db;