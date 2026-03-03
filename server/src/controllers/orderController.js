/**
 * Order Controller
 *
 * Handles order creation (with stock validation), retrieval, and
 * status updates. Stripe checkout session creation lives here too.
 */
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config');
const stripe = require('stripe')(config.stripe.secretKey);

// @desc    Create Stripe checkout session
// @route   POST /api/orders/checkout
// @access  Private
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { items, shipping } = req.body;

  // Validate items and build line items
  const lineItems = [];
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }

    const variant = product.variants.id(item.variantId);
    if (!variant) {
      return next(new AppError(`Variant not found for ${product.name}`, 404));
    }

    if (variant.stock < item.quantity) {
      return next(
        new AppError(
          `Insufficient stock for ${product.name} (${variant.size}). Available: ${variant.stock}`,
          400
        )
      );
    }

    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: `${product.name} — ${variant.size}`,
          description: product.tagline || product.description.substring(0, 100),
          ...(primaryImage && { images: [primaryImage.url] }),
        },
        unit_amount: Math.round(variant.price * 100), // Stripe uses paise
      },
      quantity: item.quantity,
    });

    orderItems.push({
      product: product._id,
      name: product.name,
      image: primaryImage?.url,
      variant: { size: variant.size, price: variant.price },
      quantity: item.quantity,
      lineTotal: variant.price * item.quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingCost = subtotal >= 499 ? 0 : 49; // Free shipping over ₹499
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + shippingCost + tax;

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: shipping.email,
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingCost * 100, currency: 'inr' },
          display_name: shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
    ],
    metadata: {
      userId: req.user.id,
      orderItems: JSON.stringify(
        orderItems.map((oi) => ({
          p: oi.product.toString(),
          s: oi.variant.size,
          q: oi.quantity,
        }))
      ),
      shippingData: JSON.stringify({
        name: shipping.name,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
      }),
    },
    success_url: `${config.clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.clientUrl}/cart`,
  });

  res.status(200).json({
    success: true,
    sessionId: session.id,
    url: session.url,
  });
});

// @desc    Stripe webhook — fulfill order after payment
// @route   POST /api/orders/webhook
// @access  Public (Stripe only)
exports.stripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      config.stripe.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await fulfillOrder(session);
  }

  res.status(200).json({ received: true });
});

// Internal: create order from completed Stripe session
async function fulfillOrder(session) {
  // Idempotency — prevent duplicate orders on webhook retries
  const existingOrder = await Order.findOne({ stripeSessionId: session.id });
  if (existingOrder) return;

  const { userId, orderItems, shippingData } = session.metadata;
  const rawItems = JSON.parse(orderItems);
  // Expand shorthand keys from metadata (kept short to stay within Stripe's 500-char limit)
  const items = rawItems.map((i) => ({ product: i.p || i.product, variantSize: i.s || i.variantSize, quantity: i.q || i.quantity }));
  const shipping = JSON.parse(shippingData);

  // Build full order items with prices
  const fullItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      console.error(`[fulfillOrder] Product ${item.product} not found — skipping`);
      continue;
    }
    const variant = product.variants.find(
      (v) => v.size === item.variantSize
    );
    if (!variant) {
      console.error(`[fulfillOrder] Variant ${item.variantSize} not found on ${product.name} — skipping`);
      continue;
    }

    // Atomic stock decrement to prevent overselling
    await Product.updateOne(
      { _id: item.product, 'variants.size': item.variantSize, 'variants.stock': { $gte: item.quantity } },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );

    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

    fullItems.push({
      product: product._id,
      name: product.name,
      image: primaryImage?.url,
      variant: { size: variant.size, price: variant.price },
      quantity: item.quantity,
      lineTotal: variant.price * item.quantity,
    });
  }

  const subtotal = fullItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shippingCost = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  await Order.create({
    user: userId,
    items: fullItems,
    shipping,
    subtotal,
    shippingCost,
    tax,
    total,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent,
  });
}

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('items.product', 'name slug images');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'items.product',
    'name slug images'
  );

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  // Users can only see their own orders (admins can see any)
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order.', 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Get order by Stripe session ID (for success page)
// @route   GET /api/orders/session/:sessionId
// @access  Private
exports.getOrderBySession = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    stripeSessionId: req.params.sessionId,
    user: req.user.id,
  });

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 20), 100);

  const filter = {};
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name email');

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pages: Math.ceil(total / limit),
    data: orders,
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  order.status = status;

  if (status === 'delivered') order.deliveredAt = new Date();
  if (status === 'cancelled') order.cancelledAt = new Date();

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});
