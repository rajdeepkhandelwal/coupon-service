'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Discount = mongoose.model('Discount');

module.exports = {

	// List all Discounts
	list: function (req, res, next) {
		var searchQuery = {};
		if (req.query.from) {
			var currentTime = new Date();
			searchQuery = { dateCreated: { "$gte": new Date(req.query.from), "$lt": currentTime } };
		}

		Discount.find(searchQuery, null, { sort: {dateCreated: -1} }, function (err, discounts) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(discounts);
			}
		});
	},

	// Show a Discount
	read: function (req, res, next) {
		Discount.findById(req.params.id, function (err, discount) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(discount);
			}
		});
	},

	// Create new Discount
	create: function (req, res, next) {
		var newDiscount = new Discount(req.body);
		newDiscount.save(function (err) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(newDiscount);
			}
		});
	},

	// Update a Discount
	update: function (req, res, next) {
		Discount.update(
			{ _id: req.params.id },
			req.body,
			function (updateErr, numberAffected, rawResponse) {
				if (updateErr) {
					res.json(500, updateErr);
				}
				else {
					res.json(200, 'Updated discount ' + req.params.id);
				}
			}
		);
	},

	// Delete a Discount
	delete: function (req, res, next) {
		var searchParams;
		if (req.params.id === 'ALL') {
			searchParams = {};
		}
		else {
			searchParams = { _id: req.params.id }
		}

		Discount.remove(
			searchParams,
			function(discountErr, numberAffected, rawResponse) {
				if (discountErr) {
					res.json(500, discountErr);
				}
				else {
					res.json(200, 'Deleted ' + numberAffected + ' discounts');
				}
			}
		);
	}

}