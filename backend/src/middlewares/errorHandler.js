const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
};

module.exports = { errorHandler };