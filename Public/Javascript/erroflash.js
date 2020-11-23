let errsbtn = document.querySelectorAll('.closeBtn');
let alerts = document.querySelectorAll('.alert');
for (let i = 0; i < alerts.length; i++) {
	errsbtn[i].addEventListener('click', () => {
		alerts[i].style.display = 'none';
	});
	errsbtn[i].addEventListener('keydown', (e) => {
		if (e.code === 'Space' || e.code === 'Enter') {
			alerts[i].style.display = 'none';
		}
	});
}

// setTimeout(() => {
// 	erros.forEach((err) => {
// 		err.classList.remove('mostrarErro');
// 		err.classList.add('tirarErro');
// 	});
// }, 5000);

// setTimeout(() => {
// 	erros.forEach((err) => {
// 		err.style.display = 'none';
// 	});
// }, 6000);
