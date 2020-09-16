const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`O server foi iniciado na porta ${PORT}`);
});
