const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../Config/auth');

const {
	mostrarHomepage,
	mostrarDahboard,
	mostrarConfiguracoes,
	mostrarVideos,
	mostrarLandingTester,
	mostrarPaginaDeContato,
	enviarEmailContato,
	mostrarOrientacoes,
	mostrarGuia,
} = require('../Controllers/index');

router.get('/', ensureGuest, mostrarHomepage);

router.get('/tester', ensureGuest, mostrarLandingTester);

router.get('/guia', ensureGuest, mostrarGuia);

router.get('/dashboard', ensureAuthenticated, mostrarDahboard);

router.get('/configuracoes', ensureAuthenticated, mostrarConfiguracoes);

router.get('/orientacoes', ensureAuthenticated, mostrarOrientacoes);

router.get('/videos', ensureAuthenticated, mostrarVideos);

router.get('/contato', mostrarPaginaDeContato);

router.post('/contato', enviarEmailContato);

module.exports = router;
