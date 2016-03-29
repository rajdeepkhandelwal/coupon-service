'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DiscountSchema = new Schema({
	user: { type: String, required: true },
	code: { type: String, required: true },
	coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
	start: { type: Date, default: Date.now },
	end: Date,
});

//DiscountSchema.index({ user: 1, code: 1 }, { unique: true })

mongoose.model('Discount', DiscountSchema);