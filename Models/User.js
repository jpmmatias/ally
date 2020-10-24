const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	senha: {
		type: String,
		required: true,
	},
	imagem: {
		type: String,
		required: false,
	},
	tipo: {
		type: String,
		enum: ['tester', 'empresa'],
		default: 'empresa'
	},
	mandarConvite:[{
		userNomeTester:{type: String, default:''}, 
		testerIdTester: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		testeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Teste'},
		_id: false 
		}],
	convites:[{
		userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		testeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Teste'},
		userNome: {type: String, default: ''},
		testeNome: {type: String, default: ''},
		_id: false 
	}],
	testesAceitos:[{
		userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		testeId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		userNome: {type: String, default: ''},
		testeNome: {type: String, default: ''},	
		_id: false 
	}],
	data: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
