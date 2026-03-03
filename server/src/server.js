/**
 * PB Brand — Server Entry Point
 *
 * Connects to MongoDB, then starts Express.
 * Handles unhandled rejections and uncaught exceptions.
 */
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║     PB Brand API Server                  ║
  ║     Environment: ${config.env.padEnd(22)}║
  ║     Port: ${String(config.port).padEnd(29)}║
  ║     Ready ✓                              ║
  ╚══════════════════════════════════════════╝
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
