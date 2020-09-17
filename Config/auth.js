module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Porfavor faça o login primeiro');
		res.redirect('/users/login');
	},
};
