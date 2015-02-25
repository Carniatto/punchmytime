'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Punch = mongoose.model('Punch'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, punch;

/**
 * Punch routes tests
 */
describe('Punch CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Punch
		user.save(function() {
			punch = {
				name: 'Punch Name'
			};

			done();
		});
	});

	it('should be able to save Punch instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punch
				agent.post('/punches')
					.send(punch)
					.expect(200)
					.end(function(punchSaveErr, punchSaveRes) {
						// Handle Punch save error
						if (punchSaveErr) done(punchSaveErr);

						// Get a list of Punches
						agent.get('/punches')
							.end(function(punchesGetErr, punchesGetRes) {
								// Handle Punch save error
								if (punchesGetErr) done(punchesGetErr);

								// Get Punches list
								var punches = punchesGetRes.body;

								// Set assertions
								(punches[0].user._id).should.equal(userId);
								(punches[0].name).should.match('Punch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Punch instance if not logged in', function(done) {
		agent.post('/punches')
			.send(punch)
			.expect(401)
			.end(function(punchSaveErr, punchSaveRes) {
				// Call the assertion callback
				done(punchSaveErr);
			});
	});

	it('should not be able to save Punch instance if no name is provided', function(done) {
		// Invalidate name field
		punch.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punch
				agent.post('/punches')
					.send(punch)
					.expect(400)
					.end(function(punchSaveErr, punchSaveRes) {
						// Set message assertion
						(punchSaveRes.body.message).should.match('Please fill Punch name');
						
						// Handle Punch save error
						done(punchSaveErr);
					});
			});
	});

	it('should be able to update Punch instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punch
				agent.post('/punches')
					.send(punch)
					.expect(200)
					.end(function(punchSaveErr, punchSaveRes) {
						// Handle Punch save error
						if (punchSaveErr) done(punchSaveErr);

						// Update Punch name
						punch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Punch
						agent.put('/punches/' + punchSaveRes.body._id)
							.send(punch)
							.expect(200)
							.end(function(punchUpdateErr, punchUpdateRes) {
								// Handle Punch update error
								if (punchUpdateErr) done(punchUpdateErr);

								// Set assertions
								(punchUpdateRes.body._id).should.equal(punchSaveRes.body._id);
								(punchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Punches if not signed in', function(done) {
		// Create new Punch model instance
		var punchObj = new Punch(punch);

		// Save the Punch
		punchObj.save(function() {
			// Request Punches
			request(app).get('/punches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Punch if not signed in', function(done) {
		// Create new Punch model instance
		var punchObj = new Punch(punch);

		// Save the Punch
		punchObj.save(function() {
			request(app).get('/punches/' + punchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', punch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Punch instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Punch
				agent.post('/punches')
					.send(punch)
					.expect(200)
					.end(function(punchSaveErr, punchSaveRes) {
						// Handle Punch save error
						if (punchSaveErr) done(punchSaveErr);

						// Delete existing Punch
						agent.delete('/punches/' + punchSaveRes.body._id)
							.send(punch)
							.expect(200)
							.end(function(punchDeleteErr, punchDeleteRes) {
								// Handle Punch error error
								if (punchDeleteErr) done(punchDeleteErr);

								// Set assertions
								(punchDeleteRes.body._id).should.equal(punchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Punch instance if not signed in', function(done) {
		// Set Punch user 
		punch.user = user;

		// Create new Punch model instance
		var punchObj = new Punch(punch);

		// Save the Punch
		punchObj.save(function() {
			// Try deleting Punch
			request(app).delete('/punches/' + punchObj._id)
			.expect(401)
			.end(function(punchDeleteErr, punchDeleteRes) {
				// Set message assertion
				(punchDeleteRes.body.message).should.match('User is not logged in');

				// Handle Punch error error
				done(punchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Punch.remove().exec();
		done();
	});
});