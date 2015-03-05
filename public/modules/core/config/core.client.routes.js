'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/punches');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/punches',
			templateUrl: 'modules/punches/views/list-punches.client.view.html'
		});
	}
]);