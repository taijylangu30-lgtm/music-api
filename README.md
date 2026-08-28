# 🎵 Music API — Plateforme & Service REST Légal

Music API est une plateforme moderne permettant la recherche de métadonnées musicales et l'intégration de lecteurs officiels (Web Playback SDK / Official Embeds) dans le respect strict des droits d'auteur.

## 🚀 Fonctionnalités
- 🔍 **Recherche complète** (Titres, Artistes, Albums)
- ⚖️ **Architecture 100% Légale** (Pas de scraping ni de conversion MP3 illégale)
- 🔌 **Provider Abstraction** (Découplage permettant de basculer vers Spotify, Deezer, etc.)
- 🛡️ **Sécurité & Stats** (Helmet, Rate Limiting, CORS, Cache mémoire, Dashboard Admin)
- 🤖 **Commande Goat Bot V2** prête à l'emploi.

## 📦 Installation Locale

```bash
# 1. Cloner le repository
git clone [https://github.com/taijylangu30-lgtm/music-api.git](https://github.com/taijylangu30-lgtm/music-api.git)
cd music-api

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Compléter SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, MONGODB_URI...

# 4. Lancer en mode dev
npm run dev
