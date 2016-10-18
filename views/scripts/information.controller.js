(function () {
    'use strict';

    angular
        .module('PZApp')
        .controller('InformationCtrl', InformationCtrl);

    InformationCtrl.$inject = [
        '$scope',
        '$rootScope'
    ];

    function InformationCtrl($scope, $rootScope) {
        $scope.data = $rootScope.notifications;
    }
})();
