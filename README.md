# Coupon Service

REST API service for discount coupons/vouchers, built in Node.js.

Inspired by the [Stripe API](https://stripe.com/docs/api#coupons), but sometimes you need coupons without credit cards.
Also supports discounts based on (partial) email addresses, e.g. “everybody @mit.edu”.


## How to Run

Just start with:

	# Set password used in API requests
	export API_PASSWORD=MYPASSWORD

	grunt

Server will default to **http://localhost:3014**


## Entities

### Coupon

* `_id` (string)
* `created` (date)

**Qualifiers:**

* `code` (string): the coupon code. Will be generated if not provided when coupon created.
* `email` (string): a _partial_ email address (e.g. all with ".edu" in email gets the discount).

**Constraints:**

* `duration` (string): One of 'forever', 'once', and 'repeating'. Describes how long a customer who applies this coupon will get the discount.
* `duration_in_months` (positive integer): If duration is 'repeating', the number of months the coupon applies. Null if coupon duration is forever or once.
* `duration_ends` (_read-only_ date): If duration is 'repeating', this is the end date.
* `redeem_by` (date): Date after which the coupon can no longer be redeemed
* `max_redemptions` (positive integer): Maximum number of times this coupon can be redeemed, in total, before it is no longer valid.
* `times_redeemed` (_read-only_ positive integer) or zero: Number of times this coupon has been applied to a customer.
* `valid` (_read-only_ boolean): Taking account of the above properties, whether this coupon can still be applied to a customer

**What is rewarded:**

* `percent_off` (positive integer): Percent that will be taken off the subtotal of any invoices for this customer for the duration of the coupon. For example, a coupon with percent_off of 50 will make a kr100 invoice kr50 instead.
* `amount_off` (positive integer): Amount (in the currency specified) that will be taken off the subtotal of any invoices for this customer.
* `currency` (currency): If amount_off has been set, the currency of the amount to take off.
* `metadata`: A set of key/value pairs that you can attach to a coupon object. It can be useful for storing additional information about the coupon in a structured format.

### Discount (i.e. the application of a coupon to a particular user)

	{
		user, // a user ID you can refer to (String)
		coupon, // associated Coupon
		start, // start date (Date)
		end, // end date (Date)
	}


## REST API

### Coupons

List coupons

	curl http://localhost:3014/api/coupons?password=MYPASSWORD

Check/get available coupon (404 if not found)

	curl http://localhost:3014/api/coupons/MYCOUPON?password=MYPASSWORD
	// The ‘@’ in email is needed to determine to look for an email-based coupon
	curl http://localhost:3014/api/coupons/@mit.edu?password=MYPASSWORD

Create new coupon:

	curl -X POST -H "Content-Type: application/json" -d '{ "code": "MYCOUPON", "percent_off": 10 }' http://localhost:3014/api/coupons?password=MYPASSWORD
	// Email-based: when create discount, if user’s email contains “mit.edu”, discount will be applied
	curl -X POST -H "Content-Type: application/json" -d '{ "email": "mit.edu", "percent_off": 10 }' http://localhost:3014/api/coupons?password=MYPASSWORD

Update coupon:

	curl -X PUT -H "Content-Type: application/json" -d '{ "percent_off": 20 }' http://localhost:3014/api/coupons/MYCOUPON?password=MYPASSWORD

Delete coupon:

	curl -X DELETE http://localhost:3014/api/coupons/MYCOUPON?password=MYPASSWORD

Delete all coupons:

	curl -X DELETE http://localhost:3014/api/coupons/ALL?password=MYPASSWORD


### Discounts

List applied discounts for a user

	curl http://localhost:3014/api/discounts?password=MYPASSWORD&user=548cbb2b1ad50708212193d8

Apply/create new discount:

	curl -X POST -H "Content-Type: application/json" -d '{ "code": "MYCOUPON", "user": "548cbb2b1ad50708212193d8" }' http://localhost:3014/api/discounts?password=MYPASSWORD
	curl -X POST -H "Content-Type: application/json" -d '{ "email": "@mit.edu", "user": "548cbb2b1ad50708212193d8" }' http://localhost:3014/api/discounts?password=MYPASSWORD

Delete discount:

	curl -X DELETE http://localhost:3014/api/discounts/50708212193d8?password=MYPASSWORD

Delete all discounts for a user:

	curl -X DELETE http://localhost:3014/api/discounts/USER?password=MYPASSWORD&user=548cbb2b1ad50708212193d8

Delete all discounts:

	curl -X DELETE http://localhost:3014/api/discounts/ALL?password=MYPASSWORD


## Implementation

Built on Node.js, Express, and MongoDB.


## Deploying on Heroku

	# Set up and configure app
	heroku create MYAPPNAME
	heroku addons:create mongolab
	heroku config:set NODE_ENV=production

	# Set password used in API requests
	heroku config:set API_PASSWORD=MYPASSWORD
