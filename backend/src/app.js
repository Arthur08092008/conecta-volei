const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
const campeonatosRoutes = require('./routes/campeonatos');
//const perfilRoutes = require('./routes/perfilRoutes'); 
//const autenticar = require('./middlewares/autenticar');
 
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes); // pública (login/cadastro)
app.use('/times', autenticar, timeRoutes);
app.use('/campeonatos', autenticar, campeonatosRoutes);
//app.use('/perfil', autenticar, perfilRoutes);

module.exports = app;