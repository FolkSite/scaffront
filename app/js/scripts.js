(function (window, document, $, undefined) {

  var qwe = {};
  if (Array.isArray(qwe)) {
    console.log(qwe);
  }

  if (typeof bbc != 'undefined') {

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

  }


  if (typeof $.fn.afl != 'undefined') {
    $('.form').afl({

    }).on('success.afl', function () {
      var $form = $(this);
      (typeof bbc != 'undefined') && bbc($form);

      var thanksPage = $form.attr('data-thanks-page');
      var targetBlank = $form.attr('data-thanks-page-target-blank');
      if (thanksPage) {
        if (!!targetBlank) {
          window.open(thanksPage, '_blank'); // опасно! браузер такое блокирует
        } else {
          window.location.href = thanksPage;
        }
      }
    }).on('ajaxError.afl', function () {

    });
  }



  /*
   if (typeof URL != 'undefined') {
   var paramName = 'yatarget';
   waiter(2000, 100, function () {
   return typeof window.yaMetrika != 'undefined'
   }, function () {
   // current location
   var url = new Url();
   if (url.query && url.query[paramName]) {
   var yaTarget = url.query[paramName];
   reachGoal(yaTarget);

   if (window.history && window.history.replaceState) {
   delete(url.query[paramName]);
   window.history.replaceState(null, null, url.toString());
   }
   }
   });
   }
   */


})(window, document, jQuery);