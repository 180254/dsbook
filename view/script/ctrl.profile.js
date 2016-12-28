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
                $scope.user = data[0];
            });

        $scope.update = () => {
            UserApi.main.update({
                "user": $scope.user.user,
                "name": $scope.user.name,
                "surname": $scope.user.surname,
                "mobile": $scope.user.mobile,
                "email": $scope.user.email,
                "wantEmail": $scope.user.wantEmail,
                "wantSms": $scope.user.wantSms
            }).$promise
                .then((data) => {
                    $scope.user = data;
                });
        }
    }
})();
