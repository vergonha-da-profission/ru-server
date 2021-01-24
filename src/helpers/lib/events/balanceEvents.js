const { sendTo } = require('../../../ws');

exports.newEvent = (userId, data) => {
  sendTo({ userId, data });
};
