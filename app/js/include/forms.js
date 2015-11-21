(function () {
  if (typeof $.fn.afl == 'undefined') { return; }

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

})();