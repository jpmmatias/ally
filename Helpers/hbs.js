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

	//Retorna string
	stringfy:function(context) {
		return JSON.stringify(context);
	},

	//Retorn equal
	ifCond: function(v1, v2, options) {
		if(v1 === v2) {
		  return options.fn(this);
		}
		return options.inverse(this);
	  }



};
