const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sql = require("mssql");
const { getPool, isConfigured } = require("../../db/pool");
const { HttpError } = require("../../utils/http-error");

const OWNER_ROLE = "OWNER";

function mapUserRow(r) {
  if (!r) return null;
  return {
    userId: String(r.UserId),
    fullName: r.FullName,
    email: r.Email,
    phoneNumber: r.PhoneNumber,
    role: r.Role,
    passwordHash: r.PasswordHash,
    isActive: r.IsActive
  };
}

function requireDb() {
  if (!isConfigured()) {
    throw new HttpError(503, "DATABASE_UNAVAILABLE", "Azure SQL is not configured.");
  }
}

async function registerOwner(payload) {
  requireDb();
  const { fullName, email, phoneNumber, password } = payload;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const pool = await getPool();

  const dup = await pool
    .request()
    .input("email", sql.NVarChar(255), normalizedEmail)
    .query("SELECT UserId FROM dbo.Users WHERE Email = @email AND IsActive = 1");

  if (dup.recordset.length) {
    throw new HttpError(409, "EMAIL_EXISTS", "Email is already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  try {
    await pool
      .request()
      .input("userId", sql.UniqueIdentifier, userId)
      .input("fullName", sql.NVarChar(120), String(fullName).trim())
      .input("email", sql.NVarChar(255), normalizedEmail)
      .input("phoneNumber", sql.NVarChar(30), phoneNumber ? String(phoneNumber).trim() : null)
      .input("role", sql.NVarChar(20), OWNER_ROLE)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .query(`
        INSERT INTO dbo.Users (UserId, FullName, Email, PhoneNumber, Role, PasswordHash, IsActive)
        VALUES (@userId, @fullName, @email, @phoneNumber, @role, @passwordHash, 1)
      `);
  } catch (err) {
    if (err.number === 2627 || err.number === 2601) {
      throw new HttpError(409, "EMAIL_EXISTS", "Email is already registered.");
    }
    throw err;
  }

  return { userId, role: OWNER_ROLE };
}

async function login(payload) {
  requireDb();
  const { email, password } = payload;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const pool = await getPool();

  const result = await pool
    .request()
    .input("email", sql.NVarChar(255), normalizedEmail)
    .query(`
      SELECT UserId, FullName, Email, PhoneNumber, Role, PasswordHash, IsActive
      FROM dbo.Users
      WHERE Email = @email AND IsActive = 1
    `);

  const row = result.recordset[0];
  const user = mapUserRow(row);
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

async function getCurrentUser(userId) {
  requireDb();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("userId", sql.UniqueIdentifier, userId)
    .query(`
      SELECT UserId, FullName, Email, PhoneNumber, Role, IsActive
      FROM dbo.Users
      WHERE UserId = @userId AND IsActive = 1
    `);

  const row = result.recordset[0];
  if (!row) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found.");
  }

  return {
    userId: String(row.UserId),
    fullName: row.FullName,
    email: row.Email,
    phoneNumber: row.PhoneNumber,
    role: row.Role
  };
}

module.exports = { registerOwner, login, getCurrentUser };
