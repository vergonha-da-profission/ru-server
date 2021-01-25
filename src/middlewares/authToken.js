const jwt = require('jsonwebtoken');
require('../../util/envLoader');

exports.verifyAuthentication = (req, res, next) => {
  try {
    const key = req.headers.authorization.split(' ')[1];

    if (!key) {
      return res.status(422).json({
        error: 'Missing Token',
      });
    }
    const decoded = jwt.verify(key, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(403).json({
      error: 'Inválid Token',
    });
  }
};

exports.verifyDebt = (req, res, next) => {
  try {
    if (!req.headers['x-api-key']) {
      return res.status(422).json({
        error: 'Missing API key',
      });
    }
    // If API KEY is válid
    if (req.headers['x-api-key'].toString() === process.env.DEBT_TOKEN.toString()) {
      return next();
    }
    return res.status(403).json({
      error: 'Inválid API key',
    });
  } catch (err) {
    return res.status(403).json({
      error: 'User not authenticated',
    });
  }
};
