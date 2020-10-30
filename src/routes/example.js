const express = require('express');
const exampleController = require('../controllers/example');

const router = express.Router();

router.get('/getLorem', exampleController.getLorem);
router.post('/setLorem', exampleController.setLorem);
router.put('/updateLorem', exampleController.updateLorem);

module.exports = router;
