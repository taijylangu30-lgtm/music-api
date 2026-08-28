class BaseMusicProvider {
  async searchTracks(query) { throw new Error('Not implemented'); }
  async getTrack(id) { throw new Error('Not implemented'); }
  async getArtist(id) { throw new Error('Not implemented'); }
  async getAlbum(id) { throw new Error('Not implemented'); }
  async getLyrics(id) { throw new Error('Not implemented'); }
  async getPlaybackInfo(id) { throw new Error('Not implemented'); }
  async getTrending() { throw new Error('Not implemented'); }
  getStatus() { return { name: 'BaseProvider', online: false }; }
}

module.exports = BaseMusicProvider;
