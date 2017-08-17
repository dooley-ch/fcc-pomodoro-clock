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
    var _clock = require("clock");

    var _sessionLength = 25;
    var _breakLength = 5;

    var _sessionLabel;
    var _breakLabel;
    var _timeLabel;
    var _clockImage;

    function _renderClock(data) {
        console.log(data);
    }

    function _chimeForClock() {
        console.log("BZbzzzzz...");
    }

    function _addToSession() {
        _sessionLength++;

        if (_sessionLength > 180) {
            _sessionLength = 180;
        }

        _sessionLabel.text("Session Length: " + _sessionLength);
        _clock.setSessionLength(_sessionLength);
    }

    function _subtractFromSession() {
        _sessionLength--;

        if (_sessionLength > 5) {
            _sessionLength = 5;
        }

        _sessionLabel.text("Session Length: " + _sessionLength);
        _clock.setSessionLength(_sessionLength);
    }

    function _addToBreak() {
        _breakLength++;

        if (_breakLength > 60) {
            _breakLength = 60;
        }

        _breakLabel.text("Break Length: " + _breakLength);
        _clock.setBreakLength(_breakLength);
    }

    function _subtractFromBreak() {
        _breakLength--;

        if (_breakLength < 5) {
            _breakLength = 5;
        }

        _breakLabel.text("Break Length: " + _breakLength);
        _clock.setBreakLength(_breakLength);
    }

    function _start() {
        _clock.start();
    }

    function _reset() {
        _clock.reset();
    }

    /**
     * This function initializes the applicaiton
     *
     * @return {void}
     */
    function _init() {
        // Wire up the clock
        _clock.setRenderCallback(_renderClock);
        _clock.setChimeCallback(_chimeForClock);

        // Wire up UI
        $("#session_add_button").click(_addToSession);
        $("#session_subtract_button").click(_subtractFromSession);
        $("#break_add_button").click(_addToBreak);
        $("#break_subtract_button").click(_subtractFromBreak);

        $("#startButton").click(_start);
        $("#resetButton").click(_reset);

        _sessionLabel = $("#sessionLabel");
        _breakLabel = $("#breakLabel");
        _timeLabel = $("#timeLabel");
        _clockImage = $("#clockImage");
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();
});
