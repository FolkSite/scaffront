var $recalls = $('.recalls');

$('[data-slider="recalls"]', $recalls).each(function (index, slider) {
  var $slider = $(slider);

  //$('.recalls__list__pages', $slider).slicer({
  //  count: 5,
  //  items: '.recall'
  //});

  $('[data-slider__slides="recalls"]', $slider).slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    speed: 200,
    centerMode: false,
    centerPadding: 0,
    appendArrows: $('[data-slider__arrows="recalls"]', $slider),
    prevArrow: '<div data-slider__prev="recalls" class="slider__direction--yellow slider__direction--big"></div>',
    nextArrow: '<div data-slider__next="recalls" class="slider__direction--yellow slider__direction--big"></div>',
    autoplay: false
  });


});


if (typeof YtIframe != 'undefined') {
  var $mediaContainer = $('.recalls__media');
  var ytUrl = $mediaContainer.attr('data-yt-url');
  if (ytUrl) {
    var $ytIframe = $mediaContainer.html(YtIframe(ytUrl)).children();
    $ytIframe.css({
      display: 'block',
      width: '100%'
    });

    if (typeof $.fn.fitVids != 'undefined') {
      $mediaContainer.fitVids();
    }
  }

}


