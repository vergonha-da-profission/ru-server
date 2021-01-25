const { Validator } = require('node-input-validator');

const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const balanceEvents = require('../helpers/lib/events/balanceEvents');

exports.changeBalance = async (req, res, next) => {
  const transaction = req.body;

  const validator = new Validator(
    transaction, {
    name: 'required|string',
    description: 'required|string',
    value: 'required',
  },
  );

  const inputIsValid = await validator.check();

  if (!inputIsValid || transaction.value === 0) {
    return res.status(422).json({
      message: 'One or more fields are malformed',
      code: 422,
      error: validator.errors,
    });
  }

  transaction.date_time = new Date().toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');

  try {
    const user = (await userModel.getTransactionDataById(req.userId))[0];

    const balance = parseFloat(user.balance) + parseFloat(transaction.value);

    if (balance < 0) {
      return res.status(200).json(
        {
          message: 'Insuficient balance',
        },
      );
    }

    await userModel.changeBalance({ id: req.userId, balance });

    const insertResponse = await transactionModel.createTransaction({
      ...transaction, 
      user_id: req.userId,
    });

    if (insertResponse.insertId) {
      balanceEvents.newEvent(req.userId, balance);
      return res.status(201).json(
        {
          user: {
            avatar: user.avatar,
            name: user.name,
          },
          message: 'Transaction suscessfully.',
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
