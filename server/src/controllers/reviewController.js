/**
 * Review Controller
 *
 * Users can create, update, and delete their own reviews.
 * Admin can list all reviews and moderate them.
 * Rating aggregates are recalculated automatically by the Review model.
 */
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = catchAsync(async (req, res, next) => {
  if (!req.params.productId) {
    return next(new AppError('Product ID is required.', 400));
  }

  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  })
    .populate('user', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;

  // Check product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user.id,
    product: productId,
  });
  if (existingReview) {
    return next(new AppError('You have already reviewed this product.', 400));
  }

  // Check if user has purchased this product (verified purchase)
  const hasPurchased = await Order.findOne({
    user: req.user.id,
    'items.product': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    user: req.user.id,
    product: productId,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate('user', 'name');

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found.', 404));
  }

  // Check ownership (unless admin)
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this review.', 403));
  }

  const allowedFields = ['rating', 'title', 'comment'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  // Use save() instead of findByIdAndUpdate so post('save') hook recalculates product ratings
  Object.assign(review, updates);
  await review.save();
  await review.populate('user', 'name');

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found.', 404));
  }

  // Check ownership (unless admin)
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review.', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Review deleted.',
  });
});

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Admin
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'name slug')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});
