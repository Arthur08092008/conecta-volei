const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('Banco de dados conectado com sucesso!');
});

pool.on('error', (erro) => {
  console.error('Erro no banco de dados:', erro);
});

module.exports = pool;