const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const expshbs = require('express-handlebars');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const methodOverride = require('method-override');
//const helmet = require('helmet');
const colors = require('colors');

//testeeeeeeeeeee

//Config geral
dotenv.config({path: '/Config/config.env'});

//Pastas de arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Uploads')));



//Helmet middleware (Segurança do site)
//app.use(helmet());

//Bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Method Override
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

//Passport config
require('./Config/passport')(passport);

//DB
const db = require('./Config/keys').MongoURI;

//Conectar com Mongo
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(console.log('MongoDB conctado'.cyan.bold))
	.catch((err) => console.log(err));

//Handlebars Helper
const {formatarData, tipoDiferente,stringfy,ifCond} = require('./Helpers/hbs');

//Handlebars
app.engine(
	'.hbs',
	expshbs({
		helpers: {formatarData, tipoDiferente,stringfy,ifCond},
		defaultLayout: 'main',
		extname: '.hbs',
	})
);
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', '.hbs');

//Express session
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({mongooseConnection: mongoose.connection}),
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
app.use('/testes', require('./Routes/testes'));
app.use('/calendario', require('./Routes/calendario'));


const PORT = process.env.PORT || 5000;

//Logging
if ((process.env.NODE_ENV = 'desenvolvimento')) {
	app.use(morgan('dev'));
}

app.use(function (req, res, next) {
	res.status(404);
	res.render('Erros/404');
});

app.use('/favicon.ico', (req, res, next) => {
    console.log('favicon handler');
    res.sendStatus(200);
});

const server = app.listen(PORT, () => {
	console.log(
		`O servidor foi iniciado no modo ${process.env.NODE_ENV} na porta ${PORT}`
			.yellow.bold
	);
});

//----------------Socket.io------------------

//Iniciando servidor para o socket io
const io = require('./Sockets/Sockets');
io.attach(server);

//Error
process.on('unhandledRejection', (err, promisse) => {
	console.log(`Error: ${err.message}`.red);
	//Close server & exit process
	server.close(() => process.exit(1));
});
