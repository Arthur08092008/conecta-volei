// routes/campeonatoRoutes.js
const express = require('express');
const router = express.Router();
const campeonatoController = require('../controllers/campeonatoController');

router.post('/', campeonatoController.criar);
router.get('/', campeonatoController.listar);
router.get('/:id', campeonatoController.buscarPorId);
router.delete('/:id', campeonatoController.excluir);

module.exports = router;