//Modelo Teste
const Teste = require('../Models/Teste');

//Model User
const User = require('../Models/User');

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
		const user = await User.findOne({_id:req.user.id}).lean()
		res.render('dashboard', {
			nome: req.user.nome,
			tipo:req.user.tipo,
			convites:user.convites,
			testes,
		});
	} catch (err) {
		console.log(err);
		res.render('../Views/errors/500');
	}
};
