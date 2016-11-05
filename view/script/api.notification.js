(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("NotificationApi", NotificationApi);

    NotificationApi.$inject = ["$resource"];

    // service to ask any /api/notification resource
    function NotificationApi($resource) {
        return {
            main: $resource(
                "/api/notification", {}, {
                    get: {
                        method: "GET",
                        isArray: true
                    },
                    post: {
                        method: "POST"
                    }
                }
            ),

            counter: $resource(
                "/api/notification/counter", {}, {
                    get: {
                        method: "GET",
                    }
                }
            ),

            status: $resource(
                "/api/notification/status", {}, {
                    post: {
                        method: "POST",
                    }
                }
            ),
        }
    }
})();
