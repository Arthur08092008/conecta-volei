const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

// =========================
// CADASTRO
// =========================
async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Verifica os campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Nome, e-mail e senha são obrigatórios.'
      });
    }

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await usuarioModel.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: 'Este e-mail já está cadastrado.'
      });
    }

    // Cria o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Salva o usuário no banco
    const usuario = await usuarioModel.criar({
      nome,
      email,
      senhaHash
    });

    return res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso.',
      usuario
    });

  } catch (erro) {
    console.error('Erro no cadastro:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    });
  }
}

// =========================
// LOGIN
// =========================
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Verifica os campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'E-mail e senha são obrigatórios.'
      });
    }

    // Procura o usuário pelo e-mail
    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.'
      });
    }

    // Compara a senha informada com a senha criptografada
    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.'
      });
    }

    // Cria o token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    console.error('Erro no login:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    });
  }
}

// Exporta as funções
module.exports = {
  cadastrar,
  login
};
