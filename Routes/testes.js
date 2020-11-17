const express = require('express');
const { ensureAuthenticated } = require('../Config/auth');
const {
	mostrarPaginaAddTeste,
	addTeste,
	mostrarEspecificoTeste,
	mostrarPaginaPraEditar,
	editarTeste,
	deletarTeste,
	mostrarPaginaAddTesteFinalizado,
	mostrarGravacoes,
	mostrarVideoeAnotacoes
} = require('../Controllers/testes');

const chamadaRouter = require('./chamadas');

const conviteRouter = require('./convites');

const router = express.Router();

router.use('/:id/chamada', chamadaRouter);

router.use('/add/:id/convidar', conviteRouter);

router.get('/add', ensureAuthenticated, mostrarPaginaAddTeste);

router.get('/add/finalizado', mostrarPaginaAddTesteFinalizado);

router.post('/', ensureAuthenticated, addTeste);

router.get('/:id', ensureAuthenticated, mostrarEspecificoTeste);

router.get('/editar/:id', ensureAuthenticated, mostrarPaginaPraEditar);

router.put('/editar/:id', ensureAuthenticated, editarTeste);

router.delete('/:id', ensureAuthenticated, deletarTeste);

router.get('/:id/gravacoesanotcacoes', ensureAuthenticated, mostrarGravacoes);

router.get('/:id/gravacoesanotcacoes/:videoId', ensureAuthenticated, mostrarVideoeAnotacoes);

module.exports = router;
