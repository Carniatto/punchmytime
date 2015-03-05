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

    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
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