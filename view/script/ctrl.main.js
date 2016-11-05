(function () {
    "use strict";

    angular
        .module("PZApp")
        .controller("MainCtrl", MainCtrl);

    MainCtrl.$inject = [
        "$scope",
        "$rootScope",
        "$location",
        "AccTypeSvc",
    ];

    function MainCtrl($scope, $rootScope, $location, AccTypeSvc) {
        // switch to default page after user is known
        $rootScope.$watch("user",
            /**
             * @param {AccountInfo|null} val
             * @param {AccountInfo|null} oldVal
             */
            (val, oldVal) => {
                if (val) {
                    const defaultUrl =
                        AccTypeSvc.default_url[val.accType];

                    if (defaultUrl) {
                        $location.path(defaultUrl);
                    }
                }
            });
    }
})();
