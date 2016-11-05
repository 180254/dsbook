(function () {
    'use strict';

    angular
        .module('PZApp')
        .controller('NavbarCtrl', NavbarCtrl);

    NavbarCtrl.$inject = [
        '$scope'
    ];

    function NavbarCtrl($scope) {
        $scope.loggedUser = "Portier";
    }
})();
