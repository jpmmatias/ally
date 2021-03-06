//Modelo Teste
const Teste = require('../Models/Teste');

//Modelo Anotação
const Anotacao = require('../Models/Anotacao');

//descrição         Mostrar sala da chamada
//route             GET /
//Acesso            Privado
exports.mostrarSala = async (req, res, next) => {
	let tester;
	try {
		let id = req.params.id;
		if (req.user.tipo === 'tester') {
			tester = true;
		} else {
			tester = false;
		}
		let teste = await Teste.findById(req.params.id).populate('user').lean();
		if (!teste) {
			return res.render('Erros/404');
		} else {
			res.render('Chamadas/sala', {
				teste,
				id,
				tester
			});
		}
	} catch (err) {
		console.log(err);
		return res.render('Erros/404');
	}
};

//descrição         Adicionar anotação
//route             POST /testes/:id/chamada/anotacao
//Acesso            Privado
exports.addAnotacao = async (req, res, next) => {
	try {
		await Anotacao.create({ anotacao: req.body.anotacao, teste: req.params.id });
		res.end();
	} catch (err) {
		console.log(err);
	}
};
