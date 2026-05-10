const express = require("express");
const { requireAuth } = require("../../middlewares/auth");
const controller = require("./appointments.controller");

const router = express.Router();

router.use(requireAuth);
router.post("/", controller.createAppointment);
router.get("/", controller.listAppointments);
router.get("/:appointmentId", controller.getAppointment);
router.patch("/:appointmentId", controller.patchAppointment);
router.patch("/:appointmentId/status", controller.patchAppointmentStatus);
router.delete("/:appointmentId", controller.deleteAppointment);

module.exports = router;
