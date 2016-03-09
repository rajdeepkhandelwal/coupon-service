'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CouponSchema = new Schema({
	created: { type: Date, default: Date.now },
	// Qualifiers:
	code: { type: String, unique: true, sparse: true },
	email: { type: String, unique: true, sparse: true },
	// Constraints:
	duration: { type: String, default: 'once' },
	duration_in_months: Number,
	redeem_by: Date,
	max_redemptions: Number,
	times_redeemed: { type: Number, default: 0 },
	// Reward:
	percent_off: Number,
	amount_off: Number,
	currency: String,
	metadata: {},
});

mongoose.model('Coupon', CouponSchema);
