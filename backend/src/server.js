require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Rotas
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
const campeonatoRoutes = require('./routes/campeonatoRoutes');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// ROTAS
// ==========================================

// Autenticação
app.use('/auth', authRoutes);


// Times
app.use('/times', timeRoutes);

// Campeonatos
app.use('/campeonatos', campeonatoRoutes);

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API VoleiTCC funcionando!'
  });
});

// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});