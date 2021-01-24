const jwt = require('jsonwebtoken');
require('../../util/envLoader');

const { JWT_SECRET } = process.env;

exports.generateToken = (tokenData) => jwt.sign(tokenData, JWT_SECRET || 'teste', { expiresIn: '999d', algorithm: 'RS256' });

exports.decodeToken = (token) => jwt.verify(token, JWT_SECRET || 'teste');
