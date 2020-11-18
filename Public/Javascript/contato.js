const form = document.querySelector('form[action="/contato"]');
const email = document.querySelector('#emailContato');
const nome = document.querySelector('#nomeContato');
const msg = document.querySelector('#mensagemContato');
form.addEventListener('submit', async (e) => {
	e.preventDefault();
	console.log(msg.value);
	if (nome.value !== '' && email.value !== '' && msg.value !== '') {
		try {
			fetch('http://localhost:5000/contato', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					nome: nome.value,
					email: email.value,
					msg: msg.value
				})
			});
			alert('Mensagem Enviada!');
		} catch (err) {
			alert('Ocorreu um erro, porfavor tente novamnete mais tarde');
			console.log(err);
		}
	} else {
		alert('Preencha todos os campos antes de enviar a mensagem');
	}
});
