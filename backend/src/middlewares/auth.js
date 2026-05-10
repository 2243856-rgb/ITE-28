const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils/http-error");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "UNAUTHORIZED", "Missing bearer token."));
  }

  const token = authHeader.slice("Bearer ".length);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new HttpError(500, "SERVER_MISCONFIG", "JWT secret is not configured."));
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new HttpError(401, "INVALID_TOKEN", "Token is invalid or expired."));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, "UNAUTHORIZED", "Not authenticated."));
    }
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, "FORBIDDEN", "Insufficient permissions."));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
