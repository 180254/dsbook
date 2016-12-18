(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("GoogleService", GoogleService);

    GoogleService.$inject = ["$resource"];

    // service to ask any /api/auth resource
    function GoogleService($resource) {
        return {
            GetJsonWorkSheet: $resource(
                "/api/googleService/GetJsonWorkSheet", {}, {
                    get: {
                        method: "GET",
                    }
                }
            )
        }
    }
})();
