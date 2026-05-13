const bcrypt = require("bcryptjs");

/**
 * Demo owner — password: `password123`
 * (Register via API creates more accounts; this seed is for first-run login.)
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
