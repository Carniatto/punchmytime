'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$mdToast',
	function($scope, $http, $location, Authentication, $mdToast) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/punches');
			}).error(function(response) {
				// $scope.showToast(response.message);
			});
		};

		$scope.showToast = function(error) {
		    $mdToast.show({
		        position: 'bottom right',
		        hideDelay: 3000,
		        template: '<md-toast><span style="color:red" flex>'+error+'</span></md-toast>'
		    }
		    );
		  };

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/punches');
			}).error(function(response) {
				$scope.showToast(response.message);
			});
		};

		$scope.go = function(path) {
            $location.path(path);
        };

	}
]);