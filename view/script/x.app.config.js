(function () {
    "use strict";

    angular
        .module("PZApp")
        .config(configure);

    configure.$inject = [
        "$stateProvider",
        "$urlRouterProvider",
    ];

    function configure($stateProvider, $urlRouterProvider) {
        $stateProvider.state("root", {
            abstract: true,

            views: {
                "navbar": {
                    templateUrl: "template/navbar.html",
                    controller: "NavbarCtrl"
                },
                "body": {
                    template: "<ui-view />"
                },
                "footer": {
                    templateUrl: "template/footer.html"
                }
            }
        });

        $stateProvider.state("main", {
            parent: "root",
            url: "/",
            templateUrl: "template/main.html",
            controller: "MainCtrl"
        });

        $stateProvider.state("auth", {
            parent: "root",
            url: "/auth",
            templateUrl: "template/auth.html",
            controller: "AuthCtrl"
        });

        $stateProvider.state("dashboard", {
            parent: "root",
            url: "/dashboard",
            templateUrl: "template/dashboard.html",
            controller: "DashboardCtrl"
        });

        $stateProvider.state("notification", {
            parent: "root",
            url: "/notification",
            templateUrl: "template/notification.html",
            controller: "NotificationCtrl"
        });

        $urlRouterProvider.otherwise("/");
    }
})();
