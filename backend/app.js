const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

const authRoutes = require('./src/modules/auth/auth.routes');
const petsRoutes = require("./src/modules/pets/pets.routes");
const appointmentsRoutes = require('./src/modules/appointments/appointments.routes');
const homeVisitsRoutes = require("./src/modules/home-visits/home-visits.routes");
const medicalRecordsRoutes = require("./src/modules/medical-records/medical-records.routes");
const { ok } = require("./src/utils/response");
const { notFound, errorHandler } = require("./src/middlewares/error-handler");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors()); 
app.use(express.json());
app.use(morgan("dev"));

// --- ADD THESE TWO ROUTES HERE ---

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok", service: "nestvet-backend" });
});

app.get("/api", (req, res) => {
  return ok(res, { message: "Veterinary booking API is running." });
});

// --------------------------------

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pets", petsRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);
app.use("/api/v1/home-visits", homeVisitsRoutes);
app.use("/api/v1/medical-records", medicalRecordsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
