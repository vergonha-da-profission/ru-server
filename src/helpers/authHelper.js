const jwt = require('jsonwebtoken');
require('../../util/envLoader');

const { JWT_SECRET } = process.env;

exports.generateToken = (tokenData) => jwt.sign(tokenData, JWT_SECRET || 'teste', { expiresIn: '999d' });

exports.decodeToken = (token) => jwt.verify(token, JWT_SECRET || 'teste');

exports.getUserIdFromToken = (req, res) => {
  try {
    const key = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(key, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return res.status(403).json({
      error: 'User not authenticated',
    });
  }
};
