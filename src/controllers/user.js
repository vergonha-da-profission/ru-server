const { Validator } = require('node-input-validator');
const userModel = require('../models/userModel');
const validate = require('../helpers/validate');
const { hashPassword } = require('../helpers/encrypt');

exports.createUser = async (req, res, next) => {
  req.body.password = hashPassword(req.body.password);
  const user = req.body;
  const validator = new Validator(
    user, {
      email: 'required|email',
      password: 'required:minLength:8',
      username: 'string',
      name: 'string',
      id_uffs: 'string',
      cpf: 'digits:11',
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
  if (user.cpf) {
    if (!(await validate.isValidCPF(user.cpf))) {
      return res.status(422).json({
        message: 'Invalid CPF',
        code: 422,
      });
    }
  }

  try {
    const queryRes = await userModel.createUser(user);
    if (queryRes.insertId) {
      return res.status(201).json({ id: queryRes.insertId, user, message: 'User created suscessfully.' });
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Some field is already in use.' });
    }
    return next(err);
  }
  return res.status(500).json({ message: 'Internal Error' });
};
