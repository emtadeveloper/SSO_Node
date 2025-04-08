const express = require('express');
const router = express.Router();
const { homePage, verifyToken } = require('../controllers/token.controller');

router.get('/', homePage);
router.post('/verifyToken', verifyToken);

module.exports = router;
