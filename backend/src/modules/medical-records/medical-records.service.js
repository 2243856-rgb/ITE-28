const { v4: uuidv4 } = require("uuid");
const sql = require("mssql");
const { getPool, isConfigured } = require("../../db/pool");
const { HttpError } = require("../../utils/http-error");

function requireDb() {
  if (!isConfigured()) {
    throw new HttpError(503, "DATABASE_UNAVAILABLE", "Azure SQL is not configured.");
  }
}

function mapMedicalRecordRow(r) {
  return {
    medicalRecordId: String(r.MedicalRecordId),
    petId: String(r.PetId),
    appointmentId: r.AppointmentId ? String(r.AppointmentId) : null,
    veterinarianId: r.VeterinarianId ? String(r.VeterinarianId) : null,
    diagnosis: r.Diagnosis,
    treatmentPlan: r.TreatmentPlan,
    vaccinationDetails: r.VaccinationDetails,
    labResultsUrl: r.LabResultsUrl,
    followUpDate: r.FollowUpDate ? new Date(r.FollowUpDate).toISOString().slice(0, 10) : null,
    recordDate: r.RecordDate ? new Date(r.RecordDate).toISOString() : null,
    createdAt: r.CreatedAt ? new Date(r.CreatedAt).toISOString() : null,
    updatedAt: r.UpdatedAt ? new Date(r.UpdatedAt).toISOString() : null
  };
}

function mapPrescriptionRow(r) {
  return {
    prescriptionId: String(r.PrescriptionId),
    medicalRecordId: String(r.MedicalRecordId),
    medicationName: r.MedicationName,
    dosage: r.Dosage,
    frequency: r.Frequency,
    durationDays: r.DurationDays != null ? Number(r.DurationDays) : null,
    instructions: r.Instructions,
    createdAt: r.CreatedAt ? new Date(r.CreatedAt).toISOString() : null
  };
}

async function ensurePetExists(petId) {
  requireDb();
  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("petId", sql.UniqueIdentifier, petId)
    .query(`SELECT PetId, OwnerUserId FROM dbo.Pets WHERE PetId = @petId AND IsActive = 1`);

  const pet = recordset[0];
  if (!pet) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }
  return { petId: String(pet.PetId), ownerUserId: String(pet.OwnerUserId) };
}

async function createMedicalRecord(requestUser, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can create medical records.");
  }

  const pet = await ensurePetExists(payload.petId);
  if (payload.appointmentId) {
    const pool = await getPool();
    const { recordset } = await pool
      .request()
      .input("appointmentId", sql.UniqueIdentifier, payload.appointmentId)
      .query(`SELECT PetId FROM dbo.Appointments WHERE AppointmentId = @appointmentId`);

    const ap = recordset[0];
    if (!ap) {
      throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
    }
    if (String(ap.PetId) !== pet.petId) {
      throw new HttpError(422, "PET_APPOINTMENT_MISMATCH", "Appointment does not belong to the pet.");
    }
  }

  if (payload.veterinarianId) {
    const pool = await getPool();
    const { recordset } = await pool
      .request()
      .input("vid", sql.UniqueIdentifier, payload.veterinarianId)
      .query(`SELECT 1 FROM dbo.Veterinarians WHERE VeterinarianId = @vid AND IsActive = 1`);
    if (!recordset.length) {
      throw new HttpError(422, "VET_NOT_FOUND", "Veterinarian does not exist or is inactive.");
    }
  }

  const medicalRecordId = uuidv4();
  const pool = await getPool();
  await pool
    .request()
    .input("medicalRecordId", sql.UniqueIdentifier, medicalRecordId)
    .input("petId", sql.UniqueIdentifier, payload.petId)
    .input("appointmentId", sql.UniqueIdentifier, payload.appointmentId || null)
    .input("veterinarianId", sql.UniqueIdentifier, payload.veterinarianId || null)
    .input("diagnosis", sql.NVarChar(1500), payload.diagnosis || null)
    .input("treatmentPlan", sql.NVarChar(2000), payload.treatmentPlan || null)
    .input("vaccinationDetails", sql.NVarChar(2000), payload.vaccinationDetails || null)
    .input("labResultsUrl", sql.NVarChar(500), payload.labResultsUrl || null)
    .input("followUpDate", sql.Date, payload.followUpDate ? new Date(payload.followUpDate) : null)
    .query(`
      INSERT INTO dbo.MedicalRecords (
        MedicalRecordId, PetId, AppointmentId, VeterinarianId, Diagnosis, TreatmentPlan,
        VaccinationDetails, LabResultsUrl, FollowUpDate, RecordDate
      )
      VALUES (
        @medicalRecordId, @petId, @appointmentId, @veterinarianId, @diagnosis, @treatmentPlan,
        @vaccinationDetails, @labResultsUrl, @followUpDate, SYSUTCDATETIME()
      )
    `);

  const out = await pool
    .request()
    .input("medicalRecordId", sql.UniqueIdentifier, medicalRecordId)
    .query(`
      SELECT MedicalRecordId, PetId, AppointmentId, VeterinarianId, Diagnosis, TreatmentPlan,
             VaccinationDetails, LabResultsUrl, FollowUpDate, RecordDate, CreatedAt, UpdatedAt
      FROM dbo.MedicalRecords WHERE MedicalRecordId = @medicalRecordId
    `);

  return mapMedicalRecordRow(out.recordset[0]);
}

function canAccessRecord(requestUser, petOwnerUserId) {
  if (requestUser.role === "OWNER") {
    return requestUser.sub === petOwnerUserId;
  }
  return ["VET", "CLINIC_STAFF", "ADMIN"].includes(requestUser.role);
}

async function listPetMedicalRecords(requestUser, petId) {
  const pet = await ensurePetExists(petId);
  if (!canAccessRecord(requestUser, pet.ownerUserId)) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this pet's medical records.");
  }

  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("petId", sql.UniqueIdentifier, petId)
    .query(`
      SELECT MedicalRecordId, PetId, AppointmentId, VeterinarianId, Diagnosis, TreatmentPlan,
             VaccinationDetails, LabResultsUrl, FollowUpDate, RecordDate, CreatedAt, UpdatedAt
      FROM dbo.MedicalRecords
      WHERE PetId = @petId
      ORDER BY RecordDate DESC
    `);

  return recordset.map(mapMedicalRecordRow);
}

async function getMedicalRecord(requestUser, medicalRecordId) {
  requireDb();
  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("medicalRecordId", sql.UniqueIdentifier, medicalRecordId)
    .query(`
      SELECT MedicalRecordId, PetId, AppointmentId, VeterinarianId, Diagnosis, TreatmentPlan,
             VaccinationDetails, LabResultsUrl, FollowUpDate, RecordDate, CreatedAt, UpdatedAt
      FROM dbo.MedicalRecords
      WHERE MedicalRecordId = @medicalRecordId
    `);

  const row = recordset[0];
  if (!row) {
    throw new HttpError(404, "MEDICAL_RECORD_NOT_FOUND", "Medical record not found.");
  }

  const pet = await ensurePetExists(String(row.PetId));
  if (!canAccessRecord(requestUser, pet.ownerUserId)) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this medical record.");
  }

  return mapMedicalRecordRow(row);
}

async function updateMedicalRecord(requestUser, medicalRecordId, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can update medical records.");
  }

  await getMedicalRecord(requestUser, medicalRecordId);
  const pool = await getPool();
  const rq = pool.request().input("medicalRecordId", sql.UniqueIdentifier, medicalRecordId);
  const sets = [];

  if (payload.diagnosis !== undefined) {
    sets.push("Diagnosis = @diagnosis");
    rq.input("diagnosis", sql.NVarChar(1500), payload.diagnosis || null);
  }
  if (payload.treatmentPlan !== undefined) {
    sets.push("TreatmentPlan = @treatmentPlan");
    rq.input("treatmentPlan", sql.NVarChar(2000), payload.treatmentPlan || null);
  }
  if (payload.vaccinationDetails !== undefined) {
    sets.push("VaccinationDetails = @vaccinationDetails");
    rq.input("vaccinationDetails", sql.NVarChar(2000), payload.vaccinationDetails || null);
  }
  if (payload.labResultsUrl !== undefined) {
    sets.push("LabResultsUrl = @labResultsUrl");
    rq.input("labResultsUrl", sql.NVarChar(500), payload.labResultsUrl || null);
  }
  if (payload.followUpDate !== undefined) {
    sets.push("FollowUpDate = @followUpDate");
    rq.input("followUpDate", sql.Date, payload.followUpDate ? new Date(payload.followUpDate) : null);
  }
  if (payload.veterinarianId !== undefined) {
    if (payload.veterinarianId) {
      const { recordset } = await pool
        .request()
        .input("vid", sql.UniqueIdentifier, payload.veterinarianId)
        .query(`SELECT 1 FROM dbo.Veterinarians WHERE VeterinarianId = @vid AND IsActive = 1`);
      if (!recordset.length) {
        throw new HttpError(422, "VET_NOT_FOUND", "Veterinarian does not exist or is inactive.");
      }
    }
    sets.push("VeterinarianId = @veterinarianId");
    rq.input("veterinarianId", sql.UniqueIdentifier, payload.veterinarianId || null);
  }

  if (sets.length === 0) {
    return getMedicalRecord(requestUser, medicalRecordId);
  }

  sets.push("UpdatedAt = SYSUTCDATETIME()");
  await rq.query(`UPDATE dbo.MedicalRecords SET ${sets.join(", ")} WHERE MedicalRecordId = @medicalRecordId`);
  return getMedicalRecord(requestUser, medicalRecordId);
}

async function addPrescription(requestUser, medicalRecordId, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can create prescriptions.");
  }

  await getMedicalRecord(requestUser, medicalRecordId);
  const prescriptionId = uuidv4();
  const pool = await getPool();
  await pool
    .request()
    .input("prescriptionId", sql.UniqueIdentifier, prescriptionId)
    .input("medicalRecordId", sql.UniqueIdentifier, medicalRecordId)
    .input("medicationName", sql.NVarChar(150), payload.medicationName)
    .input("dosage", sql.NVarChar(120), payload.dosage)
    .input("frequency", sql.NVarChar(120), payload.frequency)
    .input("durationDays", sql.Int, payload.durationDays != null ? Number(payload.durationDays) : null)
    .input("instructions", sql.NVarChar(1000), payload.instructions || null)
    .query(`
      INSERT INTO dbo.Prescriptions (
        PrescriptionId, MedicalRecordId, MedicationName, Dosage, Frequency, DurationDays, Instructions
      )
      VALUES (
        @prescriptionId, @medicalRecordId, @medicationName, @dosage, @frequency, @durationDays, @instructions
      )
    `);

  const out = await pool
    .request()
    .input("prescriptionId", sql.UniqueIdentifier, prescriptionId)
    .query(`
      SELECT PrescriptionId, MedicalRecordId, MedicationName, Dosage, Frequency, DurationDays, Instructions, CreatedAt
      FROM dbo.Prescriptions WHERE PrescriptionId = @prescriptionId
    `);

  return mapPrescriptionRow(out.recordset[0]);
}

async function listPrescriptions(requestUser, medicalRecordId) {
  await getMedicalRecord(requestUser, medicalRecordId);
  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("medicalRecordId", sql.UniqueIdentifier, medicalRecordId)
    .query(`
      SELECT PrescriptionId, MedicalRecordId, MedicationName, Dosage, Frequency, DurationDays, Instructions, CreatedAt
      FROM dbo.Prescriptions
      WHERE MedicalRecordId = @medicalRecordId
      ORDER BY CreatedAt ASC
    `);

  return recordset.map(mapPrescriptionRow);
}

module.exports = {
  createMedicalRecord,
  listPetMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  addPrescription,
  listPrescriptions
};
