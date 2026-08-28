document.addEventListener('DOMContentLoaded', () => {
  // Elements de l'application
  const searchInput = document.getElementById('searchInput');
  const trendingGrid = document.getElementById('trendingGrid');
  const artistsGrid = document.getElementById('artistsGrid');
  const playerBar = document.getElementById('playerBar');
  const playerCover = document.getElementById('playerCover');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const btnPlay = document.getElementById('btnPlay');
  const playIcon = document.getElementById('playIcon');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');

  let currentTrack = null;
  let isPlaying = false;
  let searchDebounceTimer = null;

  // Initialize
  fetchTrending();

  // Handle Search input live with Debounce
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      const query = e.target.value.trim();
      
      if (query.length === 0) {
        fetchTrending();
        return;
      }

      searchDebounceTimer = setTimeout(() => {
        executeSearch(query);
      }, 300);
    });
  }

  // Fetch Trending Tracks from API
  async function fetchTrending() {
    try {
      const response = await fetch('/api/trending');
      const data = await response.json();

      if (data.success && data.data) {
        renderTracks(data.data.tracks || data.data, trendingGrid);
        if(data.data.artists) renderArtists(data.data.artists, artistsGrid);
      }
    } catch (err) {
      showToast("Impossible de charger les tendances", "error");
    }
  }

  // Execute Search query
  async function executeSearch(query) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        renderTracks(data.data.tracks || [], trendingGrid);
      }
    } catch (err) {
      showToast("Erreur lors de la recherche", "error");
    }
  }

  // Render Tracks to UI Grid
  function renderTracks(tracks, container) {
    if (!container) return;
    container.innerHTML = '';

    if (!tracks || tracks.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Aucun morceau trouvé.</div>`;
      return;
    }

    tracks.forEach(track => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${track.cover || '/assets/default-cover.jpg'}" alt="${track.title}" loading="lazy">
          <div class="play-btn-overlay">
            <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="card-title">${track.title}</div>
        <div class="card-subtitle">${track.artist}</div>
      `;

      card.addEventListener('click', () => loadAndPlayTrack(track.id || track.providerId));
      container.appendChild(card);
    });
  }

  // Render Artists Grid
  function renderArtists(artists, container) {
    if (!container) return;
    container.innerHTML = '';

    artists.forEach(artist => {
      const card = document.createElement('div');
      card.className = 'card card-circular';
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${artist.image || '/assets/default-artist.jpg'}" alt="${artist.name}" loading="lazy">
        </div>
        <div class="card-title" style="text-align: center;">${artist.name}</div>
      `;
      container.appendChild(card);
    });
  }

  // Load and play track via official player route
  async function loadAndPlayTrack(trackId) {
    try {
      const response = await fetch(`/api/play/${trackId}`);
      const data = await response.json();

      if (data.success && data.playback) {
        const track = data.track;
        currentTrack = track;
        
        // Populate UI
        playerCover.src = track.cover;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist;
        
        playerBar.classList.remove('hidden');
        
        if (data.playback.type === 'official' && data.playback.embedUrl) {
          showToast(`Lecture via le lecteur officiel ${data.playback.provider}`);
        } else if (!data.playback.canPlayFullTrack) {
          showToast("Extrait uniquement — Lecteur officiel requis pour la totalité", "warning");
        }
        
        togglePlayState(true);
      }
    } catch (err) {
      showToast("Erreur lors du lancement de la lecture", "error");
    }
  }

  function togglePlayState(play) {
    isPlaying = play !== undefined ? play : !isPlaying;
    if (isPlaying) {
      playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    } else {
      playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
    }
  }

  if (btnPlay) {
    btnPlay.addEventListener('click', () => togglePlayState());
  }

  // Helper Toast System
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
});
