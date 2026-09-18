const partidaModel = require('../models/partidaModel');

async function listar(req, res) {
  try {
    const partidas = await partidaModel.listarPartidas();

    res.json(partidas);
  } catch (erro) {
    console.error('Erro ao buscar partidas:', erro);

    res.status(500).json({
      mensagem: 'Erro ao buscar partidas.'
    });
  }
}

async function criar(req, res) {
  try {
    const {
      timeAId,
      timeBId,
      data,
      horario,
      local
    } = req.body;

    if (
      !timeAId ||
      !timeBId ||
      !data ||
      !horario ||
      !local
    ) {
      return res.status(400).json({
        mensagem: 'Preencha todos os campos.'
      });
    }

    if (timeAId === timeBId) {
      return res.status(400).json({
        mensagem: 'Os times precisam ser diferentes.'
      });
    }

    const partida = await partidaModel.criarPartida({
      timeAId,
      timeBId,
      data,
      horario,
      local
    });

    res.status(201).json(partida);

  } catch (erro) {
    console.error('Erro ao criar partida:', erro);

    res.status(500).json({
      mensagem: 'Erro ao criar partida.'
    });
  }
}

async function excluir(req, res) {
  try {
    const { id } = req.params;

    const partida = await partidaModel.excluirPartida(id);

    if (!partida) {
      return res.status(404).json({
        mensagem: 'Partida não encontrada.'
      });
    }

    res.json({
      mensagem: 'Partida excluída com sucesso.'
    });

  } catch (erro) {
    console.error('Erro ao excluir partida:', erro);

    res.status(500).json({
      mensagem: 'Erro ao excluir partida.'
    });
  }
}

module.exports = {
  listar,
  criar,
  excluir
};