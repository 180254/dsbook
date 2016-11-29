(function () {
    "use strict";

    angular.module("PZApp", [
        "ngAnimate",
        "ui.bootstrap",
        "ui.router",
        "ngResource",
        "toaster",
        "ngCookies",
        "xeditable"
    ]).run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });
})();
