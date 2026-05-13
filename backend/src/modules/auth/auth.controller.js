const { ok } = require("../../utils/response");
const { HttpError } = require("../../utils/http-error");
const authService = require("./auth.service");

function validateRegister(body) {
  if (!body.fullName || !body.email || !body.password) {
    throw new HttpError(400, "VALIDATION_ERROR", "fullName, email, and password are required.");
  }
  if (String(body.password).length < 8) {
    throw new HttpError(400, "VALIDATION_ERROR", "Password must be at least 8 characters.");
  }
}

function validateLogin(body) {
  if (!body.email || !body.password) {
    throw new HttpError(400, "VALIDATION_ERROR", "email and password are required.");
  }
}

async function registerOwner(req, res, next) {
  try {
    validateRegister(req.body);
    const result = await authService.registerOwner(req.body);
    return ok(res, result, 201);
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    validateLogin(req.body);
    const result = await authService.login(req.body);
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const result = await authService.getCurrentUser(req.user.sub);
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { registerOwner, login, me };
