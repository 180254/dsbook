(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("UserDashboardCtrl", UserDashboardCtrl);

    UserDashboardCtrl.$inject = [
        "$scope",
        "$rootScope",
        "toaster",
        "NotificationApi"
    ];

    function UserDashboardCtrl($scope, $rootScope,  toaster, NotificationApi) {
        $scope.data = undefined;

        NotificationApi.main.get({
            status: "new,confirmed",
            recipient: $rootScope.user.user
        }).$promise
            .then((res) => {
            $scope.data = res;
    }).catch((error) => {
            toaster.pop({
            type: "error",
            title: "Błąd!",
            body: "Nie udało się pobrać powiadomień.",
            showCloseButton: true
        });
    });
    }
})();
