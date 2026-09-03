const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

async function cadastrar(req, res) {
  try {
    console.log('\n========== INÍCIO DO CADASTRO ==========');

    const { nome, email, senha } = req.body;

    console.log('Dados recebidos:');
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Senha recebida:', senha ? 'SIM' : 'NÃO');

    // Verifica se todos os campos foram enviados
    if (!nome || !email || !senha) {
      console.error('ERRO: Campos obrigatórios não foram preenchidos.');

      return res.status(400).json({
        mensagem: 'Nome, e-mail e senha são obrigatórios.',
      });
    }

    console.log('1. Verificando se o e-mail já existe...');

    const usuarioExistente = await usuarioModel.buscarPorEmail(email);

    if (usuarioExistente) {
      console.warn('E-mail já cadastrado:', email);

      return res.status(409).json({
        mensagem: 'Este e-mail já está cadastrado.',
      });
    }

    console.log('2. E-mail disponível.');

    // Cria o hash da senha
    console.log('3. Criando hash da senha...');

    const senhaHash = await bcrypt.hash(senha, 10);

    console.log('4. Hash criado com sucesso.');

    // Salva o usuário no banco
    console.log('5. Tentando salvar usuário no PostgreSQL...');

    const usuario = await usuarioModel.criar({
      nome,
      email,
      senhaHash,
    });

    console.log('6. Usuário salvo com sucesso!');
    console.log('Usuário criado:', usuario);

    console.log('========== CADASTRO FINALIZADO ==========\n');

    return res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso.',
      usuario,
    });

  } catch (erro) {
    console.error('\n========== ERRO NO CADASTRO ==========');

    console.error('Mensagem:', erro.message);
    console.error('Código:', erro.code);
    console.error('Detalhes:', erro.detail);
    console.error('Tabela:', erro.table);
    console.error('Coluna:', erro.column);
    console.error('Constraint:', erro.constraint);

    console.error('Stack completo:');
    console.error(erro.stack);

    console.error('========================================\n');

    return res.status(500).json({
      mensagem: 'Erro interno do servidor.',
    });
  }
}


async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Verifica se os campos foram enviados
    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'E-mail e senha são obrigatórios.',
      });
    }

    // Procura o usuário pelo e-mail
    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    // Compara a senha digitada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    // Cria o token
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });

  } catch (erro) {
    console.error('Erro no login:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno do servidor.',
    });
  }
}


module.exports = {
  cadastrar,
  login,
};