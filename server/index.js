const express = require('express');
const cors = require('cors');
const path = require('path'); // Dosya yollarını bulmak için ekledik
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// 1. API Rotalarımız (Arka plan işlemleri)
app.use('/api/tasks', taskRoutes);

// 2. ÖNYÜZÜ (FRONTEND) SUNMA KISMI (İşte eksik olan buydu!)
// Bu kod, Node.js'e "client/public" klasöründeki her şeyi (index.html vb.) dışarıya açmasını söyler.
app.use(express.static(path.join(__dirname, '../client/public')));

// Kullanıcı siteye girdiğinde doğrudan index.html'i gönder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// Port ayarını Render'a uyumlu hale getirdik
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));