const express = require('express');
const router = express.Router({mergeParams: true});
const {ensureAuthenticated} = require('../Config/auth');
const {
	mostrarSala,
	addAnotacao,
} = require('../Controllers/chamadas');

const videoUploadRouter = require('./videoUpload');

router.use('/videoUpload', videoUploadRouter);

router.get('/', ensureAuthenticated, mostrarSala);

router.post('/anotacao', ensureAuthenticated, addAnotacao);

module.exports = router;
