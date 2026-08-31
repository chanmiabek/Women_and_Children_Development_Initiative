export function notFound(req, res) {
  res.status(404).json({
    ok: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  console.error(`[${req.method} ${req.originalUrl}]`, error);

  const status = error.status || (error.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 10 MB or smaller.' : error.message;
  res.status(status).json({
    ok: false,
    message: status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error.' : message,
    details: error.details || undefined
  });
}
