const mongoose = require("mongoose");
const logger = require("../utils/logger");

let retryCount = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s to find a server
      socketTimeoutMS: 45000, // 45s socket timeout
      connectTimeoutMS: 10000, // 10s to establish connection
      maxPoolSize: 10, // Max connections in pool
      minPoolSize: 2, // Keep at least 2 alive
      heartbeatFrequencyMS: 10000, // Check server health every 10s
      retryWrites: true,
      w: "majority", // Ensure writes reach majority
    });

    retryCount = 0;
    logger.info(`MongoDB connected: ${conn.connection.host}`, {
      database: conn.connection.name,
      readyState: conn.connection.readyState,
    });

    // ── Connection event listeners ──
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", { error: err.message });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected — will auto-reconnect.");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected successfully.");
    });

    // Graceful shutdown — close connection on SIGINT/SIGTERM
    process.on("SIGINT", () => gracefulClose("SIGINT"));
    process.on("SIGTERM", () => gracefulClose("SIGTERM"));
  } catch (error) {
    logger.error("MongoDB connection failed", {
      error: error.message,
      attempt: retryCount + 1,
    });

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      const delay = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff, max 30s
      logger.info(
        `Retrying MongoDB connection in ${delay / 1000}s... (${retryCount}/${MAX_RETRIES})`,
      );
      await new Promise((res) => setTimeout(res, delay));
      return connectDB();
    }

    logger.error("MongoDB max retries reached — exiting process.");
    process.exit(1);
  }
};

const gracefulClose = async (signal) => {
  logger.info(`${signal} received — closing MongoDB connection...`);
  await mongoose.connection.close();
  logger.info("MongoDB connection closed.");
  process.exit(0);
};

module.exports = connectDB;
