const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const bcrypt = require('bcryptjs');

const User = require('../Models/User');

module.exports = function(passport) {
	passport.use(
		'local',
		new LocalStrategy({ usernameField: 'username' }, (username, senha, done) => {
			let erros = [];
			User.findOne({ username: username })
				.then((user) => {
					if (!user) {
						erros.push('Username não registrado');
						return done(null, false, { message: erros });
					}
					bcrypt.compare(senha, user.senha, (err, isMatch) => {
						if (err) {
							console.log(err);
							throw err;
						}
						if (isMatch) {
							return done(null, user);
						} else {
							erros.push('Senha incorreta');
							return done(null, false, { message: erros });
						}
					});
				})
				.catch((err) => console.log(err));
		})
	);

	passport.use(
		new GoogleStrategy(
			{
				clientID: keys.GOOGLE_CLIENT_ID,
				clientSecret: keys.GOOGLE_CLIENT_SECRET,
				callbackURL: '/users/login/google/callback'
			},
			async (acessToken, refreshToken, profile, done) => {
				const novoUser = {
					nome: profile.displayName,
					email: profile.emails[0].value,
					senha: profile.id,
					imagem: profile.photos[0].value
				};

				try {
					let user = await User.findOne({ email: profile.emails[0].value });

					if (user) {
						done(null, user);
					} else {
						user = await User.create(novoUser);
						done(null, user);
					}
				} catch (err) {
					console.log(err);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
