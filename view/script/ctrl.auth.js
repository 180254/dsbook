(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("AuthCtrl", AuthCtrl);

    AuthCtrl.$inject = [
        "$scope",
        "$rootScope",
        "$cookies",
        "$location",
        "AuthApi",
        "NotificationApi"
    ];

    function AuthCtrl($scope, $rootScope, $cookies, $location, AuthApi, NotificationApi) {
        $scope.loginBox = "";
        $scope.passwordBox = "";
        $scope.statusMsg = "";
        $scope.notInfo = null;

        $scope.setNumberOfNotification = () => {
            const user = $location.search().user;
            if (!user) {
                return;
            }

            // recipient is user (201-1) or his room (201)
            const recipient = user + ","
                + (user.replace(/-[0-9]+$/, "") || "-");

            NotificationApi.counter.get({
                recipient: recipient,
                status: "new"
            }).$promise
                .then((data) => {
                    $scope.notInfo = {
                        user: user,
                        counter: data.counter
                    }
                })
                .catch((err) => {
                    console.log("AssertionError(" + err + ")");
                });
        };

        $scope.obSubmitClick = () => {
            if (!$scope.loginBox || !$scope.passwordBox) {
                return;
            }

            $scope.statusMsg = "Przetwarzanie ...";

            AuthApi.login.post({
                username: $scope.loginBox,
                password: $scope.passwordBox
            }).$promise
                .then((data) => {
                    $scope.statusMsg = "";
                    $cookies.put("token", data.token);
                    $rootScope.user = data;
                    $location.path("/")
                })
                .catch((err) => {
                    $scope.statusMsg = "Logowanie nieudane.";
                });
        };

        $scope.init = () => {
            $scope.setNumberOfNotification();
        };

        $scope.init();
    }
})();
