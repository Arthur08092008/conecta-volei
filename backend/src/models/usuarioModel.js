const pool = require('../config/db');

async function buscarPorEmail(email) {
  const resultado = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return resultado.rows[0];
}

async function criar({ nome, email, senhaHash }) {
  const resultado = await pool.query(
    `INSERT INTO usuarios (nome, email, senha)
     VALUES ($1, $2, $3)
     RETURNING id, nome, email, criado_em`,
    [nome, email, senhaHash]
  );
  return resultado.rows[0];
}

module.exports = { buscarPorEmail, criar };