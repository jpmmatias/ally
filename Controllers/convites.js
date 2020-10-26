const express = require('express');

//Modelo Teste
const Teste = require('../Models/Teste');

//Modelo User
const User = require('../Models/User');

let ObjectId = require('mongodb').ObjectID;


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
//route             POST /testes/add/:id/convidar/
//Acesso            Privado
exports.convidarTester = async (req, res, next) => {
	let nome = req.body.nome
	let userCridadorId = req.user.id
	let testeId=req.params.id
	try {
		const teste = await Teste.findById(testeId).lean();
		if (!teste) {
			return res.render('Erros/404');
		}
		 else if  (teste.user != userCridadorId) {
		 	return res.redirect('/dashboard');
		 } else{
			let tester = await User.findOne({nome:nome})
			if (!tester) {
				return res.render('Erros/404');
			} else{
				let testerId = tester._id
				let updateUserCridador= {
				mandarConvite:{userNomeTester:nome, testerIdTester:tester._id,testeId:teste._id}
				}
				let filterCria = new Array(  {userNomeTester:nome, testerIdTester: tester._id,testeId:teste._id} );
		 		let userCriador = await User.findOneAndUpdate({_id: userCridadorId,mandarConvite:{ $nin :filterCria}},{ $push :updateUserCridador},{
		 			new: true	 
		 		  }).lean();
				   
				  if (!userCriador) {
					return res.redirect('/dashboard');
			  		} else{
						let updateTester = {
							convites:{userId:userCridadorId,testeId:teste._id,userNome:req.user.nome,testeNome:teste.nome}
							}
						tester = await User.findOneAndUpdate({nome:nome,_id:testerId},{$push:updateTester})
						return res.end()
				  	}
			}		 	
		}
	} catch (err) {
		console.log(err)
		return res.render('Erros/500');
	}
};

//descrição         Aceitar convite
//route             POST /testes/add/:id/convidar/aceitar
//Acesso            Privado
exports.aceitarConviteTeste = async (req, res, next) => {
	 const {userNome,userId,testeNome,testeId}=req.body
	 const {nome,_id}=req.user
	 try {
		let filtroTester={nome:nome,_id:_id}
		let filtroUser={nome:userNome,_id:userId}
		let testerConvite={userId:userId,testeId:testeId,userNome:userNome,testeNome:testeNome}
		let userCriadorMandarConvite={userNomeTester:nome,testerIdTester:_id,testeId:testeId}

		let tester = await User.findOneAndUpdate(filtroTester,{$pull:{convites:testerConvite}},{new:true}) 
		let userCriador=await User.findOneAndUpdate(filtroUser,{$pull:{mandarConvite:userCriadorMandarConvite}},{new:true})
		tester = await User.findOneAndUpdate(filtroTester,{$push:{testesAceitos:testerConvite}},{new:true}) 
		return res.end()
		 
	 } catch (err) {
		console.log(err)
		return res.render('Erros/500');
	 }
	
};

//descrição         Aceitar convite
//route             POST /testes/add/:id/convidar/recusar
//Acesso            Privado
exports.recusarConviteTeste = async (req, res, next) => {
	const {userNome,userId,testeNome,testeId}=req.body
	const {nome,_id}=req.user
	try {
	   let filtroTester={nome:nome,_id:_id}
	   let filtroUser={nome:userNome,_id:userId}
	   let testerConvite={userId:userId,testeId:testeId,userNome:userNome,testeNome:testeNome}
	   let userCriadorMandarConvite={userNomeTester:nome,testerIdTester:_id,testeId:testeId}
	   let tester = await User.findOneAndUpdate(filtroTester,{$pull:{convites:testerConvite}},{new:true}) 
	   let userCriador=await User.findOneAndUpdate(filtroUser,{$pull:{mandarConvite:userCriadorMandarConvite}},{new:true})
	   return res.end()
		
	} catch (err) {
	   console.log(err)
	   return res.render('Erros/500');
	}
   
};