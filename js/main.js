requirejs.config({
    shim : {
        semantic: {
            deps : ["jquery"]
        }
    },

    paths: {
        jquery: "lib/jquery/dist/jquery.min",
        semantic: "lib/semantic/dist/semantic.min"
    }
});

define("app", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    require("semantic");

    /**
     * This function initializes the applicaiton
     *
     * @return {void}
     */
    function _init() {
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();
});
