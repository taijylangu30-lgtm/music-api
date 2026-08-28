const providerManager = require('../providers/musicProvider');
const cache = require('../services/cache');
const stats = require('../services/statsService');

exports.getTrack = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cacheKey = `track_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const provider = providerManager.getProvider();
    const track = await provider.getTrack(id);

    cache.set(cacheKey, track, 86400); // 24h
    stats.logStat('track_view', { trackId: id });

    res.json({ success: true, data: track });
  } catch (err) {
    next(err);
  }
};

exports.getPlayback = async (req, res, next) => {
  try {
    const id = req.params.id;
    const provider = providerManager.getProvider();
    
    const track = await provider.getTrack(id);
    const playback = await provider.getPlaybackInfo(id);

    stats.logStat('play', { trackId: id });

    res.json({
      success: true,
      track: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        cover: track.cover,
        duration: track.duration
      },
      playback
    });
  } catch (err) {
    next(err);
  }
};
