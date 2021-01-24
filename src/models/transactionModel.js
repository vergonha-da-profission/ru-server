const { getQueryBuilder } = require('../helpers/queryBuilder');

exports.createTransaction = async (transaction) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.insert('transaction', transaction);
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};
