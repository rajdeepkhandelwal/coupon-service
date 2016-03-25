var express = require('express'),
	config = require('./config'),
	glob = require('glob'),
	mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
	require(model);
});

var app = express();
require('./express')(app, config);

module.exports = app;
module.exports.closeDatabase = function () {
	mongoose.connection.close();
}