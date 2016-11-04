(function () {
    'use strict';

    angular
        .module('PZApp')
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = [
        '$scope',
        '$rootScope',
        'Notification'
    ];

    function DashboardCtrl($scope, $rootScope, Notification) {
        var messages = [
            'Na portierni czeka pizza zamówiona przez osobę z tego pokoju',
            'Na portierni czeka paczka zamówiona przez osobę z tego pokoju',
            'Wezwanie od kierowniczki',
            'Wezwanie do portiera'
          ];
        if(!$rootScope.notifications){
            $rootScope.notifications = [];
        }
        $scope.loggedUser = "Portier";
        $scope.rooms = [{name: '301'}, {name: '302'}];
        $scope.notification = {
            notificatonContent : ''
        };
        $scope.sendNotification = sendNotification;
        $scope.sendPredefinedNotification = sendPredefinedNotification;
        $scope.showNotificationTextarea = false;

        function sendNotification(){
            Notification.add({
                user : 'mockedUser',
                content : $scope.notification.notificatonContent
            }).$promise.then(function(result) {
                toaster.pop({
                    type: 'success',
                    title: 'Sukces',
                    body: 'Powiadomienie zostało wysłane',
                    showCloseButton: true
                });
            },
            function(reason){
                toaster.pop({
                    type: 'error',
                    title: 'Porażka',
                    body: 'Nie udało się wysłać powiadomienia',
                    showCloseButton: true
                });
            } );
        }

        function sendPredefinedNotification(key){
            $scope.showNotificationTextarea = false;

            var content = '';

            if(key === 'pizza'){
                content = messages[0];
            }else if(key === 'package'){
                content = messages[1];
            }else if(key === 'manager'){
                content = messages[2];
            }else if(key === 'porter' ){
                content = messages[3];
            }else{
                throw 'Usupported predefined value'
            }

            Notification.add({
                user : 'mockedUser',
                content : content
            });
        }
    }
})();

