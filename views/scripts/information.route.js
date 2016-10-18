(function (){
    'use strict';

    angular
        .module('PZApp')
        .config(informationProvider);

    informationProvider.$inject = ['$stateProvider'];

    function informationProvider($stateProvider){

        $stateProvider
            .state('information', {
                parent: 'root',
                url: '/information',
                templateUrl: 'templates/information.html',
                controller: "InformationCtrl"
            });
    }
})();