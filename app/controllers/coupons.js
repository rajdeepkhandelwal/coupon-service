'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Coupon = mongoose.model('Coupon');

var cleanUpCoupon = function (coupon) {
	if (!coupon.code) {
		coupon.code = coupon._id;
	}
	delete coupon['_id'];
	delete coupon['__v'];
	return coupon;
};

module.exports = {

	// List all Coupons
	list: function (req, res, next) {
		var searchQuery = {};
		if (req.query.from) {
			var currentTime = new Date();
			searchQuery = { dateCreated: { "$gte": new Date(req.query.from), "$lt": currentTime } };
		}

		Coupon.find(searchQuery, null, { sort: {dateCreated: -1} }, function (err, coupons) {
			if (err) {
				return res.json(400, err);
			}
			else {
				_.forEach(coupons, cleanUpCoupon);
				return res.json(coupons);
			}
		});
	},

	// Show a Coupon
	read: function (req, res, next) {
		Coupon.findById(req.params.id, function (err, coupon) {
			if (err) {
				return res.json(400, err);
			}
			else {
				coupon = cleanUpCoupon(coupon);
				return res.json(coupon);
			}
		});
	},

	// Create new Coupon
	create: function (req, res, next) {
		var newCoupon = new Coupon(req.body);
		newCoupon.save(function (err) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(newCoupon);
			}
		});
	},

	// Update a Coupon
	update: function (req, res, next) {
		Coupon.update(
			{ _id: req.params.id },
			req.body,
			function (updateErr, numberAffected, rawResponse) {
				if (updateErr) {
					res.json(500, updateErr);
				}
				else {
					res.json(200, 'Updated coupon ' + req.params.id);
				}
			}
		);
	},

	// Delete a Coupon
	delete: function (req, res, next) {
		var searchParams;
		if (req.params.id === 'ALL') {
			searchParams = {};
		}
		else {
			searchParams = { _id: req.params.id }
		}

		Coupon.remove(
			searchParams,
			function(couponErr, numberAffected, rawResponse) {
				if (couponErr) {
					res.json(500, couponErr);
				}
				else {
					res.json(200, 'Deleted ' + numberAffected + ' coupons');
				}
			}
		);
	}

}