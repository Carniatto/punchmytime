'use strict';

(function() {
	// Punches Controller Spec
	describe('Punches Controller Tests', function() {
		// Initialize global variables
		var PunchesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Punches controller.
			PunchesController = $controller('PunchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Punch object fetched from XHR', inject(function(Punches) {
			// Create sample Punch using the Punches service
			var samplePunch = new Punches({
				name: 'New Punch'
			});

			// Create a sample Punches array that includes the new Punch
			var samplePunches = [samplePunch];

			// Set GET response
			$httpBackend.expectGET('punches').respond(samplePunches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.punches).toEqualData(samplePunches);
		}));

		it('$scope.findOne() should create an array with one Punch object fetched from XHR using a punchId URL parameter', inject(function(Punches) {
			// Define a sample Punch object
			var samplePunch = new Punches({
				name: 'New Punch'
			});

			// Set the URL parameter
			$stateParams.punchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/punches\/([0-9a-fA-F]{24})$/).respond(samplePunch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.punch).toEqualData(samplePunch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Punches) {
			// Create a sample Punch object
			var samplePunchPostData = new Punches({
				name: 'New Punch'
			});

			// Create a sample Punch response
			var samplePunchResponse = new Punches({
				_id: '525cf20451979dea2c000001',
				name: 'New Punch'
			});

			// Fixture mock form input values
			scope.name = 'New Punch';

			// Set POST response
			$httpBackend.expectPOST('punches', samplePunchPostData).respond(samplePunchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Punch was created
			expect($location.path()).toBe('/punches/' + samplePunchResponse._id);
		}));

		it('$scope.update() should update a valid Punch', inject(function(Punches) {
			// Define a sample Punch put data
			var samplePunchPutData = new Punches({
				_id: '525cf20451979dea2c000001',
				name: 'New Punch'
			});

			// Mock Punch in scope
			scope.punch = samplePunchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/punches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/punches/' + samplePunchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid punchId and remove the Punch from the scope', inject(function(Punches) {
			// Create new Punch object
			var samplePunch = new Punches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Punches array and include the Punch
			scope.punches = [samplePunch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/punches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePunch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.punches.length).toBe(0);
		}));
	});
}());