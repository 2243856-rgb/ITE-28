const express = require("express");
const { requireAuth } = require("../../middlewares/auth");
const controller = require("./medical-records.controller");

const router = express.Router();

router.use(requireAuth);
router.post("/", controller.createMedicalRecord);
router.get("/pets/:petId", controller.listPetMedicalRecords);
router.get("/:medicalRecordId", controller.getMedicalRecord);
router.patch("/:medicalRecordId", controller.patchMedicalRecord);
router.post("/:medicalRecordId/prescriptions", controller.postPrescription);
router.get("/:medicalRecordId/prescriptions", controller.getPrescriptions);

module.exports = router;
