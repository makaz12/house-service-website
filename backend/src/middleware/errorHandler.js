function notFoundHandler(req, res) {
  return res.status(404).json({ message: "Route not found." });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  const status = error.status || 500;
  const message = error.message || "Internal server error.";
  return res.status(status).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
