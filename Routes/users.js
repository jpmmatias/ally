const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Model
const User = require('../Models/User');

//Pagina de Login
router.get('/login', (req, res) => {
	res.render('login');
});

//Pagina para criar conta
router.get('/register', (req, res) => {
	res.render('register');
});

//Criar nova conta
router.post('/register', (req, res) => {
	const {nome, email, senha, senha2} = req.body;
	let erros = [];

	//Checando os requisitados
	if (!nome || !email || !senha || !senha2) {
		erros.push({
			msg: 'Por favor preencha todos os campos',
		});
	}

	//Checando se as senhas são iguais
	if (senha !== senha2) {
		erros.push({
			msg: 'Senhas não estão iguais',
		});
	}

	//Checando tamanho da senha
	if (senha.length < 6) {
		erros.push({
			msg: 'Senha deve ter no minimo 6 caracteres',
		});
	}

	if (erros.length > 0) {
		res.render('register', {
			erros,
			nome,
			email,
			senha,
			senha2,
		});
	} else {
		//Passou na validação
		User.findOne({email: email}).then((user) => {
			if (user) {
				//Usuário ja existe
				erros.push({msg: 'Email ja foi registrado'});
				res.render('register', {
					erros,
					nome,
					email,
					senha,
					senha2,
				});
			} else {
				const novoUser = new User({
					nome,
					email,
					senha,
				});

				//Hash senha
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(novoUser.senha, salt, (err, hash) => {
						if (err) {
							throw err;
						} else {
							novoUser.senha = hash;

							//Salvando usuário na DB
							novoUser
								.save()
								.then((user) => {
									req.flash('success_msg', 'Você foi registrado com sucesso!');
									res.redirect('/users/login');
								})
								.catch((err) => console.log(err));
						}
					})
				);
			}
		});
	}
});

//Lidar com o Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
});

//Lidar com o Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'Você saiu com sucesso');
	res.redirect('/users/login');
});
module.exports = router;
