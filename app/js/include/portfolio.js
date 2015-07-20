var $portfolioSlider = $('[data-slider="portfolio"]');

$('.portfolio-item', $portfolioSlider).each(function (itemIndex, node) {
  var $portfolioItem = $(node);
  var ts = (new Date()).getTime();
  var id = 'portfolio-item-'+ itemIndex +'-'+ ts;

  $portfolioItem.attr('id', id);

  var $photosSlider = $('[data-slider="photos"]', $portfolioItem);
  var $previewsSlider = $('[data-slider="previews"]', $portfolioItem);

  $previewsSlider.slick({
    centerPadding: 0,
    slidesToShow: 0,
    slidesToScroll: 1,
    asNavFor: $photosSlider,
    dots: false,
    arrows: false,
    centerMode: true,
    focusOnSelect: true,
    speed: 200,
    autoplay: false
  }).find('a').on('click', function (e) {
    e.preventDefault();
  });

  var $previewsSlides =  $previewsSlider.find('[data-slider__slide]');
  $previewsSlides.filter(':first-child').remove();
  $previewsSlides.filter(':last-child').remove();

  $photosSlider.slick({
    centerPadding: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: $previewsSlider,
    arrows: false,
    dots: false,
    speed: 200,
    autoplay: false,
    adaptiveHeight: true
  });

  $('[data-toggle="tab"]', $portfolioItem).each(function (index, tab) {
    var $tab = $(tab);

    var dataTarget = $tab.attr('data-target');
    var href = $tab.attr('href');
    var newTarget = dataTarget || href;
    newTarget = '#'+ id +' '+ newTarget;

    $tab.attr('data-target', newTarget);
    $tab.attr('href', '#');

    $tab.on('shown.bs.tab', function (e) {
      var $tab = $(this);
      var $parentSlider = $tab.closest($portfolioSlider);
      var $parentSlide = $tab.closest('[data-slider__slide]');
      $parentSlider.data('unslider').to(getDOMIndex($parentSlide.parent().children(), $parentSlide));
    });
  });

  var timeout = false;
  $photosSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
    timeout = window.setTimeout((function (slick) {
      return function () {
        var $parentSlider = slick.$slider.closest($portfolioSlider);
        var $parentSlide = slick.$slider.closest('[data-slider__slide]');
        $parentSlider.data('unslider').to(getDOMIndex($parentSlide.parent().children(), $parentSlide));
      };
    })(slick), slick.options.speed);
  });

  $previewsSlider.on('setPosition', $.debounce(100, function (e, slick) {
    var $tabPanes = $('.tab-pane', slick.$slider.closest('.tab-content'));
    var max = 0;
    $tabPanes.each(function (paneIndex, pane) {
      var $pane = $(pane);
      $pane.css({
        minHeight: 'auto',
        height: 'auto'
      });
      var height = $pane.actual('outerHeight');
      max = (height > max) ? height : max;
    });
    $tabPanes.css({minHeight: max});

    var $parentSlider = slick.$slider.closest($portfolioSlider);
    var $parentSlide = slick.$slider.closest('[data-slider__slide]');
    $parentSlider.data('unslider').to($parentSlider.data('unslider').i);
    //$parentSlider.data('unslider').to(getDOMIndex($parentSlide.parent().children(), $parentSlide));
  }));

});


$portfolioSlider.each(function (index, node) {
  var $slider = $(node);
  var group = $slider.attr('data-slider');

  var suffix = '';
  var prefix = '';
  if (group) {
    suffix = '="'+ group +'"';
  } else {
    prefix = '>';
  }

  var selectors = {
    slides: prefix +'[data-slider__slides'+ suffix +']',
    slide: prefix +'[data-slider__slide'+ suffix +']',
    prev: prefix +'[data-slider__prev'+ suffix +']',
    next: prefix +'[data-slider__next'+ suffix +']',
    pages: prefix +'[data-slider__pages'+ suffix +']'
  };

  $slider.unslider({
    items: selectors.slides,
    item: selectors.slide,
    pages: selectors.pages,
    arrows: false,
    speed: 200,
    autoplay: false,
    fluid: true
  });
  $slider.data('unslider').to(0);

  $(document)
      .on('click', selectors.prev, (function ($slider) {
        return function (e) {
          e.preventDefault();
          $slider.data('unslider').prev();
        };
      })($slider))
      .on('click', selectors.next, (function ($slider) {
        return function (e) {
          e.preventDefault();
          $slider.data('unslider').next();
        };
      })($slider));
});


