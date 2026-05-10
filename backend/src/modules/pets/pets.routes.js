const express = require("express");
const controller = require("./pets.controller");
const { requireAuth, requireRole } = require("../../middlewares/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/", requireRole("OWNER"), controller.createPet);
router.get("/", controller.listPets);
router.get("/:petId", controller.getPet);
router.patch("/:petId", controller.updatePet);
router.delete("/:petId", controller.deletePet);

module.exports = router;
