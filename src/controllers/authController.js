const { Validator } = require('node-input-validator');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const { generateToken } = require('../helpers/authHelper');

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  const validator = new Validator(
    { username, password }, {
      username: 'required|minLength:3',
      password: 'required|minLength:2',
    },
  );
  const inputIsValid = await validator.check();
  if (!inputIsValid) {
    return res.status(422).json({
      message: 'One or more fields are malformed',
      code: 422,
      error: validator.errors,
    });
  }
  try {
    const hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user = await userModel.findUserByUsername(username);
    if (user[0] === undefined) {
      return res.json({ message: 'User Or Password incorrect' });
    }
    if (user[0].password !== hashPassword) {
      return res.json({ message: 'User Or Password incorrect' });
    }
    return res.json({
      name: user[0].name,
      username: user[0].username,
      token: generateToken({ userId: user[0].id }),
    });
  } catch (err) {
    return next(err);
  }
};
