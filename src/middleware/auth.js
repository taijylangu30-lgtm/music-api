const config = require('../config');

const adminAuth = (req, res, next) => {
  const pin = req.headers['x-admin-pin'] || req.cookies?.admin_pin || req.query.pin;
  if (!pin || pin !== config.adminPin) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Accès administrateur non autorisé' }
    });
  }
  next();
};

module.exports = { adminAuth };
