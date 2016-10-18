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
        console.log($stateProvider);
        $stateProvider.state('root', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'templates/navbar.html',
                    //template: '<h3>aaaaaaa</f3>',
                    controller: 'NavbarCtrl'
                },
                'body@': {
                    template: '<ui-view />'
                },
                'footer': {
                    templateUrl: 'templates/footer.html'
                    //controller: 'FooterCtrl'
                }
            }
        });
        $stateProvider.state('dashboard', {
            parent : 'root',
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
        });
        console.log($stateProvider);
    }

})();