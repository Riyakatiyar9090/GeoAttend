/**
 * server.js — Entry point.
 *
 * Responsibilities:
 *   1. Load environment variables FIRST
 *   2. Connect to MongoDB
 *   3. Start the HTTP server
 *   4. Handle unhandled rejections and uncaught exceptions gracefully
 */

// Load .env before anything else — critical
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────
// Handle uncaught synchronous exceptions.
// These are programming errors — log and exit.
// ─────────────────────────────────────────
process.on("uncaughtException", (error) => {
  console.error("💥  UNCAUGHT EXCEPTION — shutting down...");
  console.error(error.name, error.message);
  process.exit(1);
});

// ─────────────────────────────────────────
// Connect to database, then start server
// ─────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log("─────────────────────────────────────────");
    console.log(`🚀  GeoAttend API running`);
    console.log(`    Mode    : ${process.env.NODE_ENV}`);
    console.log(`    Port    : ${PORT}`);
    console.log(`    URL     : http://localhost:${PORT}`);
    console.log(`    Health  : http://localhost:${PORT}/health`);
    console.log("─────────────────────────────────────────");
  });
  // Add after connectDB() succeeds, inside startServer():
  const { startQRExpiryJob, stopQRExpiryJob } = require("./jobs/qrExpiryJob");

  const startServer = async () => {
    await connectDB();

    // Start QR expiry cleanup job
    startQRExpiryJob(30_000); // Run every 30 seconds

    const server = app.listen(PORT, () => {
      console.log(`🚀  GeoAttend API running on port ${PORT}`);
    });

    // Graceful shutdown — stop job before closing
    process.on("SIGTERM", () => {
      stopQRExpiryJob();
      server.close(() => process.exit(0));
    });
  };

  // ─────────────────────────────────────────
  // Handle unhandled promise rejections.
  // Close server gracefully before exiting.
  // ─────────────────────────────────────────
  process.on("unhandledRejection", (error) => {
    console.error("💥  UNHANDLED REJECTION — shutting down...");
    console.error(error.name, error.message);

    // Allow in-flight requests to complete before closing
    server.close(() => {
      process.exit(1);
    });
  });

  // ─────────────────────────────────────────
  // Graceful shutdown on SIGTERM (e.g. Docker stop, PM2 reload)
  // ─────────────────────────────────────────
  process.on("SIGTERM", () => {
    console.log("👋  SIGTERM received — shutting down gracefully...");
    server.close(() => {
      console.log("💤  Process terminated.");
    });
  });
};

startServer();
