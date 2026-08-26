const express = require('express');
const router = express.Router();
const timeController = require('../controllers/timeController');

router.get('/', timeController.listar);
router.get('/:id', timeController.buscar);
router.post('/', timeController.cadastrar);
router.put('/:id', timeController.atualizar);
router.delete('/:id', timeController.excluir);

module.exports = router;