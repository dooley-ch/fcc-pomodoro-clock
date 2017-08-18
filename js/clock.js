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

    /**
     * Stops the timer
     * @private
     */
    function _stopTimer() {
        if (_timer) {
            clearTimeout(_timer);
        }
    }

    /**
     * Starts the timer
     * @private
     */
    function _startTimer() {
        _timer = setTimeout(_timerCallback, 1000);
    }

    /**
     * This function is called once every second when the
     * timer fires.  It adds a second to the lapsed time
     * and restarts the timer if the session has not been
     * completed
     * @private
     */
    function _timerCallback() {
        _stopTimer();
        _addSecond();

        if (!_completed()) {
            _startTimer();
        }
    }

    /**
     * Resets the counters and sets the mode
     * @private
     * @param {number} newMode The new session mode: work or break
     */
    function _resetMode(newMode) {
        _lapsedSeconds = 0;
        _lapsedMinutes = 0;
        _mode = newMode;
    }

    /**
     * Stores the reference to the render callback function
     * @private
     * @param {function} callback The function to be called when the clock needs to render it's status.
     */
    function _setRenderCallback(callback) {
        if (_.isFunction(callback)) {
            _renderCallback = callback;
        }
    }

    /**
     * Stores the reference to chime callback function
     * @private
     * @param {function} callback The function to call when the clock needs to play the chime at the end of the session
     */
    function _setChimeCallback(callback) {
        if (_.isFunction(callback)) {
            _chimeCallback = callback;
        }
    }

    /**
     * Sets the length of the work session
     * @private
     * @param {number} value The new work session length
     */
    function _setSessionLength(value) {
        if (value > 0) {
            _sessionLength = value;
        }
    }

    /**
     * Sets the length of the break session
     * @private
     * @param {number} value The new break session length
     */
    function _setBreakLength(value) {
        if (value > 0) {
            _breakLength = value;
        }
    }

    /**
     * Starts the clock
     * @private
     */
    function _start() {
        _startTimer();
        _render();
    }

    /**
     * Stops the clock and resets it
     * @private
     */
    function _reset() {
        _stopTimer();
        _resetMode(0);
    }

    /**
     * Adds a second to the lapsed time and displays it
     * @private
     */
    function _addSecond() {
        _lapsedSeconds++;
        if (_lapsedSeconds == 60) {
            _lapsedMinutes++;
            _lapsedSeconds = 0;
        }

        _render();
    }

    /**
     * Checks if the session has been completed. And if so sets off the chime,
     * then resets the session for the next round.
     * @private
     * @returns {boolean} True if the session has ended, otherwise false.
     */
    function _completed() {
        if (_mode == _WORK) {
            if (_lapsedMinutes >= _sessionLength) {
                _chime();
                _resetMode(_BREAK);
                _render();

                return true;
            }
        } else {
            if (_lapsedMinutes >= _breakLength) {
                _chime();
                _resetMode(_WORK);
                _render();

                return true;
            }
        }

        return false;
    }

    /**
     * Prepares the clock data for rendering and calls the render callback function.
     * @private
     */
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

    /**
     * Executes the chime callback function when required
     * @private
     */
    function _chime() {
        if (_.isFunction(_chimeCallback)) {
            _chimeCallback();
        }
    }

    /**
     * Sets the render callback
     * @param {function} callback Function to render the clock data
     */
    exports.setRenderCallback = function (callback) {
        _setRenderCallback(callback);
    };

    /**
     * Sets the chime callback
     * @param {function} callback Function to play the chime
     */
    exports.setChimeCallback = function (callback) {
        _setChimeCallback(callback);
    };

    /**
     * Sets the session length
     * @param {number} value The new session length
     */
    exports.setSessionLength = function (value) {
        _setSessionLength(value);
    };

    /**
     * Sets the break length
     * @param {number} value The new break length
     */
    exports.setBreakLength = function (value) {
        _setBreakLength(value);
    };

    /**
     * Starts the clock
     */
    exports.start = function () {
        _start();
    };

    /**
     * Stops the clock
     */
    exports.reset = function () {
        _reset();
    };

    exports.WORK = _WORK;
    exports.BREAK = _BREAK;
});
