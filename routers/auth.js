const express = require('express');
const router = express.Router();

const loginController = require('../controllers/auth/login');
const registerController = require('../controllers/auth/register');
const logoutController = require('../controllers/auth/logout');

router.get('/login', loginController.getLogin);
router.post('/login', loginController.postLogin);
router.post('/verifyToken', loginController.verifyToken);

router.get('/register', registerController.getRegister);
router.post('/register', registerController.postRegister);

router.get('/logout', logoutController.logout);

module.exports = router;
