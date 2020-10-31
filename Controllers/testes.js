const express = require('express');

//Modelo Teste
const Teste = require('../Models/Teste');

//Modelo User
const User = require('../Models/User');

let ObjectId = require('mongodb').ObjectID;

//descrição         Mostrar pagina para adicionar teste
//route             GET /testes/add
//Acesso            Privado
exports.mostrarPaginaAddTeste = (req, res, next) => {
	res.render('Testes/add');
};

// (Mon Jan 02 2012 00:00:00 GMT+0100 (CET))
//descrição         Adicionar teste
//route             POST /testes
//Acesso            Privado
exports.addTeste = async (req, res, next) => {
	try {
		const dataMarcadaSeFormatacao = new Date(`${req.body.diaMarcado} ${req.body.horarioMarcado} GMT-3`)
		var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
		var dataMarcada = (new Date(dataMarcadaSeFormatacao - tzoffset)).toISOString().slice(0, -1);
		console.log(dataMarcada)
		req.body.user = req.user.id;
		let novoTeste = await Teste.create({nome:req.body.nome,descricao:req.body.descricao,tarefas:req.body.tarefas,url:req.body.url,user:req.body.user,dataMarcada:dataMarcada});
		res.redirect(`testes/add/${novoTeste._id}/convidar/`);
	} catch (err) {
		console.log(err);
		res.render('Erros/500');
	}
};

//descrição         Mostrar um teste
//route             GET /testes/:id
//Acesso            Privado
exports.mostrarEspecificoTeste = async (req, res, next) => {
	try {
		const id = req.params.id;
		let teste = await Teste.findById(req.params.id).populate('user').lean();
		if (!teste) {
			return res.render('Erros/404');
		} else {
			res.render('../Views/testes/teste', {
				teste,
			});
		}
	} catch (err) {
		console.log(err);
		return res.render('Erros/404');
	}
};

//descrição         Mostrar pagina para editar teste
//route             GET /testes/editar/:id
//Acesso            Privado
exports.mostrarPaginaPraEditar = async (req, res, next) => {
	try {
		const teste = await Teste.findOne({
			_id: req.params.id,
		}).lean();

		if (!teste) {
			return res.render('Erros/404');
		}

		if (teste.user != req.user.id) {
			res.redirect('/dashboard');
		} else {
			res.render('../Views/testes/edit', {
				teste,
			});
		}
	} catch (err) {
		console.log(err);
		return res.render('Erros/500');
	}
};

//descrição         Mostrar pagina para editar teste
//route             PUT /testes/editar/:id
//Acesso            Privado
exports.editarTeste = async (req, res, next) => {
	try {
		let teste = await Teste.findById(req.params.id).lean();

		if (!teste) {
			return res.render('Erros/404');
		}
		if (teste.user != req.user.id) {
			res.redirect('/dashboard');
		} else {
			teste = await Teste.findOneAndUpdate({_id: req.params.id}, req.body, {
				new: true,
				runValidators: true,
			});
		}
		res.redirect('/dashboard');
	} catch (err) {
		console.log(err);
		return res.render('Erros/500');
	}
};

//descrição         Mostrar pagina para editar teste
//route             DELETE /testes/editar/:id
//Acesso            Privado
exports.deletarTeste = async (req, res, next) => {
	try {
		await Teste.remove({_id: req.params.id});
		res.redirect('/dashboard');
	} catch (err) {
		console.log(err);
		return res.render('Erros/500');
	}
};


