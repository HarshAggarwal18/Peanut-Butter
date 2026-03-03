/**
 * PB Brand — Express Application Setup
 *
 * Separating app from server allows for clean testing.
 * All middleware, routes, and error handling configured here.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const config = require('./config');

// Controllers for webhook (needs raw body)
const { stripeWebhook } = require('./controllers/orderController');

const app = express();

// ─── Security ────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});
app.use('/api/auth', authLimiter);

// ─── Stripe Webhook (MUST be before express.json) ────────
// Stripe requires the raw body for signature verification
app.post(
  '/api/orders/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// ─── Body Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────────
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ──────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PB Brand API is running',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────
const AppError = require('./utils/AppError');
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// ─── Global Error Handler ────────────────────────────────
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
