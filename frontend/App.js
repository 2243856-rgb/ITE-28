const medicalRecordsRoutes = require("./src/modules/medical-records/medical-records.routes");
const { ok } = require("./src/utils/response");
const { notFound, errorHandler } = require("./src/middlewares/error-handler");

const app = express();

// Middleware
app.use(helmet());
app.use(cors()); 
app.use(express.json());
app.use(morgan("dev"));

// --- ROUTES START HERE ---

// 1. Health Check (Azure uses this to see if the app is alive)
app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok", service: "nestvet-backend" });
});

// 2. Base API Info
app.get("/api", (req, res) => {
  return ok(res, { message: "Veterinary booking API is running." });
});

// 3. Feature Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pets", petsRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);
app.use("/api/v1/home-visits", homeVisitsRoutes);
app.use("/api/v1/medical-records", medicalRecordsRoutes);

// --- ERROR HANDLERS (Must be at the very bottom) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
