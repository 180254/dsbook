(function (){
    'use strict';

    angular
        .module('PZApp')
        .service('Notification', Notification);

    Notification.$inject = ['$resource'];

    function Notification($resource){
        return $resource('/notification', {}, {
            query: {
                method: 'GET',
                isArray: true
            },
            add: {
                method: 'POST'
            }
        });
    }
})();


