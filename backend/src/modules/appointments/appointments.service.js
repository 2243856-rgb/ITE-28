const { v4: uuidv4 } = require("uuid");
const { appointments, homeVisits, pets } = require("../../data/store");
const { HttpError } = require("../../utils/http-error");

function validatePetAccess(requestUser, petId) {
  const pet = pets.find((item) => item.petId === petId && item.isActive);
  if (!pet) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }

  if (requestUser.role === "OWNER" && pet.ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You can only book for your own pets.");
  }

  return pet;
}

function createAppointment(requestUser, payload) {
  const pet = validatePetAccess(requestUser, payload.petId);

  const appointment = {
    appointmentId: uuidv4(),
    petId: pet.petId,
    ownerUserId: pet.ownerUserId,
    clinicId: payload.clinicId,
    veterinarianId: payload.veterinarianId || null,
    appointmentType: payload.appointmentType,
    status: "PENDING",
    scheduledStart: payload.scheduledStart,
    scheduledEnd: payload.scheduledEnd,
    reason: payload.reason || null,
    notes: payload.notes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };

  appointments.push(appointment);

  if (payload.appointmentType === "HOME_VISIT") {
    const homeVisitInput = payload.homeVisit || {};
    homeVisits.push({
      homeVisitId: uuidv4(),
      appointmentId: appointment.appointmentId,
      serviceAddress: homeVisitInput.serviceAddress,
      city: homeVisitInput.city,
      stateProvince: homeVisitInput.stateProvince || null,
      postalCode: homeVisitInput.postalCode || null,
      latitude: homeVisitInput.latitude || null,
      longitude: homeVisitInput.longitude || null,
      etaMinutes: null,
      lastTrackedLatitude: null,
      lastTrackedLongitude: null,
      visitStatus: "SCHEDULED",
      arrivalTime: null,
      completionTime: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return appointment;
}

function listAppointments(requestUser) {
  if (requestUser.role === "OWNER") {
    return appointments.filter((item) => item.ownerUserId === requestUser.sub && item.isActive);
  }
  return appointments.filter((item) => item.isActive);
}

function getAppointment(requestUser, appointmentId) {
  const appointment = appointments.find((item) => item.appointmentId === appointmentId && item.isActive);
  if (!appointment) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }
  if (requestUser.role === "OWNER" && appointment.ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this appointment.");
  }
  return appointment;
}

function updateAppointment(requestUser, appointmentId, payload) {
  const index = appointments.findIndex((item) => item.appointmentId === appointmentId && item.isActive);
  if (index < 0) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }
  if (requestUser.role === "OWNER" && appointments[index].ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot modify this appointment.");
  }

  appointments[index] = {
    ...appointments[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };
  return appointments[index];
}

function updateAppointmentStatus(requestUser, appointmentId, status) {
  const allowedRoles = ["VET", "CLINIC_STAFF", "ADMIN"];
  if (!allowedRoles.includes(requestUser.role)) {
    throw new HttpError(403, "FORBIDDEN", "Only vet/staff/admin can change appointment status.");
  }

  const index = appointments.findIndex((item) => item.appointmentId === appointmentId && item.isActive);
  if (index < 0) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }

  appointments[index].status = status;
  appointments[index].updatedAt = new Date().toISOString();
  return appointments[index];
}

function cancelAppointment(requestUser, appointmentId) {
  const index = appointments.findIndex((item) => item.appointmentId === appointmentId && item.isActive);
  if (index < 0) {
    throw new HttpError(404, "APPOINTMENT_NOT_FOUND", "Appointment not found.");
  }
  if (requestUser.role === "OWNER" && appointments[index].ownerUserId !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot cancel this appointment.");
  }
  appointments[index].status = "CANCELLED";
  appointments[index].isActive = false;
  appointments[index].updatedAt = new Date().toISOString();
}

module.exports = {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment
};
