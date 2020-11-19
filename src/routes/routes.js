const express = require('express');

const router = express.Router();

router.use('/example', require('./example'));

router.use('/doc', require('./swagger'));

router.use('/user', require('./user'));

module.exports = router;
