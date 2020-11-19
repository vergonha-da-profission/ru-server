const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

exports.generateToken = (tokenData) => jwt.sign(tokenData, JWT_SECRET || 'teste', { expiresIn: '1h' });
