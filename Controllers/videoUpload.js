const express = require('express');

//Modelo Teste
const Teste = require('../Models/Teste');

//Modelo User
const User = require('../Models/User');

const fs = require('fs');





//descrição         Upload de gravação
//route             POST testes/:id/chamada/videoUpload
//Acesso            Privado
exports.videoUpload = (req, res, next) => {
    res.json({status:'ok'})
};

