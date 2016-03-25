/**
 * Application routes for REST
 */

'use strict';

var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Controllers
	var authController = require(config.root + '/app/controllers/auth');
	var couponsController = require(config.root + '/app/controllers/coupons');

	// Routes
	router.get('/coupons', authController.isAuthenticated, couponsController.list);
	router.get('/coupons/:id', authController.isAuthenticated, couponsController.read);
	router.post('/coupons', authController.isAuthenticated, couponsController.create);
	router.put('/coupons/:id', authController.isAuthenticated, couponsController.update);
	router.delete('/coupons/:id', authController.isAuthenticated, couponsController.delete);

	//router.get('/', startController.index);

};