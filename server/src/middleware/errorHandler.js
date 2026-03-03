/**
 * Global error handling middleware.
 * Catches all errors forwarded via next(err) or thrown in async handlers.
 *
 * Strategy:
 * - Operational errors → send clean message to client
 * - Programming errors → log full stack, send generic message
 */
const AppError = require('../utils/AppError');
const config = require('../config');

// Handle specific Mongoose/MongoDB errors
const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`Duplicate value for "${field}". Please use another value.`, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpired = () =>
  new AppError('Token expired. Please log in again.', 401);

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, stack: err.stack };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') error = handleCastError(err);

  // Mongoose duplicate key
  if (err.code === 11000) error = handleDuplicateKey(err);

  // Mongoose validation
  if (err.name === 'ValidationError') error = handleValidationError(err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  // Log in development
  if (config.env === 'development') {
    console.error('ERROR:', err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    status: error.status || 'error',
    message: error.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;
