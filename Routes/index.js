const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../Config/auth');

router.get('/', (req, res) => {
	res.render('homepage');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
	res.render('dashboard', {
		nome: req.user.nome,
	});
});

module.exports = router;
