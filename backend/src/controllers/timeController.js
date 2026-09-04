const timeModel = require('../models/timeModel');

async function listar(req, res) {
  try {
    const times = await timeModel.listarTodos();
    return res.json({ times });
  } catch (erro) {
    console.error('Erro ao listar times:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao listar times.' });
  }
}

async function buscar(req, res) {
  try {
    const { id } = req.params;
    const time = await timeModel.buscarPorId(id);

    if (!time) {
      return res.status(404).json({ mensagem: 'Time nao encontrado.' });
    }

    return res.json({ time });
  } catch (erro) {
    console.error('Erro ao buscar time:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao buscar time.' });
  }
}

async function cadastrar(req, res) {
  try {
    const { nome, cidade, categoria, tecnico, email, telefone } = req.body;

    if (!nome || !cidade || !tecnico) {
      return res.status(400).json({ mensagem: 'Preencha nome do time, cidade e tecnico responsavel.' });
    }

    const novoTime = await timeModel.criar({
      nome,
      cidade,
      categoria: categoria || 'Masculino',
      tecnico,
      email: email || null,
      telefone: telefone || null,
    });

    return res.status(201).json({ time: novoTime });
  } catch (erro) {
    console.error('Erro ao cadastrar time:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao cadastrar time.' });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, cidade, categoria, tecnico, email, telefone } = req.body;

    if (!nome || !cidade || !tecnico) {
      return res.status(400).json({ mensagem: 'Preencha nome do time, cidade e tecnico responsavel.' });
    }

    const timeExistente = await timeModel.buscarPorId(id);
    if (!timeExistente) {
      return res.status(404).json({ mensagem: 'Time nao encontrado.' });
    }

    const timeAtualizado = await timeModel.atualizar(id, {
      nome,
      cidade,
      categoria: categoria || 'Masculino',
      tecnico,
      email: email || null,
      telefone: telefone || null,
    });

    return res.json({ time: timeAtualizado });
  } catch (erro) {
    console.error('Erro ao atualizar time:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao atualizar time.' });
  }
}

async function excluir(req, res) {
  try {
    const { id } = req.params;

    const timeExcluido = await timeModel.excluir(id);
    if (!timeExcluido) {
      return res.status(404).json({ mensagem: 'Time nao encontrado.' });
    }

    return res.status(204).send();
  } catch (erro) {
    console.error('Erro ao excluir time:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao excluir time.' });
  }
}

module.exports = { listar, buscar, cadastrar, atualizar, excluir };