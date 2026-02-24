const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.js');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authMiddleware, authController.logout);

router.get('/', authMiddleware, authController.getMe);
router.put('/', authMiddleware, authController.updateMe);

router.put('/update/:id', authMiddleware, authorize(['admin']), authController.update);

module.exports = router;
