const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../Config/auth');

const {mostrarCalendario,mostrarDadosProCalendario} = require('../Controllers/calendario');

router.get('/', ensureAuthenticated, mostrarCalendario);
router.get('/data', ensureAuthenticated, mostrarDadosProCalendario);
module.exports = router;