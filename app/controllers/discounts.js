'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Discount = mongoose.model('Discount');
var Coupon = mongoose.model('Coupon');

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
				return res.status(400).json(err);
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
				return res.status(400).json(err);
			}
			else {
				return res.json(discount);
			}
		});
	},

	// Create new Discount
	create: function (req, res, next) {
		var couponCode = req.body.code || '';
		Coupon.find({ code: couponCode.toUpperCase() }).exec(function (err, coupons) {
			if (err) {
				return res.status(400).json(err);
			}
			else if (coupons.length === 0) {
				return res.status(404).json('Coupon ‘' + couponCode.toUpperCase() + '’ not found');
			}
			else {
				// Update or create Discount object
				req.body.coupon = coupons[0]._id;
				Discount.update({ code: req.body.code, user: req.body.user }, { $set: req.body }, { upsert: true }, function (err, rowsUpdated) {
					if (err) {
						return res.status(400).json(err);
					}
					else {
						console.log('Applied discount %s to user %s.', req.body.code, req.body.user)
						return res.json(req.body);
					}
				});
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
					res.status(500).json(updateErr);
				}
				else {
					res.status(200).json('Updated discount ' + req.params.id);
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
					res.status(500).json(discountErr);
				}
				else {
					res.status(200).json('Deleted ' + numberAffected + ' discounts');
				}
			}
		);
	}

}