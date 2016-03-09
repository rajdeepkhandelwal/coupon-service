'use strict';

module.exports = {

	isAuthenticated: function (req, res, next) {
		if (process.env.API_PASSWORD && req.query.password === process.env.API_PASSWORD) {
			return next();
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	}

}