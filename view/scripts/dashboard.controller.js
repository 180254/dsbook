(function () {
    'use strict';

    angular
        .module('PZApp')
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = [
        '$scope',
        '$rootScope'
    ];

    function DashboardCtrl($scope, $rootScope) {
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
            console.log($scope.notification.notificatonContent)
            $rootScope.notifications.push({message:$scope.notification.notificatonContent, room: $scope.selectedRoom, date: new Date(), accepted: false});
        }

        function sendPredefinedNotification(key){
            $scope.showNotificationTextarea = false;
            if(key === 'pizza'){
                $rootScope.notifications.push({message:messages[0], room: $scope.selectedRoom, date: new Date(), accepted: false});
            }else if(key === 'package'){
                $rootScope.notifications.push({message:messages[1], room: $scope.selectedRoom, date: new Date(), accepted: false});
            }else if(key === 'manager'){
                $rootScope.notifications.push({message:messages[2], room: $scope.selectedRoom, date: new Date(), accepted: false});
            }else if(key === 'porter' ){
                $rootScope.notifications.push({message:messages[3], room: $scope.selectedRoom, date: new Date(), accepted: false});
            }else{
                throw 'Usupported predefined value'
            }
        }
    }
})();

