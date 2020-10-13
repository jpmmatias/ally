exports = module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		console.log('conectado sockets');
		socket.on('event', function () {
			console.log('event triggered');
		});
	});
};
