const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../Models/User');

module.exports = function (passport) {
	passport.use(
		'local',
		new LocalStrategy({usernameField: 'email'}, (email, senha, done) => {
			User.findOne({email: email})
				.then((user) => {
					if (!user) {
						return done(null, false, {message: 'Email não registrado'});
					}
					bcrypt.compare(senha, user.senha, (err, isMatch) => {
						if (err) {
							throw err;
						}
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, {message: 'Senha incorreta'});
						}
					});
				})
				.catch((err) => console.log(err));
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};
