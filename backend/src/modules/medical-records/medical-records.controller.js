const { ok } = require("../../utils/response");
const { HttpError } = require("../../utils/http-error");
const service = require("./medical-records.service");

async function createMedicalRecord(req, res, next) {
  try {
    if (!req.body.petId) {
      throw new HttpError(400, "VALIDATION_ERROR", "petId is required.");
    }
    const result = await service.createMedicalRecord(req.user, req.body);
    return ok(res, result, 201);
  } catch (err) {
    return next(err);
  }
}

async function listPetMedicalRecords(req, res, next) {
  try {
    const items = await service.listPetMedicalRecords(req.user, req.params.petId);
    return ok(res, { items, total: items.length });
  } catch (err) {
    return next(err);
  }
}

async function getMedicalRecord(req, res, next) {
  try {
    const item = await service.getMedicalRecord(req.user, req.params.medicalRecordId);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

async function patchMedicalRecord(req, res, next) {
  try {
    const item = await service.updateMedicalRecord(req.user, req.params.medicalRecordId, req.body);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

async function postPrescription(req, res, next) {
  try {
    const required = ["medicationName", "dosage", "frequency"];
    for (const key of required) {
      if (!req.body[key]) {
        throw new HttpError(400, "VALIDATION_ERROR", `${key} is required.`);
      }
    }
    const item = await service.addPrescription(req.user, req.params.medicalRecordId, req.body);
    return ok(res, item, 201);
  } catch (err) {
    return next(err);
  }
}

async function getPrescriptions(req, res, next) {
  try {
    const items = await service.listPrescriptions(req.user, req.params.medicalRecordId);
    return ok(res, { items, total: items.length });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createMedicalRecord,
  listPetMedicalRecords,
  getMedicalRecord,
  patchMedicalRecord,
  postPrescription,
  getPrescriptions
};
