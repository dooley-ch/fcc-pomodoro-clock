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

    var _running = false;

    function _formatDigits(value) {
        if (value <= 9) {
            return "0" + value;
        }

        return String(value);
    }

    function _renderClock(data) {
        var mins = data.periodLength - data.lapsedMinutes;

        if (data.lapsedSeconds > 0) {
            mins--;
        }

        var secs = 0;

        if (data.lapsedSeconds > 0) {
            secs = 59 - data.lapsedSeconds;
        }


        _timeLabel.text(_formatDigits(mins) + ":" + _formatDigits(secs) + " Mins.");

        if (data.mode == _clock.WORK) {
            _clockImage.attr("src", "img/groundwork256.png");
        } else {
            _clockImage.attr("src", "img/coffe256.png");
        }
    }

    function _chimeForClock() {
        var audio = new Audio("alarm.mp3");
        audio.play();
    }

    function _addToSession() {
        if (_running) {
            return;
        }

        _sessionLength++;

        if (_sessionLength > 180) {
            _sessionLength = 180;
        }

        _sessionLabel.text("Session : " + _formatDigits(_sessionLength));
        _clock.setSessionLength(_sessionLength);
    }

    function _subtractFromSession() {
        if (_running) {
            return;
        }

        _sessionLength--;

        if (_sessionLength < 5) {
            _sessionLength = 5;
        }

        _sessionLabel.text("Session : " + _formatDigits(_sessionLength));
        _clock.setSessionLength(_sessionLength);
    }

    function _addToBreak() {
        if (_running) {
            return;
        }

        _breakLength++;

        if (_breakLength > 60) {
            _breakLength = 60;
        }

        _breakLabel.text("Break : " + _formatDigits(_breakLength));
        _clock.setBreakLength(_breakLength);
    }

    function _subtractFromBreak() {
        if (_running) {
            return;
        }

        _breakLength--;

        if (_breakLength < 5) {
            _breakLength = 5;
        }

        _breakLabel.text("Break : " + _formatDigits(_breakLength));
        _clock.setBreakLength(_breakLength);
    }

    function _start() {
        _running = true;
        _clock.start();
    }

    function _reset() {
        _timeLabel.text(_sessionLength + ":00 Mins.");
        _running = false;
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
