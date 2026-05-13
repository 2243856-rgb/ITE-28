const { v4: uuidv4 } = require("uuid");
const sql = require("mssql");
const { getPool, isConfigured } = require("../../db/pool");
const { HttpError } = require("../../utils/http-error");

function requireDb() {
  if (!isConfigured()) {
    throw new HttpError(503, "DATABASE_UNAVAILABLE", "Azure SQL is not configured.");
  }
}

function mapAppointmentRow(r) {
  return {
    appointmentId: String(r.AppointmentId),
    petId: String(r.PetId),
    ownerUserId: String(r.OwnerUserId),
    clinicId: String(r.ClinicId),
    veterinarianId: r.VeterinarianId ? String(r.VeterinarianId) : null,
    appointmentType: r.AppointmentType,
    status: r.Status,
    scheduledStart: new Date(r.ScheduledStart).toISOString(),
    scheduledEnd: new Date(r.ScheduledEnd).toISOString(),
    reason: r.Reason,
    notes: r.Notes,
    createdAt: r.CreatedAt ? new Date(r.CreatedAt).toISOString() : null,
    updatedAt: r.UpdatedAt ? new Date(r.UpdatedAt).toISOString() : null,
    isActive: Boolean(r.IsActive)
  };
}

async function validatePetAccess(requestUser, petId) {
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

  if (requestUser.role === "OWNER" && String(pet.OwnerUserId) !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You can only book for your own pets.");
  }

  return { petId: String(pet.PetId), ownerUserId: String(pet.OwnerUserId) };
}

async function assertClinic(pool, clinicId) {
  const { recordset } = await pool
    .request()
    .input("clinicId", sql.UniqueIdentifier, clinicId)
    .query(`SELECT 1 FROM dbo.Clinics WHERE ClinicId = @clinicId AND IsActive = 1`);
  if (!recordset.length) {
    throw new HttpError(422, "CLINIC_NOT_FOUND", "Clinic does not exist or is inactive.");
  }
}

async function assertVeterinarian(pool, veterinarianId) {
  const { recordset } = await pool
    .request()
    .input("vid", sql.UniqueIdentifier, veterinarianId)
    .query(`SELECT 1 FROM dbo.Veterinarians WHERE VeterinarianId = @vid AND IsActive = 1`);
  if (!recordset.length) {
    throw new HttpError(422, "VET_NOT_FOUND", "Veterinarian does not exist or is inactive.");
  }
}

async function createAppointment(requestUser, payload) {
  requireDb();
  const pet = await validatePetAccess(requestUser, payload.petId);
  const pool = await getPool();
  await assertClinic(pool, payload.clinicId);
  if (payload.veterinarianId) {
    await assertVeterinarian(pool, payload.veterinarianId);
  }

  const appointmentId = uuidv4();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();
  try {
    const r1 = new sql.Request(transaction)
      .input("appointmentId", sql.UniqueIdentifier, appointmentId)
      .input("petId", sql.UniqueIdentifier, pet.petId)
      .input("ownerUserId", sql.UniqueIdentifier, pet.ownerUserId)
      .input("clinicId", sql.UniqueIdentifier, payload.clinicId)
      .input("veterinarianId", sql.UniqueIdentifier, payload.veterinarianId || null)
      .input("appointmentType", sql.NVarChar(20), payload.appointmentType)
      .input("scheduledStart", sql.DateTime2, new Date(payload.scheduledStart))
      .input("scheduledEnd", sql.DateTime2, new Date(payload.scheduledEnd))
      .input("reason", sql.NVarChar(1000), payload.reason || null)
      .input("notes", sql.NVarChar(2000), payload.notes || null);

    await r1.query(`
      INSERT INTO dbo.Appointments (
        AppointmentId, PetId, OwnerUserId, ClinicId, VeterinarianId, AppointmentType,
        Status, ScheduledStart, ScheduledEnd, Reason, Notes, IsActive
      )
      VALUES (
        @appointmentId, @petId, @ownerUserId, @clinicId, @veterinarianId, @appointmentType,
        'PENDING', @scheduledStart, @scheduledEnd, @reason, @notes, 1
      )
    `);

    if (payload.appointmentType === "HOME_VISIT") {
      const hv = payload.homeVisit || {};
      const homeVisitId = uuidv4();
      const r2 = new sql.Request(transaction)
        .input("homeVisitId", sql.UniqueIdentifier, homeVisitId)
        .input("appointmentId", sql.UniqueIdentifier, appointmentId)
        .input("serviceAddress", sql.NVarChar(255), hv.serviceAddress)
        .input("city", sql.NVarChar(100), hv.city)
        .input("stateProvince", sql.NVarChar(100), hv.stateProvince || null)
        .input("postalCode", sql.NVarChar(20), hv.postalCode || null)
        .input("latitude", sql.Decimal(9, 6), hv.latitude != null ? Number(hv.latitude) : null)
        .input("longitude", sql.Decimal(9, 6), hv.longitude != null ? Number(hv.longitude) : null);

      await r2.query(`
        INSERT INTO dbo.HomeVisits (
          HomeVisitId, AppointmentId, ServiceAddress, City, StateProvince, PostalCode,
          Latitude, Longitude, TravelDistanceKm, TravelFee, VisitStatus,
          ArrivalTime, CompletionTime, EtaMinutes, LastTrackedLatitude, LastTrackedLongitude
        )
        VALUES (
          @homeVisitId, @appointmentId, @serviceAddress, @city, @stateProvince, @postalCode,
          @latitude, @longitude, NULL, NULL, 'SCHEDULED',
          NULL, NULL, NULL, NULL, NULL
        )
      `);
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    if (err.number === 547) {
      throw new HttpError(422, "FK_VIOLATION", "Invalid reference (pet, clinic, or veterinarian).");
    }
    throw err;
  }

  return getAppointment(requestUser, appointmentId);
}

async function listAppointments(requestUser) {
  requireDb();
  const pool = await getPool();
  const rq = pool.request();

  if (requestUser.role === "OWNER") {
    rq.input("sub", sql.UniqueIdentifier, requestUser.sub);
    const { recordset } = await rq.query(`
      SELECT AppointmentId, PetId, OwnerUserId, ClinicId, VeterinarianId, AppointmentType,
             Status, ScheduledStart, ScheduledEnd, Reason, Notes, CreatedAt, UpdatedAt, IsActive
      FROM dbo.Appointments
      WHERE OwnerUserId = @sub AND IsActive = 1
      ORDER BY ScheduledStart DESC
    `);
    return recordset.map(mapAppointmentRow);
  }

  const { recordset } = await pool.request().query(`
    SELECT AppointmentId, PetId, OwnerUserId, ClinicId, VeterinarianId, AppointmentType,
           Status, ScheduledStart, ScheduledEnd, Reason, Notes, CreatedAt, UpdatedAt, IsActive
    FROM dbo.Appointments
    WHERE IsActive = 1
    ORDER BY ScheduledStart DESC
  `);
  return recordset.map(mapAppointmentRow);
}

async function getAppointment(requestUser, appointmentId) {
  requireDb();
  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("appointmentId", sql.UniqueIdentifier, appointmentId)
    .query(`
      SELECT AppointmentId, PetId, OwnerUserId, ClinicId, VeterinarianId, AppointmentType,
             Status, ScheduledStart, ScheduledEnd, Reason, Notes, CreatedAt, UpdatedAt, IsActive
      FROM dbo.Appointments
      WHERE AppointmentId = @appointmentId AND IsActive = 1
    `);

  const row = recordset[0];
  if (!row) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }
  if (requestUser.role === "OWNER" && String(row.OwnerUserId) !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this appointment.");
  }
  return mapAppointmentRow(row);
}

async function updateAppointment(requestUser, appointmentId, payload) {
  await getAppointment(requestUser, appointmentId);
  const pool = await getPool();
  const rq = pool.request().input("appointmentId", sql.UniqueIdentifier, appointmentId);
  const sets = [];

  if (payload.clinicId != null) {
    await assertClinic(pool, payload.clinicId);
    sets.push("ClinicId = @clinicId");
    rq.input("clinicId", sql.UniqueIdentifier, payload.clinicId);
  }
  if (payload.veterinarianId !== undefined) {
    if (payload.veterinarianId) {
      await assertVeterinarian(pool, payload.veterinarianId);
    }
    sets.push("VeterinarianId = @veterinarianId");
    rq.input("veterinarianId", sql.UniqueIdentifier, payload.veterinarianId || null);
  }
  if (payload.appointmentType != null) {
    sets.push("AppointmentType = @appointmentType");
    rq.input("appointmentType", sql.NVarChar(20), payload.appointmentType);
  }
  if (payload.status != null) {
    sets.push("Status = @status");
    rq.input("status", sql.NVarChar(20), payload.status);
  }
  if (payload.scheduledStart != null) {
    sets.push("ScheduledStart = @scheduledStart");
    rq.input("scheduledStart", sql.DateTime2, new Date(payload.scheduledStart));
  }
  if (payload.scheduledEnd != null) {
    sets.push("ScheduledEnd = @scheduledEnd");
    rq.input("scheduledEnd", sql.DateTime2, new Date(payload.scheduledEnd));
  }
  if (payload.reason !== undefined) {
    sets.push("Reason = @reason");
    rq.input("reason", sql.NVarChar(1000), payload.reason || null);
  }
  if (payload.notes !== undefined) {
    sets.push("Notes = @notes");
    rq.input("notes", sql.NVarChar(2000), payload.notes || null);
  }

  if (sets.length === 0) {
    return getAppointment(requestUser, appointmentId);
  }

  sets.push("UpdatedAt = SYSUTCDATETIME()");
  await rq.query(`UPDATE dbo.Appointments SET ${sets.join(", ")} WHERE AppointmentId = @appointmentId`);
  return getAppointment(requestUser, appointmentId);
}

async function updateAppointmentStatus(requestUser, appointmentId, status) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can change appointment status.");
  }

  requireDb();
  await getAppointment(requestUser, appointmentId);
  const pool = await getPool();
  await pool
    .request()
    .input("appointmentId", sql.UniqueIdentifier, appointmentId)
    .input("status", sql.NVarChar(20), status)
    .query(`
      UPDATE dbo.Appointments
      SET Status = @status, UpdatedAt = SYSUTCDATETIME()
      WHERE AppointmentId = @appointmentId AND IsActive = 1
    `);

  return getAppointment(requestUser, appointmentId);
}

async function cancelAppointment(requestUser, appointmentId) {
  await getAppointment(requestUser, appointmentId);
  const pool = await getPool();
  await pool
    .request()
    .input("appointmentId", sql.UniqueIdentifier, appointmentId)
    .query(`
      UPDATE dbo.Appointments
      SET Status = 'CANCELLED', IsActive = 0, UpdatedAt = SYSUTCDATETIME()
      WHERE AppointmentId = @appointmentId
    `);
}

module.exports = {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment
};
