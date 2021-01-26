const express = require('express');

const auth = require('../middlewares/authToken');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/create', userController.createUser);

/*
* @endpoint: /profile
* @args: header_token
* @returns: json
*/
router.get('/profile', auth.verifyAuthentication, userController.getProfileInfoById);

/*
* @endpoint: /balance
* @args: header_token
* @returns: json
*/
router.get('/balance', auth.verifyAuthentication, userController.getBalanceById);

module.exports = router;
