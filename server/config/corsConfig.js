const { AppError } = require("../middleware/errorMiddleware");

/**
 * Build the CORS options object.
 *
 * Allowed origins:
 *   - CLIENT_URL     (e.g. http://localhost:3000 in dev)
 *   - CLIENT_URL_PROD (e.g. https://geoattend.vercel.app in prod)
 *
 * The function form is used so origin decisions are made
 * per-request rather than at startup, allowing env vars
 * to be updated without a restart (useful on Render).
 */
const buildCorsOptions = () => {
  const origins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_PROD,

    // React / Vite
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    // CRA
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    "http://localhost:3001",
  ].filter(Boolean);
  return {
    origin: (requestOrigin, callback) => {
      // Allow server-to-server requests (no origin header)
      if (!requestOrigin) return callback(null, true);

      if (origins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked origin: ${requestOrigin}`);
        callback(
          new AppError(
            `CORS policy: Origin "${requestOrigin}" is not allowed.`,
            403,
          ),
        );
      }
    },
    credentials: true, // Required for HttpOnly cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-CSRF-Token",
    ],
    exposedHeaders: ["X-Total-Count", "X-Page-Count"],
    maxAge: 600, // Preflight cache: 10 minutes
    optionsSuccessStatus: 200, // IE11 fix
  };
};

module.exports = buildCorsOptions;
