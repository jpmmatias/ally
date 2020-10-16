const mongoose = require('mongoose');

const TesteSchema = new mongoose.Schema({
	nome: {
		type: String,
		trim: true,
		required: true,
	},
	descricao: {
		type: String,
	},
	tarefas: {
		type: [String],
	},
	url: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	data: {
		type: Date,
		default: Date.now,
	},
});

const Teste = mongoose.model('Teste', TesteSchema);

module.exports = Teste;
