const express = require('express');
const router = express.Router();
const {
    loginPage,
    loginHandler,
    registerPage,
    logoutHandler
} = require('../controllers/auth.controller');

router.get('/login', loginPage);
router.post('/login', loginHandler);
router.get('/register', registerPage);
router.get('/logout', logoutHandler);

module.exports = router;
