let io = require('socket.io')();
let twillioAuthToken = process.env.LOCAL_AUTH_TOKEN;
let twillioAccountSID = process.env.LOCAL_TWILLIO_SID;
const twilio = require('twilio')(twillioAccountSID, twillioAuthToken);

// Função de loggin simples para adicionar o nome da sala
function logIt(msg, room) {
	if (room) {
		console.log(room + ': ' + msg);
	} else {
		console.log(msg);
	}
}
// Quando um soquete se conecta, configure os ouvintes específicos que usaremos.
io.sockets.on('connection', function(socket) {
	console.log('Scokets online');
	// Quando um cliente tenta entrar em uma sala, só permita que ele seja o primeiro ou
	// segundo na sala. Caso contrário, está cheio.
	socket.on('join', function(room) {
		logIt('Um cliente entrou na sala', room);
		let clients = io.sockets.adapter.rooms[room];
		let numClients = typeof clients !== 'undefined' ? clients.length : 0;
		if (numClients === 0) {
			socket.join(room);
		} else if (numClients === 1) {
			socket.join(room);
			// Quando o cliente é o segundo a entrar na sala, ambos os clientes estão prontos.
			logIt('Broadcasting ready message', room);
			// O primeiro a entrar na chamada inicia a chamada
			socket.broadcast.to(room).emit('willInitiateCall', room);
			socket.emit('ready', room).to(room);
			socket.broadcast.to(room).emit('ready', room);
		} else {
			logIt('sala já cheia', room);
			socket.emit('full', room);
		}
	});

	// Ao receber  token, use a API REST do Twilio para solicitar um
	// token para obter credenciais efêmeras para usar o servidor TURN.
	socket.on('token', function(room) {
		logIt('Pedido de token recebido', room);
		twilio.tokens.create(function(err, response) {
			if (err) {
				logIt(err, room);
			} else {
				logIt('Token gerado. Retornando ao cliente do navegador', room);
				socket.emit('token', response).to(room);
			}
		});
	});

	// Retransmitir mensagens candidatas
	socket.on('candidate', function(candidate, room) {
		logIt('Candidato recebido. Transmitindo...', room);
		socket.broadcast.to(room).emit('candidate', candidate);
	});

	// Relay oferece
	socket.on('offer', function(offer, room) {
		logIt('Oferta Recebida. Transmitindo...', room);
		socket.broadcast.to(room).emit('offer', offer);
	});

	// Relay respostas
	socket.on('answer', function(answer, room) {
		logIt('Resposta recebida. Transmitindo...', room);
		socket.broadcast.to(room).emit('answer', answer);
	});
});

module.exports = io;
