var waiter = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  var timeout, interval, condition, cb;
  if (args.length == 1) {
    timeout = args[0].timeout || 0;
    interval = args[0].interval || 0;
    condition = (typeof args[0].condition == 'function') ? args[0].condition : false;
    cb = (typeof args[0].callback == 'function') ? args[0].callback : false;
  } else {
    timeout = args[0] || 0;
    interval = args[1] || 0;
    condition = (typeof args[2] == 'function') ? args[2] : false;
    cb = (typeof args[3] == 'function') ? args[3] : false;
  }

  if (
    !interval || !timeout || !condition || !cb ||
    interval >= timeout
  ) { return; }

  var loaded = false;
  var i = 0;
  var check = function () {
    window.setTimeout(function () {
      i = i + 1;
      if (!loaded && i*interval < timeout) { check(); }
      if (!!condition() && !loaded) {
        loaded = true;
        cb();
      }
    }, interval);
  };
  check();
};

