const { Validator } = require('node-input-validator');

const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const clientEvents = require('../helpers/lib/events/clientEvents');

exports.decreaseBalance = async (req, res, next) => {
  const transaction = req.body;

  const validator = new Validator(
    transaction, {
      userId: 'required',
      name: 'required|string',
      description: 'required|string',
      value: 'required',
    },
  );

  const inputIsValid = await validator.check();

  if (!inputIsValid || transaction.value >= 0) {
    return res.status(422).json({
      message: 'One or more fields are malformed',
      code: 422,
      error: validator.errors,
    });
  }
  const nowArray = (new Date()).toLocaleString().replace(/\//g, '-').split(' ');
  transaction.date_time = `${nowArray[0].split('-')[2]}-${nowArray[0].split('-')[1]}-${nowArray[0].split('-')[0]} ${nowArray[1]}`;

  try {
    const user = (await userModel.getTransactionDataById(transaction.userId))[0];
    const balance = parseFloat(user.balance) + parseFloat(transaction.value);

    if (balance < 0) {
      return res.status(200).json(
        {
          message: 'Insuficient balance',
        },
      );
    }

    await userModel.changeBalance({ id: transaction.userId, balance });

    const insertResponse = await transactionModel.createTransaction({
      name: transaction.name,
      description: transaction.description,
      value: transaction.value,
      date_time: transaction.date_time,
      user_id: transaction.userId,
    });

    if (insertResponse.insertId) {
      // Balance ws
      clientEvents.newEventBalance({ userId: transaction.userId, balance });
      // transaction ws
      clientEvents.newEventTransaction({ ...transaction, type: 'outcoming' });
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

exports.increaseBalance = async (req, res, next) => {
  const transaction = req.body;

  const validator = new Validator(
    transaction, {
      name: 'required|string',
      description: 'required|string',
      value: 'required',
    },
  );

  const inputIsValid = await validator.check();

  if (!inputIsValid || transaction.value <= 0) {
    return res.status(422).json({
      message: 'One or more fields are malformed',
      code: 422,
      error: validator.errors,
    });
  }

  const nowArray = (new Date()).toLocaleString().replace(/\//g, '-').split(' ');
  transaction.date_time = `${nowArray[0].split('-')[2]}-${nowArray[0].split('-')[1]}-${nowArray[0].split('-')[0]} ${nowArray[1]}`;

  try {
    const user = (await userModel.getTransactionDataById(req.userId))[0];

    const balance = parseFloat(user.balance) + parseFloat(transaction.value);

    await userModel.changeBalance({ id: req.userId, balance });

    const insertResponse = await transactionModel.createTransaction({
      ...transaction,
      user_id: req.userId,
    });

    if (insertResponse.insertId) {
      // Balance ws
      clientEvents.newEventBalance({ userId: req.userId, balance });
      // transaction ws
      clientEvents.newEventTransaction({ userId: req.userId, ...transaction, type: 'incoming' });
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
