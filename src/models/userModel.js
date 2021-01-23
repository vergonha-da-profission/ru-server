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
