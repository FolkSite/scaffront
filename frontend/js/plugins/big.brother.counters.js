(function (window, document, $, undefined) {

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
      console[consoleMethod].apply(console, ['[BigBrotherCounters]'].concat(args));
    }
  };


  if (typeof window.waiter == 'undefined') {
    log('"Waiter.js" required! See: https://github.com/antixrist/waiter.js');
    return;
  }

  // http://es5.javascript.ru/x15.4.html#x15.4.4.14
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
      var k;
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var O = Object(this);
      var len = O.length >>> 0;
      if (len === 0) { return -1; }
      var n = +fromIndex || 0;
      if (Math.abs(n) === Infinity) { n = 0; }
      if (n >= len) { return -1; }
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (k in O && O[k] === searchElement) { return k; }
        k++;
      }
      return -1;
    };
  }

  var utils = {
    noop: function () {},
    toArray: function (raw) {
      return Array.prototype.slice.call(raw, 0);
    },

    isNode: function (o){
      return (
          typeof Node === "object"
              ? o instanceof Node
              : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
      );
    },

    isElement: function (o){
      return (
          typeof HTMLElement === "object"
              ? o instanceof HTMLElement
              : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
      );
    },

    isDom: function (node) {
      return utils.isNode(node) || utils.isElement(node) || ((node instanceof $) && node.length);
    },

    jsonParse: function (input) {
      var tmp = null;
      if (typeof input == 'string') {
        try {
          tmp = JSON.parse(input);
        } catch (e) {}
        input = (tmp) ? tmp : input;
      }

      return input;
    },

    getNodeAttributes: function (node) {
      node = (node instanceof $) ? node.get(0) : node;
      if (!node) { return {}; }

      var attr,
          result = {},
          attributes = node.attributes;
      for (var i = 0, n = attributes.length; i < n; i++) {
        attr = attributes[i];
        result[attr.nodeName] = attr.nodeValue;
      }

      return result;
    }
  };


  var COUNTERS = [
    'metrika',
    'topMail',
    'vk',
    'ga'
  ];

  var counterTpl = {
    name: '',
    object: null,
    wasAttempt: 0,
    config: {},
    getObject: utils.noop,
    getArguments: utils.noop,
    push: utils.noop
  };

  for (var i = 0, length = COUNTERS.length; i < length; i++) {
    bbc[COUNTERS[i]] = $.extend({}, counterTpl);
    bbc[COUNTERS[i]].name = COUNTERS[i];
  }

  function bbc (input) {
    if (utils.isDom(input)) {
      var counter, attributes = utils.getNodeAttributes(input);
      for (var i = 0, length = COUNTERS.length; i < length; i++) {
        counter = bbc[COUNTERS[i]];
        counter.push.apply(window, counter.getArguments(attributes));
      }

    } else if ($.isPlainObject(input)) {
      bbc._setConfig(input);
    }
    // not a constructor
    return bbc;
  }
  bbc.debug = false;
  bbc.attrPrefix = 'data-bbc-';

  bbc._push = function (counter, arguments, cb) {
    if (!!bbc.debug) {
      log('Counter:', counter, '; arguments:', arguments);
    } else {
      $.isFunction(cb) && cb.apply(window, ($.isArray(arguments) ? arguments : [arguments]));
    }
  };
  bbc._setConfig = function (options) {
    options = ($.isPlainObject(options)) ? options : {};

    for (var counter in options) if (options.hasOwnProperty(counter)) {
      if (COUNTERS.indexOf(counter) >= 0 && bbc.hasOwnProperty(counter)) {
        bbc[counter].config = $.extend(true, bbc[counter].config, options);
      }
    }
  };


  bbc.metrika.getObject = function (cb) {
    if (bbc.metrika.object) { cb(bbc.metrika.object); }
    if (bbc.metrika.wasAttempt) { cb(null); }

    waiter(30000, 100, function () {
      var counterId;
      if (window.Ya && window.Ya._metrika && window.Ya._metrika.counter && window.Ya._metrika.counter._clickmap) {
        if (window.Ya._metrika.counter._clickmap.counterId) {
          counterId = window.Ya._metrika.counter._clickmap.counterId;
          if (typeof window['yaCounter'+ counterId] != 'undefined') {
            return [window['yaCounter'+ counterId]];
          }
        }
      }
      return false;
    }, function (err, elapsedTime, iteration, YaCounter) {
      bbc.metrika.wasAttempt = true;
      if (err) {
        log('Ya.Metrika not found!');
        cb(null);
      }

      if (YaCounter) { bbc.metrika.object = YaCounter; }
      cb(YaCounter);
    });
  };
  bbc.metrika.push = function (target, params) {
    if (!target) { return; }

    bbc._push(bbc.metrika, [target, params], function (target, params) {
      bbc.metrika.getObject(function (YaCounter) {
        if (!YaCounter) { return; }

        YaCounter.reachGoal(target, params);
      });
    });
  };
  bbc.metrika.getArguments = function (attrs) {
    var tmp = {}, matches;
    for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
      matches = attr.match(new RegExp('^'+ bbc.attrPrefix +'metrika-(.+)', ''));
      if (matches && matches[1]) {
        tmp[matches[1]] = attrs[attr];
      }
    }

    var result = [];
    if (tmp.target) { result.push(tmp.target); }
    if (typeof tmp.params != 'undefined') { result.push(utils.jsonParse(tmp.params)); }

    return result;
  };


  bbc.topMail.getObject = function (cb) {
    if (bbc.topMail.object) { cb(bbc.topMail.object); }
    if (bbc.topMail.wasAttempt) { cb(null); }

    waiter(30000, 100, function () {
      if (window._tmr && window._tmr.push && window._tmr.reachGoal) {
        return [window._tmr];
      }
      return false;
    }, function (err, elapsedTime, iteration, _tmr) {
      bbc.topMail.wasAttempt = true;
      if (err) {
        log('Top.Mail not found!');
        cb(null);
      }

      if (_tmr) { bbc.topMail.object = _tmr; }
      cb(_tmr);
    });
  };
  bbc.topMail.push = function (id, goal, value) {
    if (!id || !goal) { return; }

    var params = {
      id: id,
      goal: goal,
      type: 'reachGoal'
    };
    if (typeof value != 'undefined') {
      params.value = value;
    }

    bbc._push(bbc.topMail, [params], function (params) {
      bbc.topMail.getObject(function (_tmr) {
        if (!_tmr) { return; }

        _tmr.push(params);
      });
    });
  };
  bbc.topMail.getArguments = function (attrs) {
    var tmp = {}, matches;
    for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
      matches = attr.match(new RegExp('^'+ bbc.attrPrefix +'top-?mail-(.+)', ''));
      if (matches && matches[1]) {
        tmp[matches[1]] = attrs[attr];
      }
    }

    var result = [];
    if (tmp.id) { result.push(tmp.id); }
    if (tmp.goal) { result.push(tmp.goal); }
    if (typeof tmp.value != 'undefined') { result.push(utils.jsonParse(tmp.value)); }

    return result;
  };


  bbc.vk.push = function (retargetCode) {
    if (!retargetCode) { return; }

    bbc._push(bbc.vk, [retargetCode], function (retargetCode) {
      (window.Image ? (new Image()) : document.createElement('img')).src = location.protocol + '//vk.com/rtrg?r='+ retargetCode.toString() +'&'+ (new Date()).getTime();
    });
  };
  bbc.vk.getArguments = function (attrs) {
    var tmp = {}, matches;
    for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
      matches = attr.match(new RegExp('^'+ bbc.attrPrefix +'vk-(.+)', ''));
      if (matches && matches[1]) {
        tmp[matches[1]] = attrs[attr];
      }
    }

    var result = [];
    if (tmp.retarget) { result.push(tmp.retarget); }

    return result;
  };


  bbc.ga.getObject = function (cb) {
    if (bbc.ga.object) { cb(bbc.ga.object); }
    if (bbc.ga.wasAttempt) { cb(null); }

    waiter(30000, 100, function () {
      if (window['GoogleAnalyticsObject'] && window[window['GoogleAnalyticsObject']]) {
        return [window[window['GoogleAnalyticsObject']]];
      }
      return false;
    }, function (err, elapsedTime, iteration, ga) {
      bbc.ga.wasAttempt = true;
      if (err) {
        log('Google.Analytics not found');
        cb(null);
      }

      if (ga) { bbc.ga.object = ga; }
      cb(ga);
    });
  };
  bbc.ga.push = function () {
    var args = utils.toArray(arguments);
    if (!args.length) { return; }

    bbc._push(bbc.ga, args, function () {
      var args = utils.toArray(arguments);
      bbc.ga.getObject(function (ga) {
        if (!ga) { return; }

        ga.apply(window, args);
      });
    });
  };
  bbc.ga.getArguments = function (attrs) {
    var result = [], matches, min = Infinity;
    for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
      matches = attr.match(new RegExp('^'+ bbc.attrPrefix +'ga-([\\d]+)', ''));
      if (matches && matches[1]) {
        matches[1] = parseInt(matches[1], 10);
        min = (matches[1] < min) ? matches[1] : min;
        result[matches[1]] = utils.jsonParse(attrs[attr]);
      }
    }

    result.splice(0, min);
    return result;
  };


  window.bbc = bbc;

})(window, document, jQuery);