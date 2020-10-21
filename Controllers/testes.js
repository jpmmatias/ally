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

//descrição         Mostrar pagina para convidar testers
//route             Get /testes/add/convidar/:id
//Acesso            Privado
exports.mostrarPaginaDeConvidarTesters = async (req, res, next) => {
	let teste = await Teste.findById(req.params.id).lean();
	try {
		const teste = await Teste.findOne({
		_id: req.params.id,}).lean();
		const users = await User.find({tipo:'tester'}).lean()
		const userCriador = await User.findOne({
			_id: req.user.id,}).lean();

	if (!teste) {
		return res.render('Erros/404');
	}

	if (teste.user != req.user.id) {
		res.redirect('/dashboard');
	} else{
		res.render('Testes/convidarTesters',{teste, userCriador, users});
	}

	} catch (err) {
		console.log(err)
		return res.render('Erros/500');
	}
	
};

//descrição         Convidar Tester
//route             POST /testes/add/convidar/:id
//Acesso            Privado
exports.convidarTester = async (req, res, next) => {
	try {
		let nome = req.body.nome
		let userCridadorId = req.user.id
		const teste = await Teste.findById(req.params.id).lean();
		let tester = await User.findOne({nome:nome}).lean()
		let updateUserCridador={
			mandarConvite:{userNomeTester:nome, testerIdTester:tester._id}
		}
		if (!teste) {
			return res.render('Erros/404');
		}
		else if  (teste.user != req.user.id) {
			res.redirect('/dashboard');
		} else{
			let filterCria = new Array(  {userNomeTester:nome, testerIdTester: new ObjectId(tester._id)} );
			let userCriador = await User.findOneAndUpdate({_id: userCridadorId,mandarConvite:{ $nin :filterCria}},{ $push :updateUserCridador},{
				new: true
				 
			  }).lean();

			  if (!userCriador) {
				  console.log('user criado')
			  }
			  else{
				let updateTester = {
					convites:{userId:userCridadorId,testeId:teste._id,userNome:req.user.nome,testeNome:teste.nome}
				}

				tester = await User.findOneAndUpdate({nome:nome},{ $push:updateTester},{
					new:true
				}).lean()
			  }
			
		}

	} catch (err) {
		console.log(err)
		return res.render('Erros/500');
	}
	
};