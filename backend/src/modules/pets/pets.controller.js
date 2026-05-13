const { ok } = require("../../utils/response");
const { HttpError } = require("../../utils/http-error");
const petsService = require("./pets.service");

function validateCreate(body) {
  if (!body.petName || !body.species) {
    throw new HttpError(400, "VALIDATION_ERROR", "petName and species are required.");
  }
}

async function createPet(req, res, next) {
  try {
    validateCreate(req.body);
    const pet = await petsService.createPet(req.user.sub, req.body);
    return ok(res, pet, 201);
  } catch (err) {
    return next(err);
  }
}

async function listPets(req, res, next) {
  try {
    const pets = await petsService.listPets(req.user, req.query.ownerUserId);
    return ok(res, { items: pets, total: pets.length });
  } catch (err) {
    return next(err);
  }
}

async function getPet(req, res, next) {
  try {
    const pet = await petsService.getPetById(req.user, req.params.petId);
    return ok(res, pet);
  } catch (err) {
    return next(err);
  }
}

async function updatePet(req, res, next) {
  try {
    const pet = await petsService.updatePet(req.user, req.params.petId, req.body);
    return ok(res, pet);
  } catch (err) {
    return next(err);
  }
}

async function deletePet(req, res, next) {
  try {
    await petsService.removePet(req.user, req.params.petId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { createPet, listPets, getPet, updatePet, deletePet };
