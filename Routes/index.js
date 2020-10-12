const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../Config/auth');

const {mostrarHomepage, mostrarDahboard} = require('../Controllers/index');

router.get('/', ensureGuest, mostrarHomepage);

router.get('/dashboard', ensureAuthenticated, mostrarDahboard);

module.exports = router;
