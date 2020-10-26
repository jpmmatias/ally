const express = require('express');
const router = express.Router({mergeParams: true});
const {ensureAuthenticated} = require('../Config/auth');
const {
	mostrarPaginaDeConvidarTesters,
	convidarTester,
	aceitarConviteTeste,
	recusarConviteTeste
} = require('../Controllers/convites');


router.get('/', ensureAuthenticated, mostrarPaginaDeConvidarTesters);

router.post('/', ensureAuthenticated, convidarTester);

router.post('/aceitar', ensureAuthenticated, aceitarConviteTeste);

router.post('/recusar', ensureAuthenticated, recusarConviteTeste);


module.exports = router;