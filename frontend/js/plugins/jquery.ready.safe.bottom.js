try {
  (function(window, document, $) {
    $.each(window.readyQ, function (i, f) {
      $(f);
    });

    $.each(window.bindReadyQ, function (i, f) {
      $(document).bind('ready', f);
    });
  })(window, document, jQuery);
} catch (e) {}