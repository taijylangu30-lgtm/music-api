const express = require('express');
const router = express.Router();

const { adminAuth } = require('../middleware/auth');
const providerManager = require('../providers/musicProvider');
const Stats = require('../models/Stats');

router.post('/login', (req, res) => {
  const { pin } = req.body;
  const config = require('../config');

  if (pin === config.adminPin) {
    res.cookie('admin_pin', pin, {
      httpOnly: true,
      maxAge: 86400000
    });

    return res.json({
      success: true,
      message: 'Authentification réussie'
    });
  }

  return res.status(401).json({
    success: false,
    error: {
      message: 'PIN incorrect'
    }
  });
});

router.get('/stats', adminAuth, async (req, res, next) => {
  try {
    let searches = 0;
    let plays = 0;

    if (Stats.db.readyState) {
      searches = await Stats.countDocuments({ type: 'search' });
      plays = await Stats.countDocuments({ type: 'play' });
    }

    res.json({
      success: true,
      data: {
        searches,
        plays,
        providerStatus: providerManager.getStatus()
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
