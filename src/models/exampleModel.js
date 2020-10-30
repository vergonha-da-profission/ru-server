const { getQueryBuilder } = require('../helpers/queryBuilder');

exports.getLorem = async (id, word) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.select([id, word])
      .get('lorem');
  } finally {
    queryBuilder.release();
  }
};

exports.setLorem = async (word) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.insert('lorem', { word });
  } catch (err) {
    throw new Error(err);
  } finally {
    queryBuilder.release();
  }
};

exports.updateLorem = async (id, word) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.update('lorem', { word }, { id });
  } catch (err) {
    queryBuilder.release();
    throw new Error(err);
  }
};
