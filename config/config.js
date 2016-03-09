var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {

	development: {
		root: rootPath,
		app: {
			name: 'coupon-service'
		},
		port: 3014,
		db: 'mongodb://localhost/coupon-service-development'
		
	},

	test: {
		root: rootPath,
		app: {
			name: 'coupon-service'
		},
		port: 3000,
		db: 'mongodb://localhost/coupon-service-test'
		
	},

	production: {
		root: rootPath,
		app: {
			name: 'coupon-service'
		},
		port: 3000,
		db: process.env.MONGOLAB_URI || 'mongodb://localhost/coupon-service-production'

	}

};

module.exports = config[env];