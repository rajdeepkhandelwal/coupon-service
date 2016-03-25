var express = require('express'),
	config = require('./config'),
	glob = require('glob'),
	mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + config.db);
});

console.log('ROOT', config.root);

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
	require(model);
});
var app = express();

require('./express')(app, config);

console.log('coupon-service running on http://localhost:' + (process.env.PORT || config.port));
app.listen(process.env.PORT || config.port);