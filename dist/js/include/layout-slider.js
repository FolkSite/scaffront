(function () {
  if (typeof $.fn.slick == 'undefined') { return; }

  $('.layout-slider').each(function (index, slider) {
    var $slider = $(slider);

    $('.layout-slider__items', $slider).slick({
      autoplay: true,
      autoplaySpeed: 10000,
      arrows: false,
      dots: true,
      dotsClass: 'layout-slider__pages',
      customPaging: function(slider, i) {
        //return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + '</button>';
        return '<a href="#" class="layout-slider__page-link"><span class="layout-slider__page-link__inner">' + (i + 1) + '</span></a>';
      },
      pauseOnDotsHover: true,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'ease-out',
      swipe: false,
      adaptiveHeight: true
    });

  });
})();

