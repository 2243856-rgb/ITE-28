const { v4: uuidv4 } = require("uuid");
const { pets } = require("../../data/store");
const { HttpError } = require("../../utils/http-error");

function createPet(ownerUserId, payload) {
  const pet = {
    petId: uuidv4(),
    ownerUserId,
    petName: String(payload.petName).trim(),
    species: String(payload.species).trim(),
    breed: payload.breed ? String(payload.breed).trim() : null,
    sex: payload.sex || "UNKNOWN",
    dateOfBirth: payload.dateOfBirth || null,
    weightKg: payload.weightKg || null,
    allergies: payload.allergies || null,
    chronicConditions: payload.chronicConditions || null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  pets.push(pet);
  return pet;
}

function listPets(requestUser, ownerUserIdQuery) {
  if (requestUser.role === "OWNER") {
    return pets.filter((pet) => pet.ownerUserId === requestUser.sub && pet.isActive);
  }

  if (ownerUserIdQuery) {
    return pets.filter((pet) => pet.ownerUserId === ownerUserIdQuery && pet.isActive);
  }

  return pets.filter((pet) => pet.isActive);
}

function getPetById(requestUser, petId) {
  const pet = pets.find((item) => item.petId === petId && item.isActive);
  if (!pet) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }

  if (requestUser.role === "OWNER" && pet.ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this pet profile.");
  }

  return pet;
}

function updatePet(requestUser, petId, payload) {
  const index = pets.findIndex((item) => item.petId === petId && item.isActive);
  if (index < 0) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }

  const target = pets[index];
  if (requestUser.role === "OWNER" && target.ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot edit this pet profile.");
  }

  pets[index] = {
    ...target,
    ...payload,
    updatedAt: new Date().toISOString()
  };
  return pets[index];
}

function removePet(requestUser, petId) {
  const index = pets.findIndex((item) => item.petId === petId && item.isActive);
  if (index < 0) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }

  if (requestUser.role === "OWNER" && pets[index].ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot delete this pet profile.");
  }

  pets[index].isActive = false;
  pets[index].updatedAt = new Date().toISOString();
}

module.exports = { createPet, listPets, getPetById, updatePet, removePet };
