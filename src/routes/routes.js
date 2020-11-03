const express = require('express');

const router = express.Router();

router.use('/example', require('./example'));

router.use('/doc', require('./swagger'));

module.exports = router;
