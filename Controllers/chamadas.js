//Modelo Teste
const Teste = require('../Models/Teste');

//descrição         Mostrar sala da chamada
//route             GET /
//Acesso            Privado
exports.mostrarSala = async (req, res, next) => {
	try {
		let teste = await Teste.findById(req.params.id).populate('user').lean();
		if (!teste) {
			return res.render('Erros/404');
		} else {
			res.render('Chamadas/sala', {
				teste,
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
	try {
		let teste = await Teste.findById(req.params.id).populate('user').lean();
		if (!teste) {
			return res.render('Erros/404');
		} else {
			res.render('Chamadas/lobby', {
				teste,
			});
		}
	} catch (err) {
		console.log(err);
		return res.render('Erros/404');
	}
};
