(function() {
  var method;
  var noop = function () {};
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

//= plugins/jquery.slicer.js
//= plugins/jquery.fancybox.js
//= plugins/jquery.bootstrap.modal.js
//= plugins/jquery.actual.js
//= plugins/jquery.ba-throttle-debounce.js

//= plugins/jquery.easing.1.3.js
//= plugins/ytiframe.js
//= plugins/jquery.fitvids.js
//= plugins/jquery.bootstrap.tabs.js
//= plugins/jquery.stickyNavbar.js
//= plugins/unslider.custom.js
//= plugins/slick.js
//= plugins/jquery.form.js
//= plugins/jquery.ajax.form.loader.js
//= plugins/url.js
//= plugins/waiter.js
//= plugins/targets.metrika.js
