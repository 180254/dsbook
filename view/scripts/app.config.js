(function (){
    'use strict';

    angular
        .module('PZApp')
        .config(configure);

    configure.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function configure( $stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider.state('root', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'templates/navbar.html',
                    controller: 'NavbarCtrl'
                },
                'body@': {
                    template: '<ui-view />'
                },
                'footer': {
                    templateUrl: 'templates/footer.html'
                }
            }
        });
        $stateProvider.state('dashboard', {
            parent : 'root',
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }

})();