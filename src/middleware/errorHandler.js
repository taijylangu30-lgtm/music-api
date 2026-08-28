const errorHandler = (err, req, res, next) => {
  console.error('❌ Internal Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Une erreur interne est survenue sur le serveur.'
    }
  });
};

module.exports = errorHandler;
