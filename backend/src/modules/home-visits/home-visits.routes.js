const express = require("express");
const { requireAuth } = require("../../middlewares/auth");
const controller = require("./home-visits.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/:appointmentId", controller.getHomeVisit);
router.patch("/:appointmentId/status", controller.patchHomeVisitStatus);
router.patch("/:appointmentId/tracking", controller.patchHomeVisitTracking);

module.exports = router;
