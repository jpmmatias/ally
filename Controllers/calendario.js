//Modelo Teste
const Teste = require('../Models/Teste');

//descrição         Mostrar calendário
//route             GET /
//Acesso            Privado

exports.mostrarCalendario = async (req, res, next) => {
    let ObjectId = require('mongoose').Types.ObjectId; 
	try {
        let todosTestes =[]
        Teste.find({ user: { $eq:new ObjectId(`${req.session.passport.user}`)}}, function(err, testes) {
            testes.forEach(teste => {
                todosTestes.push(teste)
            });
            res.render('calendario',{
                testes:testes.map(teste => teste.toJSON())
            });
    })}
    catch (err) {
		console.log(err);
        return res.render('Erros/404');
    }
}