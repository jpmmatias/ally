const anotacao = document.querySelector('#anotacoes input[type="text"]');
const formulario = document.querySelector('#anotacoes form');
const anotacoesTods = document.querySelector('#anotacoes #todasAnotacoes ul');

const pegarIDD = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[4];
	return ROOM_ID;
};

const mandarAnotacao = () => {
	let id = pegarIDD();
	let li = document.createElement('li');
	let horario = document.createElement('div');
	let conteudo = document.createElement('div');
	let anotacaoValor = anotacao.value;
	conteudo.innerText = anotacaoValor;
	horario.innerText = new Date().toLocaleTimeString('pt-BR', {
		hour: 'numeric',
		minute: 'numeric'
	});
	li.appendChild(horario);
	li.appendChild(conteudo);
	anotacoesTods.appendChild(li);
	setTimeout(() => li.classList.add('animacaoAnotacao'), 100);
	return fetch(`https://allyticc.herokuapp.com//testes/${id}/chamada/anotacao`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ anotacao: anotacaoValor })
	})
		.then((res) => {
			anotacao.value = '';
		})
		.catch((err) => {
			console.log(err);
		});
};

formulario.addEventListener('submit', (e) => {
	mandarAnotacao();
	e.preventDefault();
});
