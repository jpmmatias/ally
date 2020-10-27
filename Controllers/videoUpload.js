const express = require('express');

//Modelo Teste
const Teste = require('../Models/Teste');

//Modelo User
const User = require('../Models/User');




//descrição         Upload de gravação
//route             POST testes/:id/chamada/videoUpload
//Acesso            Privado
exports.videoUpload = (req, res, next) => {
    console.log(req.body)
    console.log(req.file)
    res.json({status:'ok'})
};

