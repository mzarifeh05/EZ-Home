const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.js');


router.post('/', authMiddleware, authorize(['admin']), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);

module.exports = router;