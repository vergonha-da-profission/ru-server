const { Validator } = require('node-input-validator');

const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');
const validate = require('../helpers/validate');
const qrCodeHelper = require('../helpers/qrCode');
const avatarHelper = require('../helpers/avatar');
const { hashPassword } = require('../helpers/encrypt');

exports.createUser = async (req, res) => {
  const user = req.body;
  const validator = new Validator(
    user,
    {
      cpf: 'required|digits:11',
      email: 'required|email',
      password: 'required:minLength:8',
      name: 'required|string',
      id_uffs: 'required|string',
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

  req.body.password = hashPassword(req.body.password);

  try {
    const insertResponse = await userModel.createUser(user);
    if (insertResponse.insertId) {
      const qrCode = await qrCodeHelper.createImage(insertResponse.insertId);
      const avatar = await avatarHelper.createAvatar();

      await userModel.updateById(insertResponse.insertId, {
        qr_code: qrCode,
        avatar,
      });

      return res.status(201).json(
        {
          user: {
            email: user.email,
            qr_code: qrCode,
            profilePicture: avatar,
          },

          message: 'User created suscessfully.',
        },
      );
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Some field is already in use.' });
    }

    return res.status(400).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
  return res.status(500).json({ message: 'Internal Error' });
};

exports.getBalanceById = async (req, res, next) => {
  try {
    const selectResponse = await userModel.getBalance(req.userId);
    return res.status(200).json({
      balance: selectResponse,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getProfileInfoById = async (req, res, next) => {
  try {
    const selectResponse = (await userModel.getProfileInfoById(req.userId))[0];
    const transactions = (await transactionModel.getAllTransactionByUserId(req.userId))
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
