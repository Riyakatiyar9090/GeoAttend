/**
 * server.js — Process entry point.
 *
 * Loads environment, connects database,
 * starts the HTTP server, starts background jobs,
 * handles process-level signals.
 */

// ── Load .env BEFORE anything else ──────────────
require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/database");
const logger = require("./utils/logger");
const { startQRExpiryJob, stopQRExpiryJob } = require("./jobs/qrExpiryJob");
const { verifyMailConnection } = require("./config/mailConfig");
const PORT = parseInt(process.env.PORT, 10) || 5000;

// ─────────────────────────────────────────
// Handle uncaught synchronous exceptions.
// Log, then exit — PM2 / Render will restart.
// ─────────────────────────────────────────
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION — shutting down", {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// ─────────────────────────────────────────
// Start server
// ─────────────────────────────────────────
const startServer = async () => {
  // 1. Connect to MongoDB Atlas
  await connectDB();
  // 2. Verify SMTP connection (doesn't stop server if email isn't configured)
  await verifyMailConnection();

  // 2. Start background jobs
  startQRExpiryJob(30_000); // Expire QR tokens every 30s

  // 3. Create HTTP server from Express app
  const server = http.createServer(app);

  // 4. Configure keep-alive for production
  server.keepAliveTimeout = 65_000; // Must be > load balancer idle timeout
  server.headersTimeout = 66_000; // Slightly above keepAliveTimeout

  // 5. Start listening
  server.listen(PORT, () => {
    logger.info("─────────────────────────────────────────");
    logger.info(`GeoAttend API running`, {
      port: PORT,
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION || "1.0.0",
      pid: process.pid,
      nodeVersion: process.version,
      url: `http://localhost:${PORT}`,
      health: `http://localhost:${PORT}/health`,
    });
    logger.info("─────────────────────────────────────────");
  });

  // ─────────────────────────────────────────
  // Handle unhandled promise rejections.
  // ─────────────────────────────────────────
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("UNHANDLED REJECTION", {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: String(promise),
    });

    // Give in-flight requests time to complete
    server.close(() => {
      logger.info("Server closed after unhandledRejection.");
      process.exit(1);
    });

    // Force exit if server doesn't close in 10s
    setTimeout(() => process.exit(1), 10_000).unref();
  });

  // ─────────────────────────────────────────
  // Graceful shutdown on SIGTERM (Render sends this before stop).
  // ─────────────────────────────────────────
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received — beginning graceful shutdown...");

    stopQRExpiryJob();

    server.close(async () => {
      logger.info("HTTP server closed — no more new connections.");

      try {
        const mongoose = require("mongoose");
        await mongoose.connection.close();
        logger.info("MongoDB connection closed.");
      } catch (err) {
        logger.error("Error closing MongoDB:", { error: err.message });
      }

      logger.info("Graceful shutdown complete.");
      process.exit(0);
    });

    // Force exit after 30s if graceful shutdown hangs
    setTimeout(() => {
      logger.error("Graceful shutdown timed out — forcing exit.");
      process.exit(1);
    }, 30_000).unref();
  });

  // SIGINT — Ctrl+C in local dev
  process.on("SIGINT", () => {
    logger.info("SIGINT received — shutting down for local dev.");
    stopQRExpiryJob();
    server.close(() => process.exit(0));
  });

  return server;
};

startServer().catch((err) => {
  logger.error("Failed to start server", {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
