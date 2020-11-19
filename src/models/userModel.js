const { getQueryBuilder } = require('../helpers/queryBuilder');

exports.findUserByUsername = async (username) => {
  const queryBuilder = await getQueryBuilder();
  try {
    return queryBuilder.select(['*']).where('username', username)
      .get('users');
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

exports.deleteLorem = async (id) => {
  const queryBuilder = await getQueryBuilder();
  try {
    const obj = { deletedRow: await queryBuilder.get_where('lorem', { id }), setRes: await queryBuilder.delete('lorem', { id }) };
    if (obj.deletedRow[0] === undefined) {
      return {
        deletedRow: {
          id: undefined,
          word: undefined,
        },
        affectedRows: 'Inválid ID',
      };
    }
    return {
      deletedRow: {
        id: obj.deletedRow[0].id,
        word: obj.deletedRow[0].word,
      },
      affectedRows: obj.setRes.affectedRows,
    };
  } catch (err) {
    queryBuilder.release();
    throw new Error(err);
  }
};
