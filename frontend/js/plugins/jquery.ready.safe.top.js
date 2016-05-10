(function(window, document, undefined) {
  if (typeof window.jQuery != 'undefined') { return; }

  window.readyQ = [];
  window.bindReadyQ = [];

  var p = function (x, y) {
    if (x == "ready") {
      window.bindReadyQ.push(y);
    } else {
      window.readyQ.push(x);
    }
  };
  var a = {
    ready: p,
    bind: p
  };

  window.$ = window.jQuery = function(f) {
    if (f === document || typeof f == 'undefined') {
      return a;
    } else {
      p(f);
    }
  };
})(window, document);