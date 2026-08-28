require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/musicapi',
  adminPin: process.env.ADMIN_PIN || '123456',
  adminSecret: process.env.ADMIN_SESSION_SECRET || 'secret_key_change_in_prod',
  provider: process.env.MUSIC_PROVIDER || 'spotify',
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || ''
  },
  allowedOrigin: process.env.ALLOWED_ORIGIN || '*'
};
