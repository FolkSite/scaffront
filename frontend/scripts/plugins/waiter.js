(function () {
  var root = this;
  if (typeof window == 'object' && this === window) {
    root = window;
  } else if (typeof global == 'object' && this === global) {
    root = global;
  } else {
    root = this;
  }

  /**
   * Logger
   */
  var log = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var consoleMethod = null;
    if (console) {
      if (typeof console.info != 'undefined') {
        consoleMethod = 'info';
      } else if (typeof console.log != 'undefined') {
        consoleMethod = 'log';
      }
    }

    if (consoleMethod) {
      console[consoleMethod].apply(console, ['[Waiter.js]'].concat(args));
    }
  };

  /**
   * Plug function
   */
  var noop = function () {};

  /**
   * Positive plug function
   * @returns {boolean}
   */
  var noopPositive = function () { return true; };

  /**
   * Return current timestamp in milliseconds
   * @returns {Number}
   */
  var getTimeInMs = function () {
    if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime();
      };
    }
    return Date.now();
  };

  /**
   * @param raw
   * @returns {Array}
   */
  var toArray = function (raw) {
    return Array.prototype.slice.call(raw, 0);
  };

  /**
   * @param arg
   * @returns {boolean}
   */
  var isArray = function (arg) {
    if (!Array.isArray) {
      Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };
    }

    return Array.isArray(arg);
  };

  /**
   * @param {[]} args
   * @returns {{}}
   */
  var _parseArgs = function (args) {
    var options = {};

    if (args.length == 1) {
      options = args[0];
    } else {
      options.timeout = args[0] || false;
      options.interval = args[1] || false;
      options.condition = args[2] || false;
      options.callback = args[3] || false;
    }

    var result = {};
    result.timeout = parseInt(options.timeout || 1, 10) || 1;
    result.interval = parseInt(options.interval || 1, 10) || 1;
    result.condition = (typeof options.condition == 'function') ? options.condition : noopPositive;
    result.callback = (typeof options.callback == 'function') ? options.callback : noop;

    return result;
  };

  /**
   *
   * @param {Number} timeout Max time in milliseconds
   * @param {Number} interval Interval in milliseconds
   * @param {Function} condition Return your condition's result or run callback with this result as first argument (if your handling is async). Not both together! If you return array then its will be passed to callback at the end of the list of arguments
   * @param {Function} callback Callback function
   * @returns {Waiter}
   * @constructor
   */
  function Waiter (timeout, interval, condition, callback) {
    var options,
        args = toArray(arguments),
        isCleanedArgs = args[4] || false;

    if (!isCleanedArgs) {
      options = _parseArgs(args);
      timeout = options.timeout;
      interval = options.interval;
      condition = options.condition;
      callback = options.callback;
    }

    // self constructor
    if (!(this instanceof Waiter)) {
      isCleanedArgs = true;
      return new Waiter(timeout, interval, condition, callback, isCleanedArgs);
    }

    this.timeout = timeout;
    this.interval = interval;
    this.condition = condition;
    this.callback = callback;

    /**
     * @type {boolean}
     */
    this.done = false;

    /**
     * @type {number}
     */
    this.elapsedTime = 0;

    /**
     * @type {number}
     */
    this.iteration = 0;

    /**
     * @type {Number}
     */
    this.tstart = getTimeInMs();

    this.check();
  }

  /**
   * @type {{constructor: Function, check: Function, afterCheck: Function, runCallback: Function}}
   */
  Waiter.prototype = {
    constructor: Waiter,

    check: function () {
      var self = this;
      var conditionResult, cbArgs;
      self.iteration = self.iteration + 1;
      self.elapsedTime = getTimeInMs() - self.tstart;
      if (!self.done) {
        if (self.elapsedTime <= self.timeout) {
          conditionResult = self.condition(self.elapsedTime, self.iteration, self.afterCheck.bind(this));
          self.afterCheck(conditionResult);
        } else {
          // timeout
          cbArgs = [new Error(Waiter.errText), self.elapsedTime, self.iteration];
          self.runCallback.apply(self, cbArgs);
        }
      }
    },
    afterCheck: function (conditionResult) {
      var self = this;
      var cbArgs;
      if (typeof conditionResult == 'undefined') { return; }

      if (!!conditionResult) {
        self.done = true;
        cbArgs = [null, self.elapsedTime, self.iteration];
        if (!isArray(conditionResult)) {
          conditionResult = [conditionResult];
        }
        cbArgs = cbArgs.concat(conditionResult);
        self.runCallback.apply(self, cbArgs);
      } else {
        setTimeout(function () {
          self.check();
        }, self.interval);
      }
    },
    runCallback: function (args) {
      if (typeof args == 'undefined' || !isArray(args)) {
        args = toArray(arguments);
      }

      this.callback.apply(root, args);
    }
  };

  /**
   * Error message if time elapsed with false condition
   * @type {string}
   */
  Waiter.errText = '[waiter.js] Timeout with false condition';

  // Node.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Waiter;
  }
  // AMD / RequireJS
  else if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
      return Waiter;
    });
  }
  // included directly via <script> tag
  else {
    root.waiter = root.Waiter = Waiter;
  }
})();
