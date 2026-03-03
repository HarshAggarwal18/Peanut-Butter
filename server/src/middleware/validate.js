/**
 * Validation middleware using express-validator.
 * Reusable validation chains for each route.
 */
const { body, param, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(messages.join('. '), 400));
  }
  next();
};

// Auth validations
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Review validations
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Comment must be between 5 and 1000 characters'),
  validate,
];

// Order validations
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.variantId').notEmpty().withMessage('Variant is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shipping.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shipping.email').isEmail().withMessage('Valid email is required'),
  body('shipping.address.street').trim().notEmpty().withMessage('Street is required'),
  body('shipping.address.city').trim().notEmpty().withMessage('City is required'),
  body('shipping.address.state').trim().notEmpty().withMessage('State is required'),
  body('shipping.address.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  validate,
];

// MongoDB ID param validation
const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  reviewValidation,
  orderValidation,
  mongoIdValidation,
};
