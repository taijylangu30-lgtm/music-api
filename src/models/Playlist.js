const mongoose = require('mongoose');

const trackSubSchema = new mongoose.Schema({
  provider: String,
  providerId: String,
  title: String,
  artist: String,
  cover: String,
  duration: Number
});

const playlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  tracks: [trackSubSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
