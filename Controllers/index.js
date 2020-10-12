const express = require('express');

//Modelo Teste
const Teste = require('../Models/Teste');

//descrição         Mostrar homepage/landingpage (não sei ainda)
//route             GET /
//Acesso            Publico
exports.mostrarHomepage = (req, res, next) => {
	res.render('homepage');
};

//descrição         Mostrar dashboard
//route             GET /dashboard
//Acesso            Privado
exports.mostrarDahboard = async (req, res, next) => {
	try {
		const testes = await Teste.find({user: req.user.id}).lean();
		res.render('dashboard', {
			nome: req.user.nome,
			testes,
		});
	} catch (err) {
		console.log(err);
		res.render('../Views/errors/500');
	}
};
