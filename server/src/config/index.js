/**
 * Centralized configuration module.
 * Single source of truth — no scattered process.env calls.
 */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pb-brand',
  },

  jwt: {
    secret: process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me-in-production' : undefined),
    expire: process.env.JWT_EXPIRE || '7d',
    cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

// Validate critical env vars in production
if (config.env === 'production') {
  const required = ['jwt.secret', 'stripe.secretKey', 'mongo.uri'];
  required.forEach((key) => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

module.exports = config;
