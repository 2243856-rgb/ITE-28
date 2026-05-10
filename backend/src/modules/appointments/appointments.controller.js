const { ok } = require("../../utils/response");
const { HttpError } = require("../../utils/http-error");
const service = require("./appointments.service");

function validateCreate(body) {
  const required = ["petId", "clinicId", "appointmentType", "scheduledStart", "scheduledEnd"];
  for (const key of required) {
    if (!body[key]) {
      throw new HttpError(400, "VALIDATION_ERROR", `${key} is required.`);
    }
  }
  if (new Date(body.scheduledEnd) <= new Date(body.scheduledStart)) {
    throw new HttpError(422, "INVALID_TIME_RANGE", "scheduledEnd must be after scheduledStart.");
  }
  if (body.appointmentType === "HOME_VISIT") {
    if (!body.homeVisit || !body.homeVisit.serviceAddress || !body.homeVisit.city) {
      throw new HttpError(422, "HOME_VISIT_REQUIRED", "homeVisit.serviceAddress and city are required.");
    }
  }
}

function createAppointment(req, res, next) {
  try {
    validateCreate(req.body);
    const result = service.createAppointment(req.user, req.body);
    return ok(res, result, 201);
  } catch (err) {
    return next(err);
  }
}

function listAppointments(req, res, next) {
  try {
    const items = service.listAppointments(req.user);
    return ok(res, { items, total: items.length });
  } catch (err) {
    return next(err);
  }
}

function getAppointment(req, res, next) {
  try {
    const item = service.getAppointment(req.user, req.params.appointmentId);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

function patchAppointment(req, res, next) {
  try {
    const item = service.updateAppointment(req.user, req.params.appointmentId, req.body);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

function patchAppointmentStatus(req, res, next) {
  try {
    if (!req.body.status) {
      throw new HttpError(400, "VALIDATION_ERROR", "status is required.");
    }
    const item = service.updateAppointmentStatus(req.user, req.params.appointmentId, req.body.status);
    return ok(res, item);
  } catch (err) {
    return next(err);
  }
}

function deleteAppointment(req, res, next) {
  try {
    service.cancelAppointment(req.user, req.params.appointmentId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  getAppointment,
  patchAppointment,
  patchAppointmentStatus,
  deleteAppointment
};
