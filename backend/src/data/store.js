const bcrypt = require("bcryptjs");

/**
 * Demo users (in-memory): owner + admin (see Login screen hints).
 */
const DEMO_OWNER_ID = "00000000-0000-4000-8000-000000000001";

const users = [
  {
    userId: DEMO_OWNER_ID,
    fullName: "Demo Pet Parent",
    email: "demo@nestvet.app",
    phoneNumber: null,
    role: "OWNER",
    passwordHash: bcrypt.hashSync("password123", 10),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: "00000000-0000-4000-8000-000000000002",
    fullName: "Clinic Admin",
    email: "admin@nestvet.app",
    phoneNumber: null,
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("admin123", 10),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const pets = [];
const appointments = [];
const homeVisits = [];
const medicalRecords = [];
const prescriptions = [];

module.exports = {
  users,
  pets,
  appointments,
  homeVisits,
  medicalRecords,
  prescriptions
};
