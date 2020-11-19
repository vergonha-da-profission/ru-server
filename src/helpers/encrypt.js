const crypto = require('crypto');

exports.hashPassword = (password) => {
  const hashedPassword = crypto.createHash('sha256')
    .update(password.toString())
    .digest('hex');

  return hashedPassword;
};
