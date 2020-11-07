const btnAnotacao = document.querySelector('.btnanotacao');
const anotacao = document.querySelector('#anotacoes');

const pegarIDD = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[4];
	return ROOM_ID;
};

const mandarAnotacao = ()=> {
	let anotacaoValor = anotacao.value
	let id = pegarIDD()
	return fetch(`http://localhost:5000/testes/${id}/chamada/anotacao`,{
		method: 'POST', 
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		  },
		body: JSON.stringify({anotacao: anotacaoValor})
	}).then((res)=>{
	}).catch(err=>{
		console.log(err)
	})
   }

btnAnotacao.addEventListener('click', mandarAnotacao);
