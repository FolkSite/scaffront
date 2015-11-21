(function () {
  if (typeof YtIframe == 'undefined') { return; }

  var $videoContainers = $('.product__video');
  $videoContainers.each(function () {
    var $videoContainer = $(this);
    var ytUrl = $videoContainer.attr('data-yt-url');
    if (!ytUrl) { return; }

    var $ytIframe = $videoContainer.html(YtIframe(ytUrl)).children();
    $ytIframe.css({
      display: 'block',
      width: '100%'
    });

    if (typeof $.fn.fitVids != 'undefined') {
      $videoContainer.fitVids();
    }
  });
})();

