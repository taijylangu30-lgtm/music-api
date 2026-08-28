const providerManager = require('../providers/musicProvider');
const cache = require('../services/cache');
const stats = require('../services/statsService');

exports.search = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Le paramètre q (recherche) est requis.' }
      });
    }

    const cacheKey = `search_${query.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, meta: { cached: true } });
    }

    const provider = providerManager.getProvider();
    const result = await provider.searchTracks(query);

    cache.set(cacheKey, result, 1800); // 30 min
    stats.logStat('search', { query });

    res.json({ success: true, data: result, meta: { cached: false } });
  } catch (err) {
    next(err);
  }
};

exports.getTrending = async (req, res, next) => {
  try {
    const cacheKey = 'trending_tracks';
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, meta: { cached: true } });
    }

    const provider = providerManager.getProvider();
    const result = await provider.getTrending();

    cache.set(cacheKey, result, 3600);
    res.json({ success: true, data: result, meta: { cached: false } });
  } catch (err) {
    next(err);
  }
};
