//Modelo Teste
const Teste = require('../Models/Teste');

//descrição         Mostrar calendário
//route             GET /
//Acesso            Privado
exports.mostrarCalendario =  (req, res, next) => {
    
	try {
        res.render('calendario');
    }
    catch (err) {
		console.log(err);
        return res.render('Erros/404');
    }
}

//descrição         Pegar dados pro calendario
//route             GET /data
//Acesso            Privado

exports.mostrarDadosProCalendario =  async (req, res, next) => {
    let ObjectId = require('mongoose').Types.ObjectId; 
	try {
        let todosTestes =[]
        Teste.find({ user: { $eq:new ObjectId(`${req.session.passport.user}`)}}, function(err, testes) {
            testes.forEach(teste => {
                todosTestes.push(teste)
            });
            res.send(todosTestes);
           
    })}
    catch (err) {
		console.log(err);
        return res.render('Erros/404');
    }}