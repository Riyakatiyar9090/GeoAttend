/**
 * Helmet configuration.
 *
 * Helmet sets security-related HTTP response headers.
 * Each directive is documented with why it is set.
 */
const buildHelmetConfig = () => ({
  // Content-Security-Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests:
        process.env.NODE_ENV === "production" ? [] : null,
    },
  },

  // Strict-Transport-Security — force HTTPS for 1 year
  hsts: {
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },

  // X-Frame-Options: DENY — prevent clickjacking
  frameguard: { action: "deny" },

  // X-Content-Type-Options: nosniff — prevent MIME sniffing
  noSniff: true,

  // X-XSS-Protection — enable browser XSS filter (legacy browsers)
  xssFilter: true,

  // Referrer-Policy — don't leak URL to third parties
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },

  // Permissions-Policy — disable unneeded browser features
  permittedCrossDomainPolicies: { permittedPolicies: "none" },

  // Hide X-Powered-By: Express
  hidePoweredBy: true,

  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

module.exports = buildHelmetConfig;
