const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');
const trackController = require('../controllers/trackController');
const artistController = require('../controllers/artistController');
const albumController = require('../controllers/albumController');
const lyricsController = require('../controllers/lyricsController');

router.get('/health', (req, res) => res.json({ success: true, status: 'OK', timestamp: new Date() }));
router.get('/search', searchController.search);
router.get('/trending', searchController.getTrending);
router.get('/track/:id', trackController.getTrack);
router.get('/play/:id', trackController.getPlayback);
router.get('/artist/:id', artistController.getArtist);
router.get('/album/:id', albumController.getAlbum);
router.get('/lyrics/:id', lyricsController.getLyrics);

module.exports = router;
