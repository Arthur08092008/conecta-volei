require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Rotas
const authRoutes = require('./routes/authRoutes');
const partidaRoutes = require('./routes/partidaRoutes');

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

// Partidas
app.use('/partidas', partidaRoutes);

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