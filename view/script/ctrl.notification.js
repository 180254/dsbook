(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("NotificationCtrl", NotificationCtrl);

    NotificationCtrl.$inject = [
        "$scope",
        "$rootScope",
        "toaster",
        "NotificationApi"
    ];

    function NotificationCtrl($scope, $rootScope, toaster, NotificationApi) {
        $scope.data = undefined;

        NotificationApi.main.get({
            status: "new,confirmed"
        }).$promise
            .then((res) => {
                $scope.data = res;
            })
            .catch((error) => {
                toaster.pop({
                    type: "error",
                    title: "Błąd!",
                    body: "Nie udało się pobrać powiadomień.",
                    showCloseButton: true
                });
            });
    }
})();
