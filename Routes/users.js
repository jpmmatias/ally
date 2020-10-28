const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {
	criarUsuario,
	mostrarPaginaLogin,
	mostrarPaginaRegister,
	lidarLogin,
	logout,
	mostrarPaginaRegisterTester,
	criarUsuarioTester,
	deletarConta
} = require('../Controllers/users');
const {ensureGuest, ensureAuthenticated} = require('../Config/auth');
const passport = require('passport');

router.get('/login', ensureGuest, mostrarPaginaLogin);

router.get('/register', ensureGuest, mostrarPaginaRegister);

router.get('/register/tester',ensureGuest, mostrarPaginaRegisterTester);

router.post('/register',ensureGuest, criarUsuario );

router.post('/register/tester',ensureGuest, criarUsuarioTester);

router.post('/login',ensureGuest, lidarLogin);

router.get(
	'/login/google',
	ensureGuest,
	passport.authenticate('google', {
		scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'],
	})
);

//Google OAuth Callback
router.get(
	'/login/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login',
	}),
	(req, res) => {
		res.redirect('/dashboard');
	}
);

router.get('/logout', ensureAuthenticated, logout);

router.get('/deletar', ensureAuthenticated, deletarConta);

module.exports = router;
