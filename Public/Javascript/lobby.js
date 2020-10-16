const socket = io('/');
const ul = document.querySelector('#listadeUsers');
let users = [];

const addPessoa = (user) => {
	let li = document.createElement('li');
	li.innerHTML = `Nome ${user[0]} Email: ${user[1]}`;
	ul.appendChild(li);
};
socket.on('entrou no lobby', (teste, id, user) => {
	ul.innerHTML = '';
	const novoUser = [user.nome, user.email];
	users.push(novoUser);
	users.forEach((user) => {
		addPessoa(user);
	});
	socket.emit('dados do lobby', users);
});
