(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("EmailApi", EmailApi);

    EmailApi.$inject = ["$resource"];

    // service to ask any /api/auth resource
    function EmailApi($resource) {
        return {
            send: $resource(
                "/api/email/send", {}, {
                    post: {
                        method: "POST",
                    }
                }
            )
        }
    }
})();
