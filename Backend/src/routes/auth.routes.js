const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { authMiddleware } = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.put('/update/:id', authController.update);
router.put('/Update/:id', authController.teat);
module.exports = router;
