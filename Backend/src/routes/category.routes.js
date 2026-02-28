const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.js');
const {validateCategoryId, validateCreateCategory, validateUpdateCategory} = require('../validation/category.validation.js');


router.get('/', categoryController.getAllCategories);
router.get('/:id', validateCategoryId, categoryController.getCategoryById);


router.post('/', authMiddleware, authorize(['admin']), validateCreateCategory, categoryController.createCategory);
router.put('/:id', authMiddleware, authorize(['admin']), validateCategoryId, validateUpdateCategory, categoryController.updateCategory);
router.delete('/:id', authMiddleware, authorize(['admin']), validateCategoryId, categoryController.deleteCategory);

module.exports = router;
