'use strict';

//Setting up route
angular.module('punches').config(['$stateProvider',
	function($stateProvider) {
		// Punches state routing
		$stateProvider.
		state('listPunches', {
			url: '/punches',
			templateUrl: 'modules/punches/views/list-punches.client.view.html'
		}).
		state('createPunch', {
			url: '/punches/create',
			templateUrl: 'modules/punches/views/create-punch.client.view.html'
		}).
		state('viewPunch', {
			url: '/punches/:punchId',
			templateUrl: 'modules/punches/views/view-punch.client.view.html'
		}).
		state('editPunch', {
			url: '/punches/:punchId/edit',
			templateUrl: 'modules/punches/views/edit-punch.client.view.html'
		});
	}
]);