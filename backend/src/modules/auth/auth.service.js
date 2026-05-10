const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { users } = require("../../data/store");
const { HttpError } = require("../../utils/http-error");

const OWNER_ROLE = "OWNER";

async function registerOwner(payload) {
  const { fullName, email, phoneNumber, password } = payload;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const existing = users.find((user) => user.email === normalizedEmail);
  if (existing) {
    throw new HttpError(409, "EMAIL_EXISTS", "Email is already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    userId: uuidv4(),
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    phoneNumber: phoneNumber ? String(phoneNumber).trim() : null,
    role: OWNER_ROLE,
    passwordHash,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(user);
  return { userId: user.userId, role: user.role };
}

async function login(payload) {
  const { email, password } = payload;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail && item.isActive);
  if (!user) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HttpError(500, "SERVER_MISCONFIG", "JWT secret is not configured.");
  }

  const accessToken = jwt.sign(
    {
      sub: user.userId,
      role: user.role,
      email: user.email
    },
    secret,
    { expiresIn: "1h" }
  );

  return {
    accessToken,
    refreshToken: "mvp-refresh-token-placeholder",
    expiresIn: 3600
  };
}

function getCurrentUser(userId) {
  const user = users.find((item) => item.userId === userId && item.isActive);
  if (!user) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found.");
  }

  return {
    userId: user.userId,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role
  };
}

module.exports = { registerOwner, login, getCurrentUser };
