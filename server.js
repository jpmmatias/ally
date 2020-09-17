const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Config geral
dotenv.config({path: '/Config/config.env'});

//Passport config
require('./Config/passport')(passport);

//DB
const db = require('./Config/keys').MongoURI;

//Connect to Mongo
mongoose
	.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(console.log('MongoDB conctado'))
	.catch((err) => console.log(err));

//EJS
app.use(expressEjsLayouts);
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Conect-flash
app.use(flash());

//Variaveis globais
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//Routes
app.use('/', require('./Routes/index'));
app.use('/users', require('./Routes/users'));

const PORT = process.env.PORT || 5000;

//Logging
if ((process.env.NODE_ENV = 'desenvolvimento')) {
	app.use(morgan('dev'));
}

app.listen(PORT, () => {
	console.log(
		`O servidor foi iniciado no modo ${process.env.NODE_ENV} na porta ${PORT}`
	);
});
