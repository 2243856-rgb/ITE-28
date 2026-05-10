const { fail } = require("../utils/response");

function notFound(req, res) {
  return fail(res, 404, "NOT_FOUND", "Resource not found.");
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Unexpected server error.";
  return fail(res, statusCode, code, message);
}

module.exports = { notFound, errorHandler };
