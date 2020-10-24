//Modelo Teste
const Teste = require('../Models/Teste');
const User = require('../Models/User');

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
    const result = (data)=>{
       // await .send(data)
       console.log(data)
    }
	try {
        if (req.user.tipo==="tester") {
            const {testesAceitos} = req.user
            Promise.all(testesAceitos.map(teste =>  Teste.findOne({ user:new ObjectId(teste.userId) ,_id: new ObjectId(teste.testeId)})))
            .then((todosTestes) => {
                res.send(todosTestes);
            })
            .catch((err) => {
                console.log(err)
                })
            } else{
            let todosTestes =[]
            Teste.find({ user: { $eq:new ObjectId(`${req.session.passport.user}`)}}, function(err, testes) {
                testes.forEach(teste => {
                    todosTestes.push(teste)
                });
                res.send(todosTestes);
               })
        }}
    catch (err) {
		console.log(err);
        return res.render('Erros/404');
    }}