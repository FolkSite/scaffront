var handleComplactationMan = function ($target, $complectation) {
  if ($target.length && $target.hasClass('cleaned')) {
    $complectation.addClass('cleaned');
  } else {
    $complectation.removeClass('cleaned');
  }
};

$('.complectation').each(function (i, complectation) {
  var $complectation = $(complectation);

  $('[data-toggle="tab"]', $complectation).on('shown.bs.tab', function (e) {
    var $tab = $(this);

    var $target = $($tab.attr('data-target') || $tab.attr('href'));
    handleComplactationMan($target, $complectation);
  });

  handleComplactationMan($('.tab-pane.active', $complectation), $complectation);

});