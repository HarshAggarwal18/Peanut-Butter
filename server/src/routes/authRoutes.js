/**
 * Auth Routes
 *
 * POST /api/auth/register  — Create new account
 * POST /api/auth/login     — Log in
 * POST /api/auth/logout    — Clear token
 * GET  /api/auth/me        — Get current user
 * PUT  /api/auth/me        — Update profile
 */
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validate');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

module.exports = router;
