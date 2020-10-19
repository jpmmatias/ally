const moment = require('moment');
module.exports = {
	//Formata a data através do moment.js
	formatarData: function (data, formato) {
		return moment(data).format(formato);
	},

	//Retorna a variavel caso seja o valor
	tipoDiferente: function (variable, value) {
		if (typeof variable != value) {
			return variable;
		} else {
			return '';
		}
	},

	//Retorna JSON
	stringfy:function(context) {
		return JSON.stringify(context);
	},



};
