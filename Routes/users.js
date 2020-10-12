const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {
	criarUsuario,
	mostrarPaginaLogin,
	mostrarPaginaRegister,
	lidarLogin,
	logout,
} = require('../Controllers/users');
const {ensureGuest, ensureAuthenticated} = require('../Config/auth');
const passport = require('passport');

router.get('/login', mostrarPaginaLogin, ensureGuest);

router.get('/register', mostrarPaginaRegister, ensureGuest);

router.post('/register', criarUsuario, ensureGuest);

router.post('/login', lidarLogin, ensureGuest);

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

module.exports = router;
