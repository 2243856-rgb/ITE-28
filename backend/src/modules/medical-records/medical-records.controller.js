const { ok } = require("../../utils/response");
const { HttpError } = require("../../utils/http-error");
const service = require("./medical-records.service");

function createMedicalRecord(req, res, next) {
  try {
    if (!req.body.petId) {
      throw new HttpError(400, "VALIDATION_ERROR", "petId is required.");
    }
    const result = service.createMedicalRecord(req.user, req.body);
    return ok(res, result, 201);
  } catch (err) {
    return next(err);
  }
}

function listPetMedicalRecords(req, res, next) {
  try {
    const items = service.listPetMedicalRecords(req.user, req.params.petId);
    return ok(res, { items, total: items.length });
  } catch (err) {
    return next(err);
  }
}

function getMedicalRecord(req, res, next) {
  try {
    const item = service.getMedicalRecord(req.user, req.params.medicalRecordId);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

function patchMedicalRecord(req, res, next) {
  try {
    const item = service.updateMedicalRecord(req.user, req.params.medicalRecordId, req.body);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

function postPrescription(req, res, next) {
  try {
    const required = ["medicationName", "dosage", "frequency"];
    for (const key of required) {
      if (!req.body[key]) {
        throw new HttpError(400, "VALIDATION_ERROR", `${key} is required.`);
      }
    }
    const item = service.addPrescription(req.user, req.params.medicalRecordId, req.body);
    return ok(res, item, 201);
  } catch (err) {
    return next(err);
  }
}

function getPrescriptions(req, res, next) {
  try {
    const items = service.listPrescriptions(req.user, req.params.medicalRecordId);
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
