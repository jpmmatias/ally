const btnTarefa = document.querySelector('#addTarefaBtn');
const areaTarefas = document.querySelector('.tarefas');
let nTarefas = 1;

function addTesteInput() {
	const div = document.createElement('div');
	const label = document.createElement('label');
	const textArea = document.createElement('textarea');
	label.innerHTML =`<label for='tarefas'>Tarefa ${nTarefas++}</label> `
	textArea.name = 'tarefas';
	div.appendChild(label);
	div.appendChild(textArea);
	areaTarefas.appendChild(div);
}
btnTarefa.addEventListener('click', addTesteInput);


