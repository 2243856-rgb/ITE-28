const express = require("express");
const controller = require("./auth.controller");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.post("/register-owner", controller.registerOwner);
router.post("/login", controller.login);
router.get("/me", requireAuth, controller.me);

module.exports = router;
