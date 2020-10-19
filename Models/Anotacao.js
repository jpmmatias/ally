const mongoose = require('mongoose');

const AnotacoesSchema = new mongoose.Schema({
	anotacao: {
		type: String,
		required: true,
	},
	teste: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Teste',
	},

	data: {
		type: Date,
		default: Date.now,
	},
});

const Anotacao = mongoose.model('Anotacao', AnotacoesSchema);

module.exports = Anotacao;
