'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DiscountSchema = new Schema({
	user: { type: String },
	coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
	start: { type: Date, default: Date.now },
	end: Date,
});

mongoose.model('Discount', DiscountSchema);