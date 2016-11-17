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

    function UserDashboardCtrl($scope, $rootScope, toaster, NotificationApi) {
        $scope.data = undefined;

        // recipient is user (201-1) or his room (201)
        const user = $rootScope.user.user;
        const recipient = user + ","
            + (user.replace(/-[0-9]+$/, "") || "-");

        NotificationApi.main.get({
            status: "new",
            recipient: recipient
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
