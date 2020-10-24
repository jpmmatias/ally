const express = require('express');
const {ensureAuthenticated} = require('../Config/auth');
const {
	mostrarPaginaAddTeste,
	addTeste,
	mostrarEspecificoTeste,
	mostrarPaginaPraEditar,
	editarTeste,
	deletarTeste,
	mostrarPaginaDeConvidarTesters,
	convidarTester,
	aceitarConviteTeste,
	recusarConviteTeste
} = require('../Controllers/testes');

const chamadaRouter = require('./chamadas');

const router = express.Router();

router.use('/:id/chamada', chamadaRouter);

router.get('/add', ensureAuthenticated, mostrarPaginaAddTeste);

router.post('/', ensureAuthenticated, addTeste);

router.get('/:id', ensureAuthenticated, mostrarEspecificoTeste);

router.get('/editar/:id', ensureAuthenticated, mostrarPaginaPraEditar);

router.put('/editar/:id', ensureAuthenticated, editarTeste);

router.delete('/:id', ensureAuthenticated, deletarTeste);

router.get('/add/:id/convidar', ensureAuthenticated, mostrarPaginaDeConvidarTesters);

router.post('/add/:id/convidar', ensureAuthenticated, convidarTester);

router.post('/add/:id/convidar/aceitar', ensureAuthenticated, aceitarConviteTeste);

router.post('/add/:id/convidar/recusar', ensureAuthenticated, recusarConviteTeste);


module.exports = router;
