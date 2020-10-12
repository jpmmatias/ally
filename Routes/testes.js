const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../Config/auth');
const {
	mostrarPaginaAddTeste,
	addTeste,
	mostrarEspecificoTeste,
	mostrarPaginaPraEditar,
	editarTeste,
	deletarTeste,
} = require('../Controllers/testes');

router.get('/add', ensureAuthenticated, mostrarPaginaAddTeste);

router.post('/', ensureAuthenticated, addTeste);

router.get('/:id', ensureAuthenticated, mostrarEspecificoTeste);

router.get('/editar/:id', ensureAuthenticated, mostrarPaginaPraEditar);

router.put('/editar/:id', ensureAuthenticated, editarTeste);

router.delete('/:id', ensureAuthenticated, deletarTeste);

module.exports = router;
