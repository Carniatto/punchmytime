'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication', 'Menus', '$mdSidenav', '$location',
	function($scope, Authentication, Menus, $mdSidenav, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

        $scope.go = function(path) {
            $location.path(path);
        };


	}
]);