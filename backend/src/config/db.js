const { Pool } = require('pg'); require('dotenv').config();
// Pool de conexoes com o PostgreSQL.
// Reaproveita conexoes ao inves de abrir uma nova a cada consulta.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL', err);
  process.exit(-1);
});

module.exports = pool;
