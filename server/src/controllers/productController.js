/**
 * Product Controller
 *
 * CRUD operations for products.
 * Public: getAll, getOne (filtered by isActive).
 * Admin: create, update, delete.
 */
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
exports.getProducts = catchAsync(async (req, res, next) => {
  const { category, featured, sort, search } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  let sortBy = '-createdAt'; // default: newest first
  if (sort === 'price-asc') sortBy = 'variants.0.price';
  if (sort === 'price-desc') sortBy = '-variants.0.price';
  if (sort === 'rating') sortBy = '-ratingsAverage';
  if (sort === 'name') sortBy = 'name';

  const products = await Product.find(filter)
    .sort(sortBy)
    .select('-__v');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get single product by slug or ID
// @route   GET /api/products/:identifier
// @access  Public
exports.getProduct = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;

  let product;

  // Try by slug first, then by ID
  product = await Product.findOne({ slug: identifier, isActive: true })
    .populate({
      path: 'reviews',
      match: { isApproved: true },
      populate: { path: 'user', select: 'name' },
      options: { sort: { createdAt: -1 }, limit: 20 },
    });

  if (!product && identifier.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findOne({ _id: identifier, isActive: true })
      .populate({
        path: 'reviews',
        match: { isApproved: true },
        populate: { path: 'user', select: 'name' },
        options: { sort: { createdAt: -1 }, limit: 20 },
      });
  }

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete a product (soft delete)
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Product deactivated.',
  });
});
