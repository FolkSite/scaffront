(function () {
  if (typeof $.fn.slick == 'undefined') { return; }

  var ns = '.js-slider';

  var $sliders = $(ns);
  if (!$sliders.length) { return; }

  $sliders.each(function () {
    var $slider = $(this);

    var $elements = {};

    $elements.slides = {};
    $elements.slides.container = $(ns +'__slides', $slider);
    $elements.slides.arrows = $(ns +'__slides-arrows', $slider);
    $elements.slides.viewport = $(ns +'__slides-viewport', $slider);

    $elements.previews = {};
    $elements.previews.container = $(ns +'__previews', $slider);
    $elements.previews.arrows = $(ns +'__previews-arrows', $slider);
    $elements.previews.viewport = $(ns +'__previews-viewport', $slider);

    var opts;
    if ($elements.slides.container.length && $elements.slides.viewport.length) {
      opts = {
        centerMode: false,
        centerPadding: 0,
        pauseOnDotsHover: 1,
        autoplay: false,
        adaptiveHeight: false,
        focusOnSelect: true,

        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        speed: 200
      };
      if ($elements.slides.arrows.length) {
        opts.arrows = true;
        opts.appendArrows = $elements.slides.arrows;
      } else {
        opts.arrows = false;
      }

      if ($elements.previews.container.length && $elements.previews.viewport.length) {
        opts.asNavFor = $elements.previews.viewport;
      }

      $elements.slides.viewport.slick(opts);
      $elements.slides.container.on('click', 'a', function (e) {
        e.preventDefault();
      });
    }

    if ($elements.previews.container.length && $elements.previews.viewport.length) {
      opts = {
        centerMode: false,
        centerPadding: 0,
        pauseOnDotsHover: 1,
        autoplay: false,
        adaptiveHeight: false,
        focusOnSelect: true,

        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        speed: 200
      };
      if ($elements.previews.arrows.length) {
        opts.arrows = true;
        opts.appendArrows = $elements.previews.arrows;
      } else {
        opts.arrows = false;
      }

      if ($elements.slides.container.length && $elements.slides.viewport.length) {
        opts.asNavFor = $elements.slides.viewport;
      }

      $elements.previews.viewport.slick(opts);
      $elements.previews.container.on('click', 'a', function (e) {
        e.preventDefault();
      });
    }

    //$previews.slick({
    //  //centerMode: false,
    //  //centerPadding: 0,
    //  slidesToShow: 4,
    //  slidesToScroll: 1,
    //  pauseOnDotsHover: true,
    //  autoplay: false,
    //  adaptiveHeight: false,
    //
    //  dots: false,
    //  arrows: true,
    //  appendArrows: $previewsArrows,
    //  speed: 200,
    //  asNavFor: $slides,
    //  focusOnSelect: true
    ////}).find('a').on('click', function (e) {
    ////  e.preventDefault();
    //});

  });
})();









