'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Punch = mongoose.model('Punch'),
    _ = require('lodash');

/**
 * Create a Punch
 */
exports.create = function(req, res) {
    var punch = new Punch(req.body);
    punch.user = req.user;

    punch.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(punch);
        }
    });
};

/**
 * Show the current Punch
 */
exports.read = function(req, res) {
    res.jsonp(req.punch);
};

/**
 * Update a Punch
 */
exports.update = function(req, res) {
    var punch = req.punch;
    var action = req.query.action;

    // updating punch with end time
    if (action === 'close') {
        punch.endTime = Date.now();
    }

    punch = _.extend(punch, req.body);

    punch.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(punch);
        }
    });
};

/**
 * Delete an Punch
 */
exports.delete = function(req, res) {
    var punch = req.punch;

    punch.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(punch);
        }
    });
};

/**
 * List of Punches
 */
exports.list = function(req, res) {
    Punch.find().sort('-created').populate('user', 'displayName').exec(function(err, punches) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(punches);
        }
    });
};

/**
 * Punch middleware
 */
exports.punchByID = function(req, res, next, id) {
    Punch.findById(id).populate('user', 'displayName').exec(function(err, punch) {
        if (err) return next(err);
        if (!punch) return next(new Error('Failed to load Punch ' + id));
        req.punch = punch;
        next();
    });
};

/**
 * Punch authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.punch.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};