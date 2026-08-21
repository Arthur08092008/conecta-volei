const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    }

    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensagem: 'E-mail ou senha invalidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha invalidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao efetuar login.' });
  }
}

async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha nome, e-mail e senha.' });
    }

    const usuarioExistente = await usuarioModel.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ mensagem: 'Ja existe um usuario com este e-mail.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await usuarioModel.criar({ nome, email, senhaHash });

    return res.status(201).json({ usuario: novoUsuario });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuario.' });
  }
}

module.exports = { login, cadastrar };