const express = require('express');
const auth = require('../middlewares/authToken');

const transactionController = require('../controllers/transaction');

const router = express.Router();

/*
* @endpoint: /add
* @args: header_token
* @returns: json
*/
router.post('/add', auth.verifyAuthentication, transactionController.increaseBalance);

/*
* @endpoint: /debt
* @args: custom_token
* @returns: json
*/
router.post('/debt', auth.verifyDebt, transactionController.decreaseBalance);

/*
* @endpoint: /add
* @args: auth_token
* @returns: json
*/
router.get('/bank-silk', auth.verifyAuthentication, transactionController.getBillBuffer);

module.exports = router;
