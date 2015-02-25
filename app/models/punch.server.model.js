'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Punch Schema
 */
var PunchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Punch name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Punch', PunchSchema);