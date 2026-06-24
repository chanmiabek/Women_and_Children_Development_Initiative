export function notFound(req, res) {
  res.status(404).json({
    ok: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.status || 500;
  res.status(status).json({
    ok: false,
    message: status === 500 ? 'Internal server error.' : error.message,
    details: error.details || undefined
  });
}
