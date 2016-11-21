(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("SmsApi", SmsApi);

    SmsApi.$inject = ["$resource"];

    // service to ask any /api/auth resource
    function SmsApi($resource) {
        return {
            send: $resource(
                "/api/sms/send", {}, {
                    post: {
                        method: "POST",
                    }
                }
            )
        }
    }
})();
