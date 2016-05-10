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
      console[consoleMethod].apply(console, ['[cbhEvents]'].concat(args));
    }
  };


  var noop = function () {};

  var inited = false;
  var $cbhElement = $();
  var events = [
    'phoneClick',
    'callbackSubmit',
    'callbackDeferredSubmit',
    'callbackLetterSubmit'
  ];

  function cbhEvents () {
    if (this instanceof cbhEvents) {
      return cbhEvents();
    }

    log('You need to use "cbhEvents.on(\'{event}\', function () {});" syntax');
  }
  cbhEvents.on = noop;
  cbhEvents.off = noop;
  cbhEvents.helpMe = function () {
    log(events);
  };

  window.cbhEvents = cbhEvents;


  if (typeof window.waiter == 'undefined') {
    log('"Waiter.js" required! See: https://github.com/antixrist/waiter.js');
    return;
  }


  var getHandler = function (name, on, off) {
    var active = 0;
    var callback = noop;

    on = $.isFunction(on) ? on : noop;
    off = $.isFunction(off) ? off : noop;

    return {
      name: name,
      active: active,
      callback: callback,
      handler: handler,
      on: on,
      //on: function () {
      //  return on(handlers[name].callback.bind($cbhElement.get(0)));
      //},
      off: off
    };
  };
  var handlers = function () {};

  handlers.phoneClick = getHandler('phoneClick', function () {
    $(document).on('click', '#cbh_phone', function (e) {
      handlers.phoneClick.callback();
    });
  }, function () {
    $(document).off('click', '#cbh_phone');
  });

  handlers.callbackSubmit = getHandler('callbackSubmit', function () {
    var mainContainerSelector = '#cbh_item_call';
    $(document).on('click', mainContainerSelector +' #cbh_send', function () {
      var current = false;
      var prev = false;
      waiter(800, 250, function () {
        if (!prev) {
          // первая итерация
          prev = $('#cbh_timer', mainContainerSelector).html();
          return false;
        }

        current = $('#cbh_timer', mainContainerSelector).html();
        if (prev != current) {
          // если сработало это условие,
          // значит в таймере меняются циферки.
          // а значит валидация формы пройдена успешно
          return true;
        }
        prev = current;
        return false;
      }, function (err) {
        if (!err) {
          handlers.callbackSubmit.callback();
        }
      });
    });
  }, function () {
    var mainContainerSelector = '#cbh_item_call';
    $(document).off('click', mainContainerSelector +' #cbh_send');
  });

  handlers.callbackDeferredSubmit = getHandler('callbackDeferredSubmit', function () {
    var deferredContainerSelector = '#cbh_item_call_deferred';
    $(document).on('click', deferredContainerSelector +' #cbh_send_deferred', function () {
      waiter(500, 100, function () {
        return !$(deferredContainerSelector).hasClass('cbh-show');
      }, function () {
        handlers.callbackDeferredSubmit.callback();
      });
    });

  }, function () {
    var deferredContainerSelector = '#cbh_item_call_deferred';
    $(document).off('click', deferredContainerSelector +' #cbh_send_deferred');
  });

  handlers.callbackLetterSubmit = getHandler('callbackLetterSubmit', function () {
    var letterContainerSelector = '#cbh_item_dialog';
    $(document).on('click', letterContainerSelector +' .cbh-form-elem .cbh-button', function (e) {
      waiter(500, 100, function () {
        var $inputs = $('[name="question"],[name="email"],[name="phone"]', letterContainerSelector);
        return !$inputs.length || !$(letterContainerSelector).hasClass('cbh-show');
      }, function (err) {
        if (!err) {
          handlers.callbackLetterSubmit.callback();
        }
      });
    });
  }, function () {
    var letterContainerSelector = '#cbh_item_dialog';
    $(document).off('click', letterContainerSelector +' .cbh-form-elem .cbh-button');
  });



  cbhEvents.on = function (event, cb) {
    if (!name || $.inArray(name, events) < 0 || $.isFunction(handler)) {
      return;
    }

    handlers[event].active = 1;
    handlers[event].callback = cb.bind($cbhElement.get(0));

    if (inited) {
      handlers[event].on();
    }
  };

  cbhEvents.off = function (event) {
    if (!name || $.inArray(name, events) < 0) {
      return;
    }

    handlers[event].active = 0;
    handlers[event].callback = noop;
    handlers[event].off();
  };

  var _init = function (cb) {
    waiter(30000, 100, function () {
      return typeof window.ClbhObject != 'undefined';
    }, function (err) {
      if (err) {
        cb(err);
        return;
      }
      // cbh loaded
      var cbhContainer = '#cbh_container';

      waiter(10000, 200, function () {
        var $cbhContainer = $(cbhContainer);
        return ($cbhContainer.length) ? $cbhContainer : false;
      }, function (err, time, iter, $node) {
        if (err) {
          cb(err);
          return;
        }
        // cbh widjet appended to dom
        $cbhElement = $node;
        cb(null);
      });
    });
  };


  // start
  _init(function (err) {
    if (err) {
      log(err);
      return;
    }

    var event;
    for (var i = 0, length = events.length; i < length; i++) {
      event = events[i];
      if (!handlers[event] || !handlers[event].active) { continue; }

      handlers[event].on();
    }

    inited = true;
  });


})(window, document, jQuery);