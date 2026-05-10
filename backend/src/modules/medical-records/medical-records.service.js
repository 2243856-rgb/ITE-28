const { v4: uuidv4 } = require("uuid");
const { medicalRecords, prescriptions, pets, appointments } = require("../../data/store");
const { HttpError } = require("../../utils/http-error");

function ensurePetExists(petId) {
  const pet = pets.find((item) => item.petId === petId && item.isActive);
  if (!pet) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }
  return pet;
}

function createMedicalRecord(requestUser, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can create medical records.");
  }

  const pet = ensurePetExists(payload.petId);
  if (payload.appointmentId) {
    const appointment = appointments.find((item) => item.appointmentId === payload.appointmentId);
    if (!appointment) {
      throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
    }
    if (appointment.petId !== pet.petId) {
      throw new HttpError(422, "PET_APPOINTMENT_MISMATCH", "Appointment does not belong to the pet.");
    }
  }

  const medicalRecord = {
    medicalRecordId: uuidv4(),
    petId: payload.petId,
    appointmentId: payload.appointmentId || null,
    veterinarianId: payload.veterinarianId || null,
    diagnosis: payload.diagnosis || null,
    treatmentPlan: payload.treatmentPlan || null,
    vaccinationDetails: payload.vaccinationDetails || null,
    labResultsUrl: payload.labResultsUrl || null,
    followUpDate: payload.followUpDate || null,
    recordDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  medicalRecords.push(medicalRecord);
  return medicalRecord;
}

function canAccessRecord(requestUser, petOwnerUserId) {
  if (requestUser.role === "OWNER") {
    return requestUser.sub === petOwnerUserId;
  }
  return ["VET", "CLINIC_STAFF", "ADMIN"].includes(requestUser.role);
}

function listPetMedicalRecords(requestUser, petId) {
  const pet = ensurePetExists(petId);
  if (!canAccessRecord(requestUser, pet.ownerUserId)) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this pet's medical records.");
  }
  return medicalRecords.filter((item) => item.petId === petId);
}

function getMedicalRecord(requestUser, medicalRecordId) {
  const record = medicalRecords.find((item) => item.medicalRecordId === medicalRecordId);
  if (!record) {
    throw new HttpError(404, "MEDICAL_RECORD_NOT_FOUND", "Medical record not found.");
  }
  const pet = ensurePetExists(record.petId);
  if (!canAccessRecord(requestUser, pet.ownerUserId)) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this medical record.");
  }
  return record;
}

function updateMedicalRecord(requestUser, medicalRecordId, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can update medical records.");
  }

  const index = medicalRecords.findIndex((item) => item.medicalRecordId === medicalRecordId);
  if (index < 0) {
    throw new HttpError(404, "MEDICAL_RECORD_NOT_FOUND", "Medical record not found.");
  }

  medicalRecords[index] = {
    ...medicalRecords[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };
  return medicalRecords[index];
}

function addPrescription(requestUser, medicalRecordId, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can create prescriptions.");
  }

  const record = medicalRecords.find((item) => item.medicalRecordId === medicalRecordId);
  if (!record) {
    throw new HttpError(404, "MEDICAL_RECORD_NOT_FOUND", "Medical record not found.");
  }

  const prescription = {
    prescriptionId: uuidv4(),
    medicalRecordId,
    medicationName: payload.medicationName,
    dosage: payload.dosage,
    frequency: payload.frequency,
    durationDays: payload.durationDays || null,
    instructions: payload.instructions || null,
    createdAt: new Date().toISOString()
  };

  prescriptions.push(prescription);
  return prescription;
}

function listPrescriptions(requestUser, medicalRecordId) {
  const record = getMedicalRecord(requestUser, medicalRecordId);
  const pet = ensurePetExists(record.petId);
  if (!canAccessRecord(requestUser, pet.ownerUserId)) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access prescriptions for this record.");
  }
  return prescriptions.filter((item) => item.medicalRecordId === medicalRecordId);
}

module.exports = {
  createMedicalRecord,
  listPetMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  addPrescription,
  listPrescriptions
};
