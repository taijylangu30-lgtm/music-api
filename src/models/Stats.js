const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['search', 'play', 'track_view', 'artist_view', 'album_view'] },
  query: String,
  trackId: String,
  artistId: String,
  albumId: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stats', statsSchema);
