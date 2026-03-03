/**
 * Authentication middleware.
 * Verifies JWT from Authorization header or cookie.
 * Attaches user to req.user for downstream handlers.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config');

// Protect routes — require authentication
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback to cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized. Please log in.', 401));
  }

  // Verify token
  const decoded = jwt.verify(token, config.jwt.secret);

  // Check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User belonging to this token no longer exists.', 401));
  }

  req.user = user;
  next();
});

// Restrict to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
