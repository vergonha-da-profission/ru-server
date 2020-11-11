const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = tokenData => {
    return jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1h' });
}