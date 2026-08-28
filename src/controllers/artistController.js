const providerManager = require('../providers/musicProvider');
const cache = require('../services/cache');
const stats = require('../services/statsService');

exports.getArtist = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cacheKey = `artist_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const provider = providerManager.getProvider();
    const artist = await provider.getArtist(id);

    cache.set(cacheKey, artist, 86400);
    stats.logStat('artist_view', { artistId: id });

    res.json({ success: true, data: artist });
  } catch (err) {
    next(err);
  }
};
