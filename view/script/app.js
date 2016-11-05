(function (){
    'use strict';
    var app = angular.module("PZApp", [
        'ngAnimate',
        'ui.bootstrap',
        'ui.router',
        'ngResource',
        'toaster'
    ]);
})();

(function (){
    'use strict';

    angular
        .module('PZApp')
        .run(runBlock);

    runBlock.$inject = [
        '$rootScope',
        '$state',
        '$window'
        ];

    function runBlock($root, $state, $window){
       $root.$on('$stateChangeStart', function (evt, to, params){
            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params);
            }
        });
    }
})();
