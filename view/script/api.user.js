(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("UserApi", UserApi);

    UserApi.$inject = ["$resource"];

    // service to ask any /api/user resource
    function UserApi($resource) {
        return {
            main: $resource(
                "/api/user", {}, {
                    get: {
                        method: "GET",
                        isArray: true
                    },
                    post: {
                        method: "POST"
                    },
                    update: {
                        method: 'POST',
                        url: '/api/user/update'
                    }
                }
            ),

            update: $resource(
                "/api/notification/update", {}, {
                    post: {
                        method: "POST",
                    }
                }
            )
        }
    }
})();
