const { Validator } = require('node-input-validator');
const path = require('path');
const userModel = require('../models/userModel');
const qrCodeHelper = require('../helpers/qrCode');
const { hashPassword } = require('../helpers/encrypt');
const { generateToken } = require('../helpers/authHelper');
const { tryLoginUffs } = require('../helpers/idUffsHelper');

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  const validator = new Validator({ username, password }, {
    username: 'required|minLength:3',
    password: 'required|minLength:2',
  });

  const inputIsValid = await validator.check();

  if (!inputIsValid) {
    return res.status(422).json({
      message: 'One or more fields are malformed',
      code: 422,
      error: validator.errors,
    });
  }

  try {
    const hashedPassword = hashPassword(password);

    const user = await userModel.findByEmail(username);

    if (user[0] === undefined) {
      const userUffs = await tryLoginUffs({
        authenticator: username,
        password,
        imagePath: path.join(__dirname, '..', '..', 'public', 'avatar'),
      });

      if (userUffs === null) {
        return res.json({ message: 'User Or Password incorrect' });
      }

      const insertResponse = await userModel.createUser({
        email: userUffs.email,
        password: hashedPassword,
        name: userUffs.name,
        id_uffs: userUffs.idUffs,
        cpf: userUffs.cpf,
      });

      if (insertResponse.insertId) {
        const qrCode = await qrCodeHelper.createImage(insertResponse.insertId);

        await userModel.updateById(insertResponse.insertId, {
          qr_code: qrCode,
          avatar: userUffs.image,
        });

        return res.json({
          name: userUffs.name,
          username: userUffs.idUffs,
          token: generateToken({ userId: insertResponse.insertId }),
        });
      }

      return res.json({ message: 'User Or Password incorrect' });
      // tentar logar id uffs
      // eslint-disable-next-line
    } else if (user[0].password !== hashedPassword) {
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
