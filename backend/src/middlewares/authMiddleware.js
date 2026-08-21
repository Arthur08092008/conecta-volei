const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token nao informado.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    return next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token invalido ou expirado.' });
  }
}

module.exports = verificarToken;
