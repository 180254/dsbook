(function () {
    'use strict';

    angular
        .module('PZApp')
        .config(configure);

    configure.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function configure($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider.state('root', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'template/navbar.html',
                    controller: 'NavbarCtrl'
                },
                'body@': {
                    template: '<ui-view />'
                },
                'footer': {
                    templateUrl: 'template/footer.html'
                }
            }
        });
        $stateProvider.state('dashboard', {
            parent: 'root',
            url: '/dashboard',
            templateUrl: 'template/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }

})();
