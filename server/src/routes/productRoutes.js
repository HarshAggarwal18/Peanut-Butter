/**
 * Product Routes
 *
 * GET    /api/products              — List all active products
 * GET    /api/products/:identifier  — Get product by slug or ID
 * POST   /api/products              — Create (admin)
 * PUT    /api/products/:id          — Update (admin)
 * DELETE /api/products/:id          — Soft delete (admin)
 */
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Re-route into review router for nested reviews
const reviewRouter = require('./reviewRoutes');
router.use('/:productId/reviews', reviewRouter);

// Public
router.get('/', getProducts);
router.get('/:identifier', getProduct);

// Admin
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
