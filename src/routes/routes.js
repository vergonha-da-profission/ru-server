const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth'));

router.use('/doc', require('./swagger'));

module.exports = router;
