const express = require("express");
const cors = require("cors");
const app = express();

// These lines ONLY belong in the BACKEND app.js
const authRoutes = require('./src/modules/auth/auth.routes');
const medicalRecordsRoutes = require("./src/modules/medical-records/medical-records.routes");

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/medical-records", medicalRecordsRoutes);

module.exports = app;
