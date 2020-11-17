const invitesBtns = document.querySelectorAll('.btnConvidar');

const pegarID = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[5];
	return ROOM_ID;
};

let mandarConvite = (nome, btnId) => {
	alert('hi');
	console.log(btnId);
	let id = pegarID();
	fetch(`http://localhost:5000/testes/add/${id}/convidar/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			nome: nome
		})
	})
		.then((data) => {
			console.log('Request success: ', data);
		})
		.catch((err) => {
			console.log('Request failure: ', err);
		});
};

let aceitarConvite = (userNome, userId, testeNome, testeId) => {
	fetch(`http://localhost:5000/testes/add/${testeId}/convidar/aceitar`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userNome: userNome,
			userId: userId,
			testeNome: testeNome,
			testeId: testeId
		})
	})
		.then((data) => {
			console.log('Request success: ', data);
		})
		.catch((err) => {
			console.log('Request failure: ', err);
		});
};

let recusarConvite = (userNome, userId, testeNome, testeId) => {
	fetch(`http://localhost:5000/testes/add/${testeId}/convidar/recusar`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userNome: userNome,
			userId: userId,
			testeNome: testeNome,
			testeId: testeId
		})
	})
		.then((data) => {
			console.log('Request success: ', data);
		})
		.catch((err) => {
			console.log('Request failure: ', err);
		});
};

invitesBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		btn.style.backgroundColor = '#3B1AE3';
		btn.style.color = '#fff';
		btn.style.cursor = 'auto';
		btn.innerHTML = 'Convidado';

		let id = pegarID();
		fetch(`http://localhost:5000/testes/add/${id}/convidar/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nome: btn.id
			})
		})
			.then((data) => {
				console.log('Request success: ', data);
			})
			.catch((err) => {
				console.log('Request failure: ', err);
			});
	});
});
