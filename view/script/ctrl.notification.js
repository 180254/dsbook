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
            .catch((err) => {
                console.log(err);

                toaster.pop({
                    type: "error",
                    title: "Błąd!",
                    body: "Nie udało się pobrać powiadomień.",
                    showCloseButton: true
                });
            });

        $scope.sendCloseNotification = (id, status,id_key) => {
            const sId = id;
            const sStatus = status;
            if (!sId || !sStatus) {
                return;
            }

            NotificationApi.status.post({
                _id: sId,
                status: sStatus
            }).$promise
                .then((notification) => {
                    $scope.data[id_key].status = sStatus;
                    $scope.data.splice(id_key,1);

                    toaster.pop({
                        type: "success",
                        title: "Sukces!",
                        body: "Powiadomienie zostało zamknięte.",
                        showCloseButton: true
                    });

                    // SmsApi.send.post({
                    //     "notification_id": notification._id
                    // }).$promise
                    //     .catch((err) => console.log(err));

                })
                .catch((err) => {
                    console.log(err);

                    toaster.pop({
                        type: "error",
                        title: "Porażka!",
                        body: "Nie udało się zamknąć powiadomienia.",
                        showCloseButton: true
                    });
                });
        };


        $scope.closeNotification = (id_key) => {
            const predefId = $scope.data[id_key]._id;
            console.log(predefId);
            $scope.sendCloseNotification(predefId, "closed",id_key);
        };
    }
})();
