(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("AuthApi", AuthApi);

    AuthApi.$inject = ["$resource"];

    // service to ask any /api/auth resource
    function AuthApi($resource) {
        return {
            login: $resource(
                "/api/auth/login", {}, {
                    post: {
                        method: "POST",
                    }
                }
            ),

            current: $resource(
                "/api/auth/current", {}, {
                    get: {
                        method: "GET",
                    }
                }
            ),

            verify: $resource(
                "/api/auth/verify", {}, {
                    get: {
                        method: "POST",
                    }
                }
            )
        }
    }
})();
