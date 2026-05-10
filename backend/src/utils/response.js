function ok(res, data, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

function fail(res, statusCode, code, message) {
  return res.status(statusCode).json({
    error: { code, message }
  });
}

module.exports = { ok, fail };
