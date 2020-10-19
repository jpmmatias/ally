const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../Config/auth');

const {mostrarCalendario} = require('../Controllers/calendario');

router.get('/', ensureAuthenticated, mostrarCalendario);
module.exports = router;