const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

// --- GÖREVLER ---
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY priority DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { title, description, date, category, priority } = req.body;
  const id = uuidv4();
  db.run(
    'INSERT INTO tasks (id, title, description, date, category, priority) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, description, date, category || 'Genel', priority || 'Orta'],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ id, title, description, date, category, priority, completed: 0 });
    }
  );
});

router.put('/:id', (req, res) => {
  const { completed } = req.body;
  db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// --- GÜNLÜK NOTLAR ---
router.get('/note/:date', (req, res) => {
  db.get('SELECT * FROM daily_notes WHERE date = ?', [req.params.date], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row || { content: '' });
  });
});

router.post('/note', (req, res) => {
  const { date, content } = req.body;
  const id = uuidv4();
  db.run(
    `INSERT INTO daily_notes (id, date, content) VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET content = excluded.content`,
    [id, date, content],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// --- HAFTALIK HEDEFLER ---
router.get('/weekly/:week', (req, res) => {
  db.get('SELECT * FROM weekly_reviews WHERE week = ?', [req.params.week], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row || { summary: '' });
  });
});

router.post('/weekly', (req, res) => {
  const { week, summary } = req.body;
  const id = uuidv4();
  db.run(
    `INSERT INTO weekly_reviews (id, week, summary) VALUES (?, ?, ?)
     ON CONFLICT(week) DO UPDATE SET summary = excluded.summary`,
    [id, week, summary],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// --- GÜVENLİ GİRİŞ (LOGIN) ROTASI ---
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Gerçek projelerde şifreler kodda yazmaz, .env dosyasından veya sunucu ayarlarından çekilir.
  // Canlıya aldığımızda şifreyi sunucu paneline (Render vb.) gireceğiz.
  // Şimdilik test için varsayılan değerleri senin bilgilerin yapıyoruz.
  const ADMIN_USER = process.env.ADMIN_USER || 'talha';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'talha._444';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    // 401 Unauthorized (Yetkisiz)
    res.status(401).json({ success: false, message: 'Hatalı giriş' });
  }
});

module.exports = router;

// Tüm günlük geçmişini getir
router.get('/notes/all', (req, res) => {
  db.all('SELECT * FROM daily_notes ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});