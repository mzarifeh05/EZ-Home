const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.js');


router.get('/', (req, res) => ProductController.getAllProducts(req, res));
router.get('/:id', (req, res) => ProductController.getProductById(req, res));

router.post('/', authMiddleware, authorize('admin'), (req, res) => ProductController.createProduct(req, res));
router.put('/:id', authMiddleware, authorize('admin'), (req, res) => ProductController.updateProduct(req, res));
router.delete('/:id', authMiddleware, authorize('admin'), (req, res) => ProductController.deleteProduct(req, res));

module.exports = router;