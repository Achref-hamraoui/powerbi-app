const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User'); // Le modèle User (schéma mongoose)

const app = express();

// 📦 Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(session({
  secret: 'uneCléSecrèteSuperSûre',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true si HTTPS
}));

// 🌐 Connexion MongoDB Atlas
mongoose.connect('mongodb+srv://achrefhamraoui:08KFs48Fo5c5NRNh@achref.hqkekrr.mongodb.net/powerbi-app?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// 🔐 Route de connexion (login)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email: username, password: password });
    if (user) {
      req.session.user = user;
      res.sendStatus(200);
    } else {
      res.status(401).send('Identifiants incorrects');
    }
  } catch (err) {
    console.error('❌ Erreur login :', err);
    res.sendStatus(500);
  }
});

// 🔒 Middleware de protection de route
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// 📊 Accès protégé à dashboard.html
app.get('/dashboard.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// 🪪 Securely Generate and Return Power BI Token
app.get('/api/powerbi-token', requireAuth, (req, res) => {
  try {
    const token = 'eyJrIjoiMzNjMmIzNjQtYTFkMC00ZmRkLTg1M2MtY2FlZGM3NTQ2ZWU3IiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9';
    const embedUrl = 'https://app.powerbi.com/view?r=eyJrIjoiMzNjMmIzNjQtYTFkMC00ZmRkLTg1M2MtY2FlZGM3NTQ2ZWU3IiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9';
    const reportId = 'TON_ID';

    res.json({ token, embedUrl, reportId });
    console.log('✅ Power BI Token sent successfully');
  } catch (err) {
    console.error('❌ Error generating Power BI token:', err);
    res.status(500).send('Error generating Power BI token');
  }
});

// 🚀 Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne : http://localhost:${PORT}`);
});