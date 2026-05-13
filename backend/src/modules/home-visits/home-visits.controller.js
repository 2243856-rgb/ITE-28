const { ok } = require("../../utils/response");
const { HttpError } = require("../../utils/http-error");
const service = require("./home-visits.service");

async function getHomeVisit(req, res, next) {
  try {
    const result = await service.getHomeVisit(req.user, req.params.appointmentId);
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
}

async function patchHomeVisitStatus(req, res, next) {
  try {
    if (!req.body.visitStatus) {
      throw new HttpError(400, "VALIDATION_ERROR", "visitStatus is required.");
    }
    const result = await service.updateHomeVisitStatus(req.user, req.params.appointmentId, req.body.visitStatus);
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
}

async function patchHomeVisitTracking(req, res, next) {
  try {
    if (req.body.latitude == null && req.body.longitude == null && req.body.etaMinutes == null) {
      throw new HttpError(400, "VALIDATION_ERROR", "Provide latitude/longitude and/or etaMinutes.");
    }
    const result = await service.updateHomeVisitTracking(req.user, req.params.appointmentId, req.body);
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getHomeVisit, patchHomeVisitStatus, patchHomeVisitTracking };
