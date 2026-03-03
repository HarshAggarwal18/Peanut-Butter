/**
 * Generates a JWT token and attaches it to a cookie.
 * Used after registration and login.
 */
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
  };

  // Remove password from output
  const userObj = user.toObject();
  delete userObj.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      data: userObj,
    });
};

module.exports = { generateToken, sendTokenResponse };
