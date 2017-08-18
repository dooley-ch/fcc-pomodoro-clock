define("clock", function (require, exports) {
    "use strict";

    var _ = require("lodash");

    var _renderCallback = null;
    var _chimeCallback = null;

    var _timer = null;

    var _sessionLength = 25;
    var _breakLength = 5;

    var _lapsedMinutes = 0;
    var _lapsedSeconds = 0;

    var _WORK = 0;
    var _BREAK = 1;
    var _mode = 0; // 0 => work, 1 => break;

    function _stopTimer() {
        if (_timer) {
            clearTimeout(_timer);
        }
    }

    function _startTimer() {
        _timer = setTimeout(_timerCallback, 1000);
    }

    function _timerCallback() {
        _stopTimer();
        _addSecond();
        _startTimer();
    }

    function _resetMode(newMode) {
        _lapsedSeconds = 0;
        _lapsedMinutes = 0;
        _mode = newMode;
    }

    function _setRenderCallback(callback) {
        if (_.isFunction(callback)) {
            _renderCallback = callback;
        }
    }

    function _setChimeCallback(callback) {
        if (_.isFunction(callback)) {
            _chimeCallback = callback;
        }
    }

    function _setSessionLength(value) {
        if (value > 0) {
            _sessionLength = value;
        }
    }

    function _setBreakLength(value) {
        if (value > 0) {
            _breakLength = value;
        }
    }

    function _start() {
        _startTimer();
        _render();
    }

    function _reset() {
        _stopTimer();
        _resetMode(0);
    }

    function _addSecond() {
        _lapsedSeconds++;
        if (_lapsedSeconds == 60) {
            _lapsedMinutes++;
            _lapsedSeconds = 0;
        }

        _render();
        _checkCompleted();
    }

    function _checkCompleted() {
        if (_mode == _WORK) {
            if (_lapsedMinutes >= _sessionLength) {
                _chime();
                _resetMode(BREAK);
            }
        } else {
            if (_lapsedMinutes >= _breakLength) {
                _chime();
                _resetMode(WORK);
            }
        }
    }

    function _render() {
        if (_.isFunction(_renderCallback)) {
            var data = {};
            data.mode = _mode;
            data.periodLength = _sessionLength;

            if (_mode == 1) {
                data.periodLength = _breakLength;
            }

            data.lapsedMinutes = _lapsedMinutes;
            data.lapsedSeconds = _lapsedSeconds;

            _renderCallback(data);
        }
    }

    function _chime() {
        if (_.isFunction(_chimeCallback)) {
            _chimeCallback();
        }
    }

    exports.setRenderCallback = function (callback) {
        _setRenderCallback(callback);
    };

    exports.setChimeCallback = function (callback) {
        _setChimeCallback(callback);
    };

    exports.setSessionLength = function (value) {
        _setSessionLength(value);
    };

    exports.setBreakLength = function (value) {
        _setBreakLength(value);
    };

    exports.start = function () {
        _start();
    };

    exports.reset = function () {
        _reset();
    };

    exports.WORK = _WORK;
    exports.BREAK = _BREAK;
});
