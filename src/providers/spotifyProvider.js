const BaseMusicProvider = require('./provider');
const config = require('../config');

class SpotifyProvider extends BaseMusicProvider {
  constructor() {
    super();
    this.clientId = config.spotify.clientId;
    this.clientSecret = config.spotify.clientSecret;
    this.token = null;
    this.tokenExpiresAt = 0;
  }

  async getAccessToken() {
    if (this.token && Date.now() < this.tokenExpiresAt) return this.token;
    if (!this.clientId || !this.clientSecret) {
      throw new Error("Spotify Client Credentials non configurées dans l'environnement");
    }

    const authStr = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authStr}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!res.ok) throw new Error('Échec de la récupération du token Spotify');
    const data = await res.json();
    this.token = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return this.token;
  }

  async fetchSpotify(endpoint) {
    const token = await this.getAccessToken();
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Erreur API Spotify [${res.status}]`);
    return await res.json();
  }

  formatTrack(t) {
    return {
      provider: 'spotify',
      id: t.id,
      title: t.name,
      artist: t.artists ? t.artists.map(a => a.name).join(', ') : 'Inconnu',
      artistId: t.artists && t.artists[0] ? t.artists[0].id : null,
      album: t.album ? t.album.name : '',
      albumId: t.album ? t.album.id : null,
      cover: t.album && t.album.images && t.album.images[0] ? t.album.images[0].url : '',
      duration: Math.round((t.duration_ms || 0) / 1000),
      releaseDate: t.album ? t.album.release_date : '',
      externalUrl: t.external_urls ? t.external_urls.spotify : '',
      previewUrl: t.preview_url || null
    };
  }

  async searchTracks(query) {
    const data = await this.fetchSpotify(`/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=10`);
    return {
      tracks: (data.tracks ? data.tracks.items : []).map(t => this.formatTrack(t)),
      artists: (data.artists ? data.artists.items : []).map(a => ({
        id: a.id,
        name: a.name,
        image: a.images && a.images[0] ? a.images[0].url : '',
        genres: a.genres || []
      })),
      albums: (data.albums ? data.albums.items : []).map(al => ({
        id: al.id,
        name: al.name,
        artist: al.artists ? al.artists.map(a => a.name).join(', ') : '',
        cover: al.images && al.images[0] ? al.images[0].url : '',
        releaseDate: al.release_date
      }))
    };
  }

  async getTrack(id) {
    const data = await this.fetchSpotify(`/tracks/${id}`);
    return this.formatTrack(data);
  }

  async getArtist(id) {
    const artist = await this.fetchSpotify(`/artists/${id}`);
    const topTracks = await this.fetchSpotify(`/artists/${id}/top-tracks?market=US`);
    const albums = await this.fetchSpotify(`/artists/${id}/albums?limit=5`);

    return {
      id: artist.id,
      name: artist.name,
      image: artist.images && artist.images[0] ? artist.images[0].url : '',
      genres: artist.genres || [],
      popularity: artist.popularity,
      topTracks: (topTracks.tracks || []).map(t => this.formatTrack(t)),
      albums: (albums.items || []).map(al => ({
        id: al.id,
        name: al.name,
        cover: al.images && al.images[0] ? al.images[0].url : '',
        releaseDate: al.release_date
      }))
    };
  }

  async getAlbum(id) {
    const data = await this.fetchSpotify(`/albums/${id}`);
    return {
      id: data.id,
      title: data.name,
      artist: data.artists ? data.artists.map(a => a.name).join(', ') : '',
      cover: data.images && data.images[0] ? data.images[0].url : '',
      releaseDate: data.release_date,
      totalTracks: data.total_tracks,
      tracks: (data.tracks ? data.tracks.items : []).map(t => ({
        id: t.id,
        title: t.name,
        artist: t.artists ? t.artists.map(a => a.name).join(', ') : '',
        duration: Math.round((t.duration_ms || 0) / 1000)
      }))
    };
  }

  async getLyrics(id) {
    // Les paroles protégées nécessitent des accords légaux d'éditeurs (Musixmatch/LyricFind)
    return {
      available: false,
      message: "Paroles indisponibles pour cette chanson conformément aux droits d'auteur."
    };
  }

  async getPlaybackInfo(id) {
    const track = await this.getTrack(id);
    return {
      type: "official",
      provider: "spotify",
      embedUrl: `https://open.spotify.com/embed/track/${id}?utm_source=generator`,
      canPlayFullTrack: false, // Nécessite l'application/lecteur officiel pour la lecture intégrale
      externalUrl: track.externalUrl,
      previewUrl: track.previewUrl
    };
  }

  async getTrending() {
    const data = await this.searchTracks('genre:pop year:2026');
    return data;
  }

  getStatus() {
    return {
      name: 'Spotify Official API',
      online: Boolean(this.clientId && this.clientSecret),
      search: true,
      metadata: true,
      playback: 'Official Embed / Web Playback SDK',
      lyrics: false
    };
  }
}

module.exports = SpotifyProvider;
