const pool = require('../config/db');

// ==========================================
// BUSCAR TODAS AS PARTIDAS
// ==========================================

async function listarPartidas() {
  const resultado = await pool.query(`
    SELECT
      id,
      time_a,
      time_b,
      data,
      horario,
      local,
      criado_em
    FROM partidas
    ORDER BY data ASC, horario ASC
  `);

  return resultado.rows;
}

// ==========================================
// CRIAR PARTIDA
// ==========================================

async function criarPartida({
  timeAId,
  timeBId,
  data,
  horario,
  local
}) {
  const resultado = await pool.query(
    `
      INSERT INTO partidas
      (time_a, time_b, data, horario, local)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        time_a,
        time_b,
        data,
        horario,
        local,
        criado_em
    `,
    [
      timeAId,
      timeBId,
      data,
      horario,
      local
    ]
  );

  return resultado.rows[0];
}

// ==========================================
// EXCLUIR PARTIDA
// ==========================================

async function excluirPartida(id) {
  const resultado = await pool.query(
    `
      DELETE FROM partidas
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  return resultado.rows[0];
}

// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {
  listarPartidas,
  criarPartida,
  excluirPartida
};''