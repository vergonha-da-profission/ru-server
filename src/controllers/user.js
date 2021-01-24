const { Validator } = require('node-input-validator');

const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');
const validate = require('../helpers/validate');
const qrCode = require('../helpers/qrCode');
const avatar = require('../helpers/avatar');
const auth = require('../helpers/authHelper');
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
      user.qr_code = await qrCode.createImage(insertResponse.insertId);
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

exports.getBalanceById = async (req, res, next) => {
  const id = auth.getUserIdFromToken(req, res);
  try {
    const selectResponse = await userModel.getBalance(id);
    return res.status(200).json({
      balance: selectResponse,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getProfileInfoById = async (req, res, next) => {
  const user = req.query;
  const validator = new Validator(
    user, {
      id: 'required',
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
    const selectResponse = (await userModel.getProfileInfoById(user.id))[0];
    const transactions = (await transactionModel.getAllTransactionByUserId(user.id))
      .map((element) => ({
        name: element.name,
        type: element.value > 0 ? 'incoming' : 'outcoming',
        price: element.value,
        description: element.description,
        time: (element.date_time.toISOString().replace('T', ' ')).split('.')[0],
      }));
    return res.status(200).json({
      user: {
        full_name: selectResponse.name,
        email: selectResponse.email,
        iduffs: selectResponse.id_uffs,
        qrCodeUrl: selectResponse.qr_code,
        profilePicture: selectResponse.avatar,
        cpf: selectResponse.cpf,
        balance: selectResponse.balance,
        transactions,
      },
    });
  } catch (err) {
    return next(err);
  }
};
