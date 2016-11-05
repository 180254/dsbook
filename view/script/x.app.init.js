(function () {
    "use strict";

    angular
        .module("PZApp")
        .run(init);

    init.$inject = [
        "$rootScope",
        "$state",
        "$location",
        "AuthApi",
        "AccTypeSvc"
    ];

    function init($rootScope, $state, $location, AuthApi, AccTypeSvc) {
        const isAllowedUrl = (path) =>
            AccTypeSvc.allowed_urls[$rootScope.user.accType].includes(path);

        $rootScope.$on("$stateChangeStart",
            /**
             * @param {Object} evt
             * @param {Object} to
             * @param {Object} params
             * @namespace to.redirectTo
             */
            (evt, to, params) => {
                if (to.redirectTo) {
                    evt.preventDefault();
                    $state.go(to.redirectTo, params);
                }

                // verify is user want redirect to his allowed page
                if ($rootScope.user && !isAllowedUrl(to.url)) {
                    evt.preventDefault();
                    $location.path("/");
                }
            });

        // on app start get current user from api
        AuthApi.current.get().$promise
            .then((res) => {
                /**
                 * @type {AccountInfo}
                 */
                $rootScope.user = res;

                // verify is user is on his allowed page
                if (!isAllowedUrl($location.path())) {
                    $location.path("/");
                }
            })
            // if user is not authorized go to auth
            .catch(() => {
                $location.path("/auth");
            });
    }
})();
