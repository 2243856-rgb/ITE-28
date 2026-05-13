const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./modules/auth/auth.routes");
const petsRoutes = require("./modules/pets/pets.routes");
const appointmentsRoutes = require("./modules/appointments/appointments.routes");
const homeVisitsRoutes = require("./modules/home-visits/home-visits.routes");
const medicalRecordsRoutes = require("./modules/medical-records/medical-records.routes");
const { ok } = require("./utils/response");
const { notFound, errorHandler } = require("./middlewares/error-handler");
const { ping: pingDb, isConfigured: isSqlConfigured } = require("./db/pool");

const app = express();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: corsOrigins && corsOrigins.length ? corsOrigins : true,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    service: "vet-booking-backend",
    endpoints: {
      health: "GET /health",
      api: "GET /api",
    authV1: "POST /api/v1/auth/login",
    authCompat: "POST /auth/login, POST /api/auth/login (same handlers)"
    }
  });
});

app.get("/api/v1", (req, res) => {
  return ok(res, {
    message: "Veterinary booking API v1.",
    auth: ["/api/v1/auth/login", "/api/v1/auth/register-owner", "/api/v1/auth/register (alias)"],
    compat: ["/auth/login", "/api/auth/login", "/auth/register-owner", "/auth/register (alias)"]
  });
});

app.get("/health", async (req, res) => {
  const base = {
    service: "vet-booking-backend",
    status: "ok"
  };
  if (!isSqlConfigured()) {
    return res.status(200).json({ ...base, database: { configured: false } });
  }
  try {
    const db = await pingDb();
    return res.status(200).json({ ...base, database: db });
  } catch (err) {
    const detail = [
      err?.message,
      err?.originalError?.message,
      err?.cause?.message,
      err?.code ? `code=${err.code}` : null,
      err?.number ? `errno=${err.number}` : null
    ]
      .filter(Boolean)
      .join(" | ") || err?.name || String(err);
    console.error("Database health check failed:", detail, err);
    const payload = {
      ...base,
      status: "degraded",
      database: { configured: true, ok: false, error: "connection_failed" }
    };
    if (process.env.NODE_ENV !== "production") {
      payload.database.detail = detail || "unknown_error";
    }
    return res.status(503).json(payload);
  }
});

app.get("/api", (req, res) => {
  return ok(res, { message: "Veterinary booking API is running." });
});

app.use("/api/v1/auth", authRoutes);
/* Same routes without /api/v1 prefix (Azure Static Web Apps / older clients) */
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/v1/pets", petsRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);
app.use("/api/v1/home-visits", homeVisitsRoutes);
app.use("/api/v1/medical-records", medicalRecordsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
