(function (){
    'use strict';

    angular
        .module('PZApp')
        .config(notificationProvider);

    notificationProvider.$inject = ['$stateProvider'];

    function notificationProvider($stateProvider){

        var resolveNotifications = ['$state', 'Notification', 'toaster', loadNotifications];

        $stateProvider
            .state('notification', {
                parent: 'root',
                url: '/notification',
                templateUrl: 'templates/notification.html',
                controller: "NotificationCtrl",
                resolve :{
                    notifications : resolveNotifications
                }
            });


        function loadNotifications($state, Notification, toaster){
            var notificationPromise = Notification.query().$promise;
            notificationPromise['catch'](function (reason){
                console.log('Get Notifications error becouse of ', reason);
                toaster.pop({
                    type: 'error',
                    title: 'Błąd',
                    body: 'Nie udało się pobrać powiadomień',
                    showCloseButton: true
                });
            });

            return notificationPromise;
        }
    }
})();
