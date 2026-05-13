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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

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
    const detail =
      err?.message ||
      err?.originalError?.message ||
      (err?.stack ? String(err.stack).split("\n")[0] : null) ||
      String(err);
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
app.use("/api/v1/pets", petsRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);
app.use("/api/v1/home-visits", homeVisitsRoutes);
app.use("/api/v1/medical-records", medicalRecordsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
