const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas
 * Uses retry logic for production resilience.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are defaults in Mongoose 8+ but kept for clarity
      serverSelectionTimeoutMS: 5000, // Fail fast if cluster is unreachable
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(
      `✅  MongoDB Connected: ${conn.connection.host} [${conn.connection.name}]`,
    );

    // Log when mongoose is disconnected
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected — attempting to reconnect...");
    });

    // Log when mongoose reconnects
    mongoose.connection.on("reconnected", () => {
      console.log("✅  MongoDB reconnected");
    });
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    // Exit process with failure — let the process manager (PM2 / Docker) restart it
    process.exit(1);
  }
};

module.exports = connectDB;
