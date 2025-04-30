const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const User = require('./models/User'); // adapte le chemin selon ton projet

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(session({
  secret: 'uneCléSecrèteSuperSûre',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true si HTTPS
}));

// Utilisateurs autorisés
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://achrefhamraoui:08KFs48Fo5c5NRNh@achref.hqkekrr.mongodb.net/powerbi-app?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// 🔐 Authentification
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// Middleware de protection
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// Accès protégé à dashboard.html
app.get('/dashboard.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// Simulation de Power BI Token
app.get('/api/powerbi-token', requireAuth, (req, res) => {
  // Remplace ces valeurs par les vrais si tu as un rapport Power BI
  const token = 'TOKEN_FAKE'; // à générer via Azure AD
  const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=TON_ID';
  const reportId = 'TON_ID';
  res.json({ token, embedUrl, reportId });
});

// Lancement
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});

