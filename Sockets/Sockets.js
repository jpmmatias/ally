let io = require('socket.io')();
let rooms = {};
let lobbys = {};
io.on('connection', function (socket) {
	console.log('Socket.io conectado'.green.bold);
	//---------------------Video chamada-------------------------
	let id;
	let chamada = false;
	socket.on('join room', (roomID) => {
		chamada = true;
		console.log('entrou na sala'.green.bold);
		socket.emit('criarOutroUserVideo');
		if (rooms[roomID]) {
			rooms[roomID].push(socket.id);
		} else {
			rooms[roomID] = [socket.id];
		}
		const otherUser = rooms[roomID].find((id) => id !== socket.id);
		if (otherUser) {
			socket.emit('other user', otherUser);
			console.log('outro usuário entrou')
			socket.to(otherUser).emit('user joined', socket.id);
		}
	});
	socket.on('backUserVideo', (roomID) => {
		const otherUser = rooms[roomID].find((id) => id !== socket.id);
		if (otherUser) {
			socket.emit('other user back', otherUser);
			socket.to(otherUser).emit('user joined', socket.id);
		}
	});

	socket.on('roomID', (roomID) => {
		id = roomID;
	});

	socket.on('offer', (payload) => {
		io.to(payload.target).emit('offer', payload);
	});

	socket.on('answer', (payload) => {
		io.to(payload.target).emit('answer', payload);
	});

	socket.on('ice-candidate', (incoming) => {
		io.to(incoming.target).emit('ice-candidate', incoming.candidate);
	});

	socket.on('disconnect', () => {
		if (chamada) {
			console.log(rooms);
			const otherUser = rooms[id].find((id) => id !== socket.id);
			rooms[id] = [otherUser];
			socket.to(otherUser).emit('userLeft');
		}
	});

});

module.exports = io;
