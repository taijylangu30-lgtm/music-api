const providerManager = require('../providers/musicProvider');

exports.getLyrics = async (req, res, next) => {
  try {
    const id = req.params.id;
    const provider = providerManager.getProvider();
    const lyrics = await provider.getLyrics(id);

    res.json({ success: true, data: lyrics });
  } catch (err) {
    next(err);
  }
};
