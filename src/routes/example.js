const express = require('express');
const slogger = require('node-slogger');

const router = express.Router();

router.get('/batata', () => {
  slogger.info('Batata');
});

module.exports = router;
