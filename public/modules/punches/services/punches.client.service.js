'use strict';

//Punches service used to communicate Punches REST endpoints
angular.module('punches').factory('Punches', ['$resource',
    function($resource) {
        return $resource('punches/:punchId', {
            punchId: '@_id'
        }, {
            update: {
                method: 'PUT',
            },
            close: {
                method: 'PUT',
                params: {
                    action: 'close'
                }
            }
        });
    }
]);