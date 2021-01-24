const { Validator } = require('node-input-validator');

const userModel = require('../models/userModel');
const validate = require('../helpers/validate');
const qrCode = require('../helpers/qrCode');
const avatar = require('../helpers/avatar');
const { hashPassword } = require('../helpers/encrypt');

exports.createUser = async (req, res, next) => {
  req.body.password = hashPassword(req.body.password);
  const user = req.body;
  const validator = new Validator(
    user, {
      cpf: 'required|digits:11',
      email: 'required|email',
      password: 'required:minLength:8',
      username: 'string',
      name: 'string',
      id_uffs: 'string',
    },
  );
  const inputIsValid = await validator.check();
  if (!inputIsValid || 'qr_code' in user) {
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
  user.avatar = await avatar.createAvatar(user);

  try {
    const insertResponse = await userModel.createUser(user);
    if (insertResponse.insertId) {
      user.qr_code = await qrCode.createImage(insertResponse.insertId, user.cpf);
      await userModel.insertQrCode({ id: insertResponse.insertId, qr_code: user.qr_code });
      if (user.qr_code.toString() === 'can\'t create image') {
        return res.status(400).json({
          message: 'Internal Server Error',
          code: 400,
        });
      }
      return res.status(201).json(
        {
          user: {
            email: user.email,
            qr_code: user.qr_code,
          },
          message: 'User created suscessfully.',
        },
      );
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Some field is already in use.' });
    }
    return next(err);
  }
  return res.status(500).json({ message: 'Internal Error' });
};
