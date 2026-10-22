
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
const campeonatosRoutes = require('./routes/campeonatos');
const verificarToken = require('./middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas protegidas por token JWT
app.use('/times', verificarToken, timeRoutes);
app.use('/campeonatos', verificarToken, campeonatosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API Conecta Vôlei funcionando!' });
});

module.exports = app;