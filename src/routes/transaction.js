const express = require('express');
const transactionController = require('../controllers/transaction');

const router = express.Router();

router.post('/change', transactionController.changeBalance);

module.exports = router;
