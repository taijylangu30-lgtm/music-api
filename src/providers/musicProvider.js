const SpotifyProvider = require('./spotifyProvider');

class MusicProviderManager {
  constructor() {
    this.providers = {
      spotify: new SpotifyProvider()
    };
    this.activeProviderName = process.env.MUSIC_PROVIDER || 'spotify';
  }

  getProvider() {
    const p = this.providers[this.activeProviderName];
    if (!p) throw new Error(`Provider non supporté : ${this.activeProviderName}`);
    return p;
  }

  getStatus() {
    return this.getProvider().getStatus();
  }
}

module.exports = new MusicProviderManager();
