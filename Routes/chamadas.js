const express = require('express');
const router = express.Router({mergeParams: true});
const {ensureAuthenticated} = require('../Config/auth');
const {mostrarLobby, mostrarSala} = require('../Controllers/chamadas');

router.get('/', ensureAuthenticated, mostrarSala);
router.get('/lobby', ensureAuthenticated, mostrarLobby);

module.exports = router;
