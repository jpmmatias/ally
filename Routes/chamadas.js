const express = require('express');
const router = express.Router({mergeParams: true});
const {ensureAuthenticated} = require('../Config/auth');
const {
	mostrarLobby,
	mostrarSala,
	addAnotacao,
} = require('../Controllers/chamadas');

router.get('/', ensureAuthenticated, mostrarSala);
router.get('/lobby', ensureAuthenticated, mostrarLobby);
router.put('/anotacao', ensureAuthenticated, addAnotacao);

module.exports = router;
