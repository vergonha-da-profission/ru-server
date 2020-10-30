const slogger = require('node-slogger');

const loggerTypes = ['debug', 'info', 'trace', 'warn', 'error'];

exports.logPerType = async (string, logType) => {
  if (loggerTypes.includes(logType)) {
    slogger[logType](string);
  } else {
    slogger.error('Invalid log option');
  }
};
