const io = require('../Sockets/Sockets');

//Modelo Teste
const Teste = require('../Models/Teste');

//Modelo User
const User = require('../Models/User');

//Modelo Anotação
const Anotacao = require('../Models/Anotacao');

//descrição         Mostrar sala da chamada
//route             GET /
//Acesso            Privado
exports.mostrarSala = async (req, res, next) => {
	try {
		let id = req.params.id;
		let teste = await Teste.findById(req.params.id).populate('user').lean();
		if (!teste) {
			return res.render('Erros/404');
		} else {
			res.render('Chamadas/sala', {
				teste,
				id,
			});
		}
	} catch (err) {
		console.log(err);
		return res.render('Erros/404');
	}
};

//descrição         Mostrar lobby de um teste
//route             GET /
//Acesso            Privado
exports.mostrarLobby = async (req, res, next) => {
	let id = req.params.id;
	try {
		let user = await User.findById(req.session.passport.user);
		let teste = await Teste.findById(req.params.id).populate('user').lean();
		if (!teste) {
			return res.render('Erros/404');
		} else {
			io.emit('entrou no lobby', teste, id, user);
			res.render('Chamadas/lobby', {
				teste,
				id,
				user,
			});
		}
	} catch (err) {
		console.log(err);
		return res.render('Erros/404');
	}
};

//descrição         Adicionar teste
//route             PUT /testes/:id/chamada/anotacao
//Acesso            Privado
exports.addAnotacao = async (req, res, next) => {
	try {
		await Anotacao.create({anotacao: req.body.anotacao, teste: req.params.id});
		res.end();
	} catch (err) {
		console.log(err);
	}
};
