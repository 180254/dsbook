(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("ProfileCtrl", ProfileCtrl);

    ProfileCtrl.$inject = [
        "$scope",
        '$rootScope',
        'UserApi'
    ];

    function ProfileCtrl($scope, $rootScope, UserApi) {
        UserApi.main.get({
            user: $rootScope.user.user
        }).$promise
            .then((data) => {
                $scope.user = data[0]
        });

        $scope.update = () => {
            console.log($scope.user)
            UserApi.main.update({
                "user": $scope.user,
                "name": $scope.name,
                "surname": $scope.surname,
                "mobile": $scope.mobile,
                "email": $scope.email
            }).$promise
                .then((data) => {
                $scope.user = data[0]
            })
        }
    }
})();
