(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("ProfileCtrl", ProfileCtrl);

    ProfileCtrl.$inject = [
        "$scope",
        '$rootScope',
        'toaster',
        'UserApi'
    ];

    function ProfileCtrl($scope, $rootScope, toaster, UserApi) {
        UserApi.main.get({
            user: $rootScope.user.user
        }).$promise
            .then((data) => {
                $scope.user = data[0];
            });

        $scope.update = () => {
            console.log($scope.user);
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
                    toaster.pop({
                        type: "success",
                        title: "Sukces!",
                        body: "Dane zostały zaktualizowane.",
                        showCloseButton: true
                    });
                })
                .catch((err) => {
                    console.log(err);

                    toaster.pop({
                        type: "error",
                        title: "Porażka!",
                        body: "Nie udało się zaktualizować danych.",
                        showCloseButton: true
                    });
                });
        }
    }
})();
