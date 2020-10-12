const btnTarefa = document.querySelector('#addTarefaBtn');
const areaTarefas = document.querySelector('.tarefas');

function addTesteInput() {
	const div = document.createElement('div');
	const h5 = document.createElement('h5');
	const textArea = document.createElement('textarea');
	h5.innerText = 'Tarefa';
	textArea.name = 'tarefas';
	div.classList.add('row');
	div.appendChild(h5);
	div.appendChild(textArea);
	areaTarefas.appendChild(div);
}
btnTarefa.addEventListener('click', addTesteInput);
