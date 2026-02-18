const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.put('/Update/:id', authController.update);

module.exports = router;