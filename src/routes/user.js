const express = require('express');

const auth = require('../middlewares/authToken');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/create', auth.verifyAuthentication, userController.createUser);

router.get('/get', auth.verifyAuthentication, userController.getProfileInfoById);

module.exports = router;
