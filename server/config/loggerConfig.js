const morgan = require("morgan");
const logger = require("../utils/logger");

/**
 * Morgan stream — pipe HTTP logs to Winston.
 */
const morganStream = {
  write: (message) => {
    // Morgan adds a trailing newline — strip it
    logger.info(message.trim(), { source: "morgan" });
  },
};

/**
 * Custom Morgan token: userId.
 * Shows the authenticated user's ID in access logs.
 */
morgan.token("user-id", (req) => req.user?._id?.toString() || "guest");

/**
 * Custom Morgan token: body size in bytes.
 */
morgan.token("body-size", (req) => {
  const len = req.headers["content-length"];
  return len ? `${len}B` : "-";
});

/**
 * Development format — colourful and readable.
 */
const devFormat = ":method :url :status :response-time ms — user::user-id";

/**
 * Production format — structured for log aggregators.
 * Fields: method, url, status, response-time, content-length, user-agent, userId
 */
const prodFormat =
  ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

const buildMorganMiddleware = () =>
  morgan(process.env.NODE_ENV === "production" ? prodFormat : devFormat, {
    stream: morganStream,
    // Skip successful health checks to reduce log noise
    skip: (req, res) => req.path === "/health" && res.statusCode === 200,
  });

module.exports = { buildMorganMiddleware, morganStream };
