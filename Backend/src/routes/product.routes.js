const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller.js');
const { authMiddleware, authorize } = require('../middlewares/auth.middlewares.js');
const {validateProductId,validateCreateProduct,validateUpdateProduct} = require('../validation/product.valedation.js');


router.get('/', (req, res) => ProductController.getAllProducts(req, res));
router.get('/:id', validateProductId, (req, res) => ProductController.getProductById(req, res));

router.post('/', authMiddleware, authorize(['admin']), validateCreateProduct, (req, res) => ProductController.createProduct(req, res));
router.put('/:id', authMiddleware, authorize(['admin']), validateProductId, validateUpdateProduct, (req, res) => ProductController.updateProduct(req, res));
router.delete('/:id', authMiddleware, authorize(['admin']), validateProductId, (req, res) => ProductController.deleteProduct(req, res));

module.exports = router;
