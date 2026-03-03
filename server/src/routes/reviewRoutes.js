/**
 * Review Routes
 *
 * GET    /api/products/:productId/reviews — Get product reviews
 * POST   /api/products/:productId/reviews — Create review
 * PUT    /api/reviews/:id                 — Update own review
 * DELETE /api/reviews/:id                 — Delete own review
 * GET    /api/reviews                     — All reviews (admin)
 */
const express = require('express');
const router = express.Router({ mergeParams: true }); // access :productId
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const { reviewValidation } = require('../middleware/validate');

// Public: get reviews for a product (nested route)
router.get('/', getProductReviews);

// Private: create review for a product
router.post('/', protect, reviewValidation, createReview);

// These are mounted at /api/reviews in server.js
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin
router.get('/all', protect, authorize('admin'), getAllReviews);

module.exports = router;
