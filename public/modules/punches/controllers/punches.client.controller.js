'use strict';

// Punches controller
angular.module('punches').controller('PunchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Punches', '$timeout', '$moment',
    function($scope, $stateParams, $location, Authentication, Punches, $timeout, $moment) {
        $scope.authentication = Authentication;

        // Create new Punch
        $scope.create = function() {
            // Create new Punch object
            var punch = new Punches();
             $scope.startClock();
            // Redirect after save
            punch.$save(function(response) {
                $scope.punch = response;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Close a Punch
        $scope.close = function() {
            var punch = $scope.punch;
            $scope.stopClock();
            if (punch) {
                punch.$close(function() {
                    $scope.find();
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



        //timer implementation
        $scope.tickInterval = 1000 //ms
        $scope.tick = function () {
            $scope.clock = $moment().subtract($scope.startTime).toDate(); // get the current time
            $scope.timer = $timeout($scope.tick, $scope.tickInterval); // reset the timer
        }

        $scope.startClock = function(){
            $scope.startTime = $moment();
            $scope.clock = $moment().subtract($scope.startTime).toDate();
            $scope.timer = $timeout($scope.tick, $scope.tickInterval);
        }

        $scope.stopClock = function(){
            $timeout.cancel($scope.timer);
        }
    }
]);