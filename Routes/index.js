const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../Config/auth');

const {mostrarHomepage, mostrarDahboard,mostrarVideos} = require('../Controllers/index');

router.get('/', ensureGuest, mostrarHomepage);

router.get('/dashboard', ensureAuthenticated, mostrarDahboard);


router.get('/videos', ensureAuthenticated, mostrarVideos);

module.exports = router;
