module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error_msg', 'Porfavor faça o login primeiro');
			res.redirect('/users/login');
		}
	},
	ensureGuest: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/dashboard');
		} else {
			return next();
		}
	},
};
