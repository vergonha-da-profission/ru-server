const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth'));

router.use('/doc', require('./swagger'));

router.use('/user', require('./user'));

router.use('/transaction', require('./transaction'));

module.exports = router;
