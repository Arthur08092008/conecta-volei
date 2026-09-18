// backend/src/routes/campeonatos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // conexão pg (Pool) já configurada no projeto

// GET /campeonatos - lista todos os campeonatos
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT * FROM campeonatos ORDER BY data_inicio DESC'
    );
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar campeonatos' });
  }
});

// POST /campeonatos - cria um novo campeonato
router.post('/', async (req, res) => {
  const { nome, data_inicio, data_fim, formato, max_equipes, status, regulamento } = req.body;

  if (!nome || !data_inicio || !data_fim || !formato || !max_equipes) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const resultado = await db.query(
      `INSERT INTO campeonatos (nome, data_inicio, data_fim, formato, max_equipes, status, regulamento)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nome, data_inicio, data_fim, formato, max_equipes, status || 'Em breve', regulamento || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar campeonato' });
  }
});

// DELETE /campeonatos/:id - exclui um campeonato
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM campeonatos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir campeonato' });
  }
});

module.exports = router;