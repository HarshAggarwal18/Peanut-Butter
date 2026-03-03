/**
 * Order Routes
 *
 * POST /api/orders/checkout            — Create Stripe session
 * POST /api/orders/webhook             — Stripe webhook (raw body)
 * GET  /api/orders/my                  — User's orders
 * GET  /api/orders/session/:sessionId  — Order by Stripe session
 * GET  /api/orders/:id                 — Single order
 * GET  /api/orders                     — All orders (admin)
 * PUT  /api/orders/:id/status          — Update status (admin)
 */
const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  getMyOrders,
  getOrder,
  getOrderBySession,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validate');

// Note: webhook route is mounted separately in server.js with raw body parser

// Private
router.post('/checkout', protect, orderValidation, createCheckoutSession);
router.get('/my', protect, getMyOrders);
router.get('/session/:sessionId', protect, getOrderBySession);
router.get('/:id', protect, getOrder);

// Admin
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
