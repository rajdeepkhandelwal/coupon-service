# Coupon Service

REST API service for discount coupons/vouchers. Inspired by the [Stripe API](https://stripe.com/docs/api#coupons), but sometimes you need coupons without credit cards.

## Usage

ATTRIBUTES:

* `_id` (string)
* `created` (date)

**Qualifiers:**

* `code` (string): the coupon code.
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


## How to Run

Just start with:

	# Set password used in API requests
	export API_PASSWORD=MYPASSWORD

	grunt

Server will default to **http://localhost:3014**

## API

List coupons

	curl http://localhost:3014/coupons?password=MYPASSWORD

Create new coupon:

	curl -X POST -H "Content-Type: application/json" -d '{ "code": "MYDISCOUNT", "percent_off": 10 }' http://localhost:3014/coupons?password=MYPASSWORD
	curl -X POST -H "Content-Type: application/json" -d '{ "email": "mit.edu", "percent_off": 10 }' http://localhost:3014/coupons?password=MYPASSWORD

Update coupon:

	curl -X PUT -H "Content-Type: application/json" -d '{ "percent_off": 20 }' http://localhost:3014/coupons/548cbb2b1ad50708212193d8?password=MYPASSWORD

Delete coupon:

	curl -X DELETE http://localhost:3014/coupons/5477a6f88906b9fc766c843e?password=MYPASSWORD

Delete all coupons:

	curl -X DELETE http://localhost:3014/coupons/ALL?password=MYPASSWORD

## Implementation

Built on Node.js, Express, and MongoDB.

## Deploying on Heroku

	# Set up and configure app
	heroku create MYAPPNAME
	heroku addons:add mongolab
	heroku config:set NODE_ENV=production

	# Set password used in API requests
	heroku config:set API_PASSWORD=MYPASSWORD
