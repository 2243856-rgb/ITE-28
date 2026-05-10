const { appointments, homeVisits } = require("../../data/store");
const { HttpError } = require("../../utils/http-error");

function requireHomeVisitRecord(appointmentId) {
  const appointment = appointments.find((item) => item.appointmentId === appointmentId);
  if (!appointment) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }
  if (appointment.appointmentType !== "HOME_VISIT") {
    throw new HttpError(422, "NOT_HOME_VISIT", "Appointment is not a home visit.");
  }

  const homeVisit = homeVisits.find((item) => item.appointmentId === appointmentId);
  if (!homeVisit) {
    throw new HttpError(404, "HOME_VISIT_NOT_FOUND", "Home visit details not found.");
  }

  return { appointment, homeVisit };
}

function enforceAccess(requestUser, appointment) {
  if (requestUser.role === "OWNER" && appointment.ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this home visit.");
  }
}

function getHomeVisit(requestUser, appointmentId) {
  const { appointment, homeVisit } = requireHomeVisitRecord(appointmentId);
  enforceAccess(requestUser, appointment);
  return homeVisit;
}

function updateHomeVisitStatus(requestUser, appointmentId, visitStatus) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can update home visit status.");
  }

  const { homeVisit } = requireHomeVisitRecord(appointmentId);
  homeVisit.visitStatus = visitStatus;
  if (visitStatus === "ARRIVED") {
    homeVisit.arrivalTime = new Date().toISOString();
  }
  if (visitStatus === "COMPLETED") {
    homeVisit.completionTime = new Date().toISOString();
  }
  homeVisit.updatedAt = new Date().toISOString();
  return homeVisit;
}

function updateHomeVisitTracking(requestUser, appointmentId, payload) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can update tracking.");
  }

  const { homeVisit } = requireHomeVisitRecord(appointmentId);
  homeVisit.lastTrackedLatitude = payload.latitude ?? homeVisit.lastTrackedLatitude;
  homeVisit.lastTrackedLongitude = payload.longitude ?? homeVisit.lastTrackedLongitude;
  homeVisit.etaMinutes = payload.etaMinutes ?? homeVisit.etaMinutes;
  homeVisit.updatedAt = new Date().toISOString();
  return homeVisit;
}

module.exports = { getHomeVisit, updateHomeVisitStatus, updateHomeVisitTracking };
