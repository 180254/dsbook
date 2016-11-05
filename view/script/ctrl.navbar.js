(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("NavbarCtrl", NavbarCtrl);

    NavbarCtrl.$inject = [
        "$scope",
        "$rootScope",
        "$location",
        "$cookies"
    ];

    function NavbarCtrl($scope, $rootScope, $location, $cookies) {

        $scope.logout = () => {
            $cookies.remove("token");
            $rootScope.user = undefined;
            $location.path("/auth");
        }
    }
})();
