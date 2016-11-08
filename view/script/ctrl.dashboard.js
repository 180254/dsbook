(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("DashboardCtrl", DashboardCtrl);

    DashboardCtrl.$inject = [
        "$scope",
        "$rootScope",
        "toaster",
        "NotificationApi"
    ];

    function DashboardCtrl($scope, $rootScope, toaster, NotificationApi) {
        $scope.predefRecipients = [
            "101", "201", "301", "302"
        ];

        $scope.predefButtons = {
            pizza: {
                button: "Pizza",
                msg: "Na portierni czeka pizza zamówiona przez osobę z tego pokoju."
            },
            package: {
                button: "Paczka",
                msg: "Na portierni czeka paczka zamówiona przez osobę z tego pokoju."
            },
            manager: {
                button: "Wezwanie do kierownika",
                msg: "Wezwanie od kierownika."
            },
            portier: {
                button: "Wezwanie do portiera",
                msg: "Wezwanie do portiera."
            }
        };

        $scope.recipient = "";
        $scope.content = "";
        $scope.showCustomNotification = false;

        $scope.sendNotification = (content) => {
            const sContent = content || $scope.content;
            if (!$scope.recipient || !sContent) {
                return;
            }

            NotificationApi.main.post({
                recipient: $scope.recipient,
                content: sContent
            }).$promise
                .then(() => {
                    toaster.pop({
                        type: "success",
                        title: "Sukces!",
                        body: "Powiadomienie zostało wysłane.",
                        showCloseButton: true
                    })
                })
                .catch(() =>
                    toaster.pop({
                        type: "error",
                        title: "Porażka!",
                        body: "Nie udało się wysłać powiadomienia.",
                        showCloseButton: true
                    })
                );
        };

        $scope.sendPredefinedNotification = (key) => {
            const predefContent = $scope.predefButtons[key].msg;
            $scope.sendNotification(predefContent);
        };

        $scope.otherButton = () => {
            $scope.showCustomNotification = !$scope.showCustomNotification;
        }
    }
})();