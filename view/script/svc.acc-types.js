(function () {
    "use strict";

    angular
        .module("PZApp")
        .service("AccTypeSvc", AccTypeSvc);

    AccTypeSvc.$inject = [];

    function AccTypeSvc() {
        return {
            default_url: {
                PORTIER: "/dashboard",
                STUDENT: "/userDashboard"
            },
            allowed_urls: {
                PORTIER: ["/", "/auth", "/dashboard", "/notification"],
                STUDENT: ["/", "/auth", "/userDashboard", '/profile']
            },
        }
    }
})();
