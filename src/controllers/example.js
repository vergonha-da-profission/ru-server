const { Validator } = require('node-input-validator');
const exampleModel = require('../models/exampleModel');

async function getArrayOfWords(lorem) {
  const words = [];
  for (let i = 0; i < lorem.length; i++) {
    words.push(lorem[i].word);
  }
  return words;
}

async function asBool(input) {
  if (input === 'false' || input === 0) return false;
  if (input === 'true' || input === 1) return true;
  return input;
}

exports.getLorem = async (req, res, next) => {
  const { id, word } = req.query;
  const validator = new Validator(
    { id, word }, {
      id: 'required|boolean',
      word: 'required|boolean',
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
    const lorem = await exampleModel.getLorem(((await asBool(id)) === true ? 'id' : ''), ((await asBool(word)) === true ? 'word' : ''));
    return res.status(200).json((await asBool(id) === false && await asBool(word) === false)
      ? await getArrayOfWords(lorem) : lorem);
  } catch (err) {
    return next(err);
  }
};

exports.setLorem = async (req, res, next) => {
  const { word } = req.body;
  const validator = new Validator(
    { word }, {
      word: 'required|minLength:2',
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
    const setRes = await exampleModel.setLorem(word);
    if (setRes.insertId) {
      return res.status(201).json({ id: setRes.insertId, word, message: 'Lorem created suscessfully.' });
    }
  } catch (err) {
    return next(err);
  }
  return res.status(500).json({ message: 'Internal Error' });
};

exports.updateLorem = async (req, res, next) => {
  const { id, word } = req.body;
  const validator = new Validator(
    { id, word }, {
      id: 'required|integer',
      word: 'required|minLength:2',
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
    const setRes = await exampleModel.updateLorem(id, word);
    if (setRes.affectedRows > 0) {
      return res.status(200).json({ id, word, message: 'Lorem updated suscessfully.' });
    }
  } catch (err) {
    return next(err);
  }
  return res.status(500).json({ message: 'Internal Error' });
};

exports.deleteLorem = async (req, res, next) => {
  const { id } = req.body;
  const validator = new Validator(
    { id }, {
      id: 'required|integer',
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
    const { deletedRow, affectedRows } = await exampleModel.deleteLorem(id);
    if (affectedRows === 'Inválid ID') {
      return res.status(404).json({
        message: 'Doesn\'t exist an word for this ID',
        code: 404,
      });
    } if (affectedRows > 0) {
      return res.status(200).json({ id: deletedRow.id, word: deletedRow.word, message: 'Lorem deleted suscessfully.' });
    }
  } catch (err) {
    return next(err);
  }
  return res.status(500).json({ message: 'Internal Error' });
};
