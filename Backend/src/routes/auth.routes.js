const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.middlewares.js');
const {validateLogin, validateRegister, validateUpdateMe, validateAdminUpdate, validateObjectIdParam} = require('../validation/auth.valedation.js');
const { authLimiter } = require('../middlewares/rateLimit.middlewares.js');
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/logout', authMiddleware, authController.logout);

router.get('/', authMiddleware, authController.getMe);
router.put('/', authMiddleware, validateUpdateMe, authController.updateMe);

router.put('/update/:id', authMiddleware, authorize(['admin']), validateObjectIdParam('id'), validateAdminUpdate, authController.update);

module.exports = router;
