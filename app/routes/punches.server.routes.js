'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var punches = require('../../app/controllers/punches.server.controller');

	// Punches Routes
	app.route('/punches')
		.get(punches.list)
		.post(users.requiresLogin, punches.create);

	app.route('/punches/:punchId')
		.get(punches.read)
		.put(users.requiresLogin, punches.hasAuthorization, punches.update)
		.delete(users.requiresLogin, punches.hasAuthorization, punches.delete);

	// Finish by binding the Punch middleware
	app.param('punchId', punches.punchByID);
};
