const express = require('express');

const {
  listar,
  criar,
  excluir
} = require('../controllers/partidaController');

const router = express.Router();

// GET /partidas
router.get('/', listar);

// POST /partidas
router.post('/', criar);

// DELETE /partidas/:id
router.delete('/:id', excluir);

module.exports = router;