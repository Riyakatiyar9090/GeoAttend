/**
 * Standardised API response helper.
 * Ensures every endpoint returns a consistent JSON envelope.
 *
 * Success shape:
 *   { success: true, message, data, meta? }
 *
 * Error shape is handled by globalErrorHandler in errorMiddleware.js
 */
const sendResponse = (
  res,
  { statusCode = 200, message = "OK", data = null, meta = null } = {},
) => {
  const body = {
    success: true,
    message,
  };

  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;

  return res.status(statusCode).json(body);
};

module.exports = sendResponse;
