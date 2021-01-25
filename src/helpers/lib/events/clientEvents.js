const { sendToTransaction, sendToBalance } = require('../../../ws');

// target = express, data = {}
exports.newEventTransaction = (data) => {
  sendToTransaction(data);
};

// target = express, data = {}
exports.newEventBalance = (data) => {
  sendToBalance(data);
};
