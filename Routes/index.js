const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../Config/auth');

const {mostrarHomepage, mostrarDahboard, mostrarConfiguracoes, mostrarVideos,mostrarLandingTester,mostrarPaginaDeContato,enviarEmailContato} = require('../Controllers/index');

router.get('/', ensureGuest, mostrarHomepage);

router.get('/tester', ensureGuest, mostrarLandingTester);

router.get('/dashboard', ensureAuthenticated, mostrarDahboard);

router.get('/configuracoes', ensureAuthenticated, mostrarConfiguracoes);

router.get('/videos', ensureAuthenticated, mostrarVideos);

router.get('/contato', mostrarPaginaDeContato);

router.post('/contato', enviarEmailContato);

module.exports = router;
