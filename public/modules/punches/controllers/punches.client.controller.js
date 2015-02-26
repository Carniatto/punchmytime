'use strict';

// Punches controller
angular.module('punches').controller('PunchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Punches',
    function($scope, $stateParams, $location, Authentication, Punches) {
        $scope.authentication = Authentication;

        // Create new Punch
        $scope.create = function() {
            // Create new Punch object
            var punch = new Punches({
                name: this.name
            });

            // Redirect after save
            punch.$save(function(response) {
                $location.path('punches/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Close a Punch
        $scope.close = function() {
            var punch = $scope.punch;
            if (punch) {
                punch.$close(function() {
                    $location.path('punches/' + punch._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        // Remove existing Punch
        $scope.remove = function(punch) {
            if (punch) {
                punch.$remove();

                for (var i in $scope.punches) {
                    if ($scope.punches[i] === punch) {
                        $scope.punches.splice(i, 1);
                    }
                }
            } else {
                $scope.punch.$remove(function() {
                    $location.path('punches');
                });
            }
        };

        // Update existing Punch
        $scope.update = function() {
            var punch = $scope.punch;

            punch.$update(function() {
                $location.path('punches/' + punch._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Punches
        $scope.find = function() {
            $scope.punches = Punches.query();
        };

        // Find existing Punch
        $scope.findOne = function() {
            $scope.punch = Punches.get({
                punchId: $stateParams.punchId
            });
        };
    }
]);