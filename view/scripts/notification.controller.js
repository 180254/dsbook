(function () {
    'use strict';

    angular
        .module('PZApp')
        .controller('NotificationCtrl', NotificationCtrl);

    NotificationCtrl.$inject = [
        '$scope',
        '$rootScope',
        'notifications'
    ];

    function NotificationCtrl($scope, $rootScope, notifications) {
        $scope.data = notifications;
    }
})();
