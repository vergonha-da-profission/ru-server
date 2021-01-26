const { Validator } = require('node-input-validator');
const { Boleto } = require('node-boleto');
const htmlPdf = require('html-pdf');

const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const balanceEvents = require('../helpers/lib/events/balanceEvents');

exports.getBillBuffer = async (req, res) => {
  const transaction = req.query;

  const validator = new Validator(
    transaction, {
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
  const banksName = ['bradesco', 'santander'];
  const bankName = banksName[Math.floor(Math.random() * banksName.length)];
  const bill = new Boleto({
    banco: bankName, // nome do banco dentro da pasta 'banks'
    data_emissao: new Date(),
    data_vencimento: new Date(new Date().getTime() + 10 * 24 * 3600 * 1000), // 5 dias futuramente
    valor: transaction.value * 100,
    nosso_numero: '0000000',
    numero_documento: '000000',
    cedente: 'Vergonha da profission',
    cedente_cnpj: '00000000000000',
    agencia: '0000',
    codigo_cedente: '0000000',
    carteira: '000',
  });
  const options = {
    type: 'pdf',
    format: 'A4',
    orientation: 'portrait',
  };
  let responseReturn;
  try {
    bill.renderHTML((html) => {
      htmlPdf.create(html, options).toBuffer((err, buffer) => {
        if (err) {
          responseReturn = res.status(500).json({ message: 'Internal Error' });
        }
        responseReturn = res.status(200).json(
          {
            bill: {
              pdf: buffer.toJSON().data,
              code: bill.linha_digitavel,
            },
          },
        );
      })
    });
    return responseReturn;
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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
