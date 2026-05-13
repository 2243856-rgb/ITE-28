const express = require("express");
const controller = require("./auth.controller");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.post("/register-owner", controller.registerOwner);
/* Alias for web clients that POST /auth/register */
router.post("/register", controller.registerOwner);
router.post("/login", controller.login);
router.get("/me", requireAuth, controller.me);

module.exports = router;
