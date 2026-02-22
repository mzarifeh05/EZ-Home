const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.js');
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout',authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getMe);

router.put('/Update/:id', authMiddleware, authorize(['admin']), authController.update);

module.exports = router;
