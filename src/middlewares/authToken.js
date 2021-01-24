const jwt = require('jsonwebtoken');
require('../../util/envLoader');

exports.verifyAuthentication = (req, res, next) => {
  try {
    const key = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(key, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(403).json({
      error: 'User not authenticated',
    });
  }
};
