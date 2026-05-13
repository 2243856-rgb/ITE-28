const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./src/modules/auth/auth.routes");
const petsRoutes = require("./src/modules/pets/pets.routes");
const appointmentsRoutes = require("./src/modules/appointments/appointments.routes");
const homeVisitsRoutes = require("./src/modules/home-visits/home-visits.routes");
const medicalRecordsRoutes = require("./src/modules/medical-records/medical-records.routes");
const { ok } = require("./src/utils/response");
const { notFound, errorHandler } = require("./src/middlewares/error-handler");
const { getPool } = require("./src/db/pool");

const app = express();

app.use(
  helmet({
    // Allow browsers on Azure Static Web Apps to read JSON from this API (different origin).
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// Bearer tokens only (no cookies). credentials:false avoids CORS edge cases with SWA (*.azurestaticapps.net).
app.use(
  cors({
    origin: true,
    credentials: false,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    service: "vet-booking-backend",
    message:
      "API is running. This URL is the backend only; open your Static Web App URL for the web UI.",
    links: {
      health: "/health",
      api: "/api"
    }
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    service: "vet-booking-backend",
    status: "ok"
  });
});

/** Same as /health but under the API prefix (matches EXPO_PUBLIC_API_URL base in the browser). */
app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    service: "vet-booking-backend",
    status: "ok"
  });
});

/** Proves SQL_CONNECTION_STRING works; APIs still use in-memory store until you add queries. */
app.get("/api/v1/health/sql", async (req, res) => {
  try {
    const pool = await getPool();
    if (!pool) {
      return ok(res, {
        connected: false,
        mode: "in-memory",
        hint: "Set SQL_CONNECTION_STRING to use Azure SQL."
      });
    }
    const result = await pool.request().query("SELECT 1 AS ok");
    return ok(res, { connected: true, sample: result.recordset[0] });
  } catch (err) {
    return res.status(503).json({
      data: null,
      error: {
        code: "SQL_CONNECTION_FAILED",
        message: err.message || "Could not reach Azure SQL."
      }
    });
  }
});

app.get("/api", (req, res) => {
  return ok(res, { message: "Veterinary booking API is running." });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pets", petsRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);
app.use("/api/v1/home-visits", homeVisitsRoutes);
app.use("/api/v1/medical-records", medicalRecordsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
