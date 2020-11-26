const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');

//Model
const User = require('../Models/User');
const Teste = require('../Models/Teste');
const Anotacao = require('../Models/Anotacao');
const Video = require('../Models/Video');
const e = require('method-override');
const { Error } = require('mongoose');

//descrição         Mostrar página de login
//route             GET /users/login
//Acesso            Pulico
exports.mostrarPaginaLogin = (req, res, next) => {
	res.render('login', {
		layout: 'loginLayout'
	});
};

//descrição         Lidar com login
//route             POST /users/login
//Acesso            Pulico
exports.lidarLogin = (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
};

//descrição         Logout
//route             GET /users/login
//Acesso            Privado
exports.logout = (req, res, next) => {
	req.logout();
	req.flash('success_msg', 'Você saiu com sucesso');
	res.redirect('/');
};

//descrição         Mostrar página de registrar
//route             GET /users/register
//Acesso            Pulico
exports.mostrarPaginaRegister = (req, res, next) => {
	res.render('register', {
		layout: 'loginLayout'
	});
};

//descrição         Cria nova conta
//route             POST /users/register
//Acesso            Pulico
exports.criarUsuario = (req, res, next) => {
	const { nome, email, senha, senha2 } = req.body;
	let erros = [];

	//Checando os requisitados
	if (!nome || !email || !senha || !senha2) {
		erros.push({
			msg: 'Por favor preencha todos os campos'
		});
	}

	//Checando se as senhas são iguais
	if (senha !== senha2) {
		erros.push({
			msg: 'Senhas não estão iguais'
		});
	}

	//Checando tamanho da senha
	if (senha.length < 6) {
		erros.push({
			msg: 'Senha deve ter no minimo 6 caracteres'
		});
	}

	if (erros.length > 0) {
		console.log(erros);
		res.render('register', {
			layout: 'loginLayout',
			erros,
			nome,
			email,
			senha,
			senha2,
		});
	} else {
		//Passou na validação
		User.findOne({ email: email }).then((user) => {
			if (user) {
				//Usuário ja existe
				erros.push({ msg: 'Email ja foi registrado' });
				res.render('register', {
					layout: 'loginLayout',
					erros,
					nome,
					email,
					senha,
					senha2
				});
			} else {
				const novoUser = new User({
					nome,
					email,
					senha
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
};

//descrição         Mostrar página de registrar tester
//route             GET /users/register/tester
//Acesso            Pulico
exports.mostrarPaginaRegisterTester = (req, res, next) => {
	res.render('register', {
		layout: 'loginLayout',
		tester: 'tester'
	});
};

//descrição         Cria nova conta para tester
//route             POST /users/register/tester
//Acesso            Pulico
exports.criarUsuarioTester = (req, res, next) => {
	const { nome, email, senha, senha2, profissao, idade } = req.body;
	let erros = [];

	//Checando os requisitados
	if (!nome || !email || !senha || !senha2) {
		erros.push({
			msg: 'Por favor preencha todos os campos'
		});
	}

	//Checando se as senhas são iguais
	if (senha !== senha2) {
		console.log('erro senha n igual');

		erros.push({
			msg: 'Senhas não estão iguais'
		});
	}

	//Checando tamanho da senha
	if (senha.length < 6) {
		console.log('erro senha');

		erros.push({
			msg: 'Senha deve ter no minimo 6 caracteres'
		});
	}

	if (erros.length > 0) {
		console.log(erros);
		res.render('register', {
			layout: 'loginLayout',
			erros,
			nome,
			email,
			senha,
			senha2
		});
	} else {
		//Passou na validação
		User.findOne({ email: email }).then((user) => {
			if (user) {
				//Usuário ja existe
				erros.push({ msg: 'Email ja foi registrado' });
				console.log('erro');
				res.render('register', {
					layout: 'loginLayout',
					erros,
					nome,
					email,
					senha,
					senha2
				});
			} else {
				const novoUser = new User({
					nome,
					email,
					senha,
					tipo: 'tester',
					profissao,
					idade
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
};

//descrição         Deletar conta
//route             DELETE /users/delete
//Acesso            privado
exports.deletarConta = async (req, res, next) => {
	try {
		await User.deleteOne({ _id: req.user._id });
		await Video.deleteMany({ user: req.user._id });
		let testes = await Teste.find({ user: req.user._id });
		testes.forEach(async (teste) => {
			await Anotacao.deleteMany({ teste: teste._id });
			await Teste.deleteOne({ _id: teste._id });
		});
		req.logout();
		res.redirect('/');
	} catch (err) {
		console.log(err);
	}
};

//descrição         	Atualizar user
//route             	PUT /users/atualizar
//Acesso            	privado
exports.atualizarConta = async (req, res, next) => {
	try {
		await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
			new: true
		});
		res.json('deu certo');
	} catch (err) {
		console.log(err);
		res.json('deu errado');
	}
};

//descrição         Cria nova conta para tester
//route             POST /users/register/tester
//Acesso            Pulico
exports.criarUsuarioTester = (req, res, next) => {
	const { nome, email, senha, senha2, idade, profissao } = req.body;
	let erros = [];

	//Checando os requisitados
	if (!nome || !email || !senha || !senha2 ) {
		erros.push({
			msg: 'Por favor preencha todos os campos'
		});
	}

	//Checando se as senhas são iguais
	if (senha !== senha2) {
		console.log('erro senha n igual');

		erros.push({
			msg: 'Senhas não estão iguais'
		});
	}

	//Checando tamanho da senha
	if (senha.length < 6) {
		console.log('erro senha');

		erros.push({
			msg: 'Senha deve ter no minimo 6 caracteres'
		});
	}

	if (erros.length > 0) {
		console.log(erros);
		res.render('register', {
			layout: 'loginLayout',
			erros,
			nome,
			email,
			senha,
			senha2,
			idade,
			profissao
		});
	} else {
		//Passou na validação
		User.findOne({ email: email }).then((user) => {
			if (user) {
				//Usuário ja existe
				erros.push({ msg: 'Email ja foi registrado' });
				console.log('erro');
				res.render('register', {
					layout: 'loginLayout',
					erros,
					nome,
					email,
					senha,
					senha2,
					idade,
					profissao
				});
			} else {
				const novoUser = new User({
					nome,
					email,
					senha,
					tipo: 'tester',
					idade,
					profissao
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
};
