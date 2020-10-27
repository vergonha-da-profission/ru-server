const express = require('express');

const router = express.Router();

const exampleRoute = require('./example');

router.use('/example', exampleRoute);

module.exports = router;
