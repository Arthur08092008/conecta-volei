const express = require('express');

const router = express.Router();

const {
  cadastrar,
  login
} = require('../controllers/authControllers');

// Cadastro
router.post('/cadastro', cadastrar);

// Login
router.post('/login', login);

module.exports = router;