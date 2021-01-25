const { getQueryBuilder } = require('../helpers/queryBuilder');

exports.createUser = async (user) => {
/*
user = {
  email: "email",
  password: "hashed_password",
  name: "Name",
  id_uffs: "id_uffs"
  cpf: "cpf"
}
*/
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.insert('user', user);
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.insertQrCode = async (user) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.update(
      'user',
      {
        qr_code: user.qr_code,
      },
      {
        id: user.id,
      },
    );
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.getBalance = async (user) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.select('balance')
      .where({ 'id = ': user.id })
      .get('user');
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.changeBalance = async ({ id, balance }) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.update('user', { balance }, { id });
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.findByEmail = async (username) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.select('name, password, id')
      .where({ 'email = ': username })
      .get('user');
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.getTransactionDataById = async (user) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.select('avatar, name, balance')
      .where({ 'id = ': user.id })
      .get('user');
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.getProfileInfoById = async (userId) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.select('name, email, id_uffs, qr_code, avatar, cpf, balance')
      .where({ 'id = ': userId })
      .get('user');
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};
