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

        $scope.predefButtons = {
            confirmation: {
                button: "Potwierdzam",
                msg: "Potwierdzenie odebrania wiadomości.",
                status: "confirmed"
            },
        };

        $scope.content = "";

        // recipient is user (201-1) or his room (201)
        const user = $rootScope.user.user;
        const recipient = user + "," +
            (user.replace(/-[0-9]+$/, "") || "-");

        NotificationApi.main.get({
            status: "new",
            recipient: recipient
        }).$promise
            .then((res) => {
                $scope.data = res;
            })
            .catch((err) => {
                console.log(err);

                toaster.pop({
                    type: "error",
                    title: "Błąd!",
                    body: "Nie udało się pobrać powiadomień.",
                    showCloseButton: true
                });
            });


        $scope.sendNotification = (id, status, key) => {
            const sId = id; //??  || $scope.content;
            const sStatus = status; // ?? || $scope.content;
            if (!sStatus || !sId) { //!$scope.recipient ||
                return;
            }
            NotificationApi.status.post({
                _id: sId,
                status: sStatus
            }).$promise
                .then(() => {
                    $scope.data[key].status = sStatus;
                    toaster.pop({
                        type: "success",
                        title: "Sukces!",
                        body: "Powiadomienie zostało wysłane.",
                        showCloseButton: true
                    })
                })
                .catch((err) => {
                    console.log(err);

                    toaster.pop({
                        type: "error",
                        title: "Porażka!",
                        body: "Nie udało się wysłać powiadomienia.",
                        showCloseButton: true
                    })
                });
        };

        $scope.sendPredefinedNotification = (id_key, key) => {
            const predefStatus = $scope.predefButtons[key].status;
            const predefId = $scope.data[id_key]._id;
            $scope.sendNotification(predefId, predefStatus, id_key);
        };
    }
})();
