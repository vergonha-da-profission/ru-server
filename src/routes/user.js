const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/create', userController.createUser);

router.get('/get', userController.getProfileInfoById);

module.exports = router;
