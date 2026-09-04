const express = require('express');
const router = express.Router();
<<<<<<< HEAD

const {
  cadastrar,
  login,
} = require('../controllers/authController');

router.post('/cadastro', cadastrar);

router.post('/login', login);
=======
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/cadastrar', authController.cadastrar);
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693

module.exports = router;