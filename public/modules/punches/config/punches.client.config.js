'use strict';

// Configuring the Articles module
angular.module('punches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Punches', 'punches', 'dropdown', '/punches(/create)?');
		Menus.addSubMenuItem('topbar', 'punches', 'List Punches', 'punches');
		Menus.addSubMenuItem('topbar', 'punches', 'New Punch', 'punches/create');
	}
]);