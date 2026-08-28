const providerManager = require('../providers/musicProvider');
const cache = require('../services/cache');
const stats = require('../services/statsService');

exports.getAlbum = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cacheKey = `album_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const provider = providerManager.getProvider();
    const album = await provider.getAlbum(id);

    cache.set(cacheKey, album, 86400);
    stats.logStat('album_view', { albumId: id });

    res.json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
};
