export function notFoundHandler(_req, res) {
  return res.status(404).json({ error: 'API endpoint not found.' });
}

export function errorHandler(error, _req, res, _next) {
  console.error('[api] Request failed:', error);

  if (res.headersSent) return;

  const status = Number(error.status || error.statusCode || 500);
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  return res.status(safeStatus).json({
    error: safeStatus === 500 ? 'An unexpected server error occurred.' : error.message,
  });
}
