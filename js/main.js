requirejs.config({
    shim : {
        semantic: {
            deps : ["jquery"]
        }
    },

    paths: {
        jquery: "lib/jquery/dist/jquery.min",
        semantic: "lib/semantic/dist/semantic.min",
        lodash: "lib/lodash/dist/lodash.min"
    }
});

define("app", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    require("semantic");
    var clock = require("clock");

    function _renderClock(data) {
        console.log(data);
    }

    function _chimeForClock() {
        console.log("BZbzzzzz...");
    }

    /**
     * This function initializes the applicaiton
     *
     * @return {void}
     */
    function _init() {
        // Wire up the clock
        clock.setRenderCallback(_renderClock);
        clock.setChimeCallback(_chimeForClock);

        // Debug
        clock.start();
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();
});
