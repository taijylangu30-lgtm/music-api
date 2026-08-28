const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  provider: String,
  providerId: { type: String, required: true },
  title: String,
  artist: String,
  album: String,
  cover: String,
  duration: Number,
  createdAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ userId: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
