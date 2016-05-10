(function () {
  if (typeof bbc == 'undefined') { return; }

  bbc.debug = true;

  $(document).on('click', '[data-bbc]:not(form)', function (e) {
    bbc(this);
  });

  if (typeof cbhEvents != 'undefined') {
    cbhEvents.on('phoneClick', function () {
      bbc.metrika.push('CallbackHunter.phoneClick');
    }).on('callbackSubmit', function () {
      bbc.metrika.push('CallbackHunter.callbackSubmit');
    }).on('callbackDeferredSubmit', function () {
      bbc.metrika.push('CallbackHunter.callbackDeferredSubmit');
    }).on('callbackLetterSubmit', function () {
      bbc.metrika.push('CallbackHunter.callbackLetterSubmit');
    });
  }

})();