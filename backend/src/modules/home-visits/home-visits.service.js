const sql = require("mssql");
const { getPool, isConfigured } = require("../../db/pool");
const { HttpError } = require("../../utils/http-error");

function requireDb() {
  if (!isConfigured()) {
    throw new HttpError(503, "DATABASE_UNAVAILABLE", "Azure SQL is not configured.");
  }
}

function mapHomeVisitRow(r) {
  return {
    homeVisitId: String(r.HomeVisitId),
    appointmentId: String(r.AppointmentId),
    serviceAddress: r.ServiceAddress,
    city: r.City,
    stateProvince: r.StateProvince,
    postalCode: r.PostalCode,
    latitude: r.Latitude != null ? Number(r.Latitude) : null,
    longitude: r.Longitude != null ? Number(r.Longitude) : null,
    etaMinutes: r.EtaMinutes != null ? Number(r.EtaMinutes) : null,
    lastTrackedLatitude: r.LastTrackedLatitude != null ? Number(r.LastTrackedLatitude) : null,
    lastTrackedLongitude: r.LastTrackedLongitude != null ? Number(r.LastTrackedLongitude) : null,
    visitStatus: r.VisitStatus,
    arrivalTime: r.ArrivalTime ? new Date(r.ArrivalTime).toISOString() : null,
    completionTime: r.CompletionTime ? new Date(r.CompletionTime).toISOString() : null,
    createdAt: r.CreatedAt ? new Date(r.CreatedAt).toISOString() : null,
    updatedAt: r.UpdatedAt ? new Date(r.UpdatedAt).toISOString() : null
  };
}

async function requireHomeVisitRecord(appointmentId) {
  requireDb();
  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("appointmentId", sql.UniqueIdentifier, appointmentId)
    .query(`
      SELECT a.AppointmentId, a.OwnerUserId, a.AppointmentType, a.IsActive AS AppointmentIsActive,
             h.HomeVisitId, h.AppointmentId AS HVAppointmentId, h.ServiceAddress, h.City, h.StateProvince,
             h.PostalCode, h.Latitude, h.Longitude, h.EtaMinutes, h.LastTrackedLatitude, h.LastTrackedLongitude,
             h.VisitStatus, h.ArrivalTime, h.CompletionTime, h.CreatedAt, h.UpdatedAt
      FROM dbo.Appointments a
      INNER JOIN dbo.HomeVisits h ON h.AppointmentId = a.AppointmentId
      WHERE a.AppointmentId = @appointmentId
    `);

  const row = recordset[0];
  if (!row) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }
  if (row.AppointmentType !== "HOME_VISIT") {
    throw new HttpError(422, "NOT_HOME_VISIT", "Appointment is not a home visit.");
  }

  const appointment = {
    appointmentId: String(row.AppointmentId),
    ownerUserId: String(row.OwnerUserId),
    appointmentType: row.AppointmentType,
    isActive: Boolean(row.AppointmentIsActive)
  };

  const homeVisit = mapHomeVisitRow({
    HomeVisitId: row.HomeVisitId,
    AppointmentId: row.AppointmentId,
    ServiceAddress: row.ServiceAddress,
    City: row.City,
    StateProvince: row.StateProvince,
    PostalCode: row.PostalCode,
    Latitude: row.Latitude,
    Longitude: row.Longitude,
    EtaMinutes: row.EtaMinutes,
    LastTrackedLatitude: row.LastTrackedLatitude,
    LastTrackedLongitude: row.LastTrackedLongitude,
    VisitStatus: row.VisitStatus,
    ArrivalTime: row.ArrivalTime,
    CompletionTime: row.CompletionTime,
    CreatedAt: row.CreatedAt,
    UpdatedAt: row.UpdatedAt
  });

  return { appointment, homeVisit };
}

function enforceAccess(requestUser, appointment) {
  if (requestUser.role === "OWNER" && appointment.ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this home visit.");
  }
}

async function getHomeVisit(requestUser, appointmentId) {
  const { appointment, homeVisit } = await requireHomeVisitRecord(appointmentId);
  enforceAccess(requestUser, appointment);
  return homeVisit;
}

async function updateHomeVisitStatus(requestUser, appointmentId, visitStatus) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can update home visit status.");
  }

  await requireHomeVisitRecord(appointmentId);
  const pool = await getPool();
  const rq = pool
    .request()
    .input("appointmentId", sql.UniqueIdentifier, appointmentId)
    .input("visitStatus", sql.NVarChar(20), visitStatus);

  let arrivalSql = "";
  let completionSql = "";
  if (visitStatus === "ARRIVED") {
    arrivalSql = ", ArrivalTime = SYSUTCDATETIME()";
  }
  if (visitStatus === "COMPLETED") {
    completionSql = ", CompletionTime = SYSUTCDATETIME()";
  }

  await rq.query(`
    UPDATE dbo.HomeVisits
    SET VisitStatus = @visitStatus, UpdatedAt = SYSUTCDATETIME()${arrivalSql}${completionSql}
    WHERE AppointmentId = @appointmentId
  `);

  return getHomeVisit(requestUser, appointmentId);
}

async function updateHomeVisitTracking(requestUser, appointmentId, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can update tracking.");
  }

  await requireHomeVisitRecord(appointmentId);
  const pool = await getPool();
  const rq = pool.request().input("appointmentId", sql.UniqueIdentifier, appointmentId);
  const sets = [];

  if (payload.latitude != null) {
    sets.push("LastTrackedLatitude = @lat");
    rq.input("lat", sql.Decimal(9, 6), Number(payload.latitude));
  }
  if (payload.longitude != null) {
    sets.push("LastTrackedLongitude = @lng");
    rq.input("lng", sql.Decimal(9, 6), Number(payload.longitude));
  }
  if (payload.etaMinutes != null) {
    sets.push("EtaMinutes = @eta");
    rq.input("eta", sql.Int, Number(payload.etaMinutes));
  }

  if (sets.length === 0) {
    const { homeVisit } = await requireHomeVisitRecord(appointmentId);
    return homeVisit;
  }

  sets.push("UpdatedAt = SYSUTCDATETIME()");
  await rq.query(`UPDATE dbo.HomeVisits SET ${sets.join(", ")} WHERE AppointmentId = @appointmentId`);

  const { homeVisit } = await requireHomeVisitRecord(appointmentId);
  return homeVisit;
}

module.exports = { getHomeVisit, updateHomeVisitStatus, updateHomeVisitTracking };
