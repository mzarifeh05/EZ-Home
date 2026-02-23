const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.js');


router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);


router.post('/', authMiddleware, authorize(['admin']), categoryController.createCategory);
router.put('/:id', authMiddleware, authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', authMiddleware, authorize(['admin']), categoryController.deleteCategory);
router.patch('/:id/toggle', authMiddleware, authorize(['admin']), categoryController.toggleActive);

module.exports = router;