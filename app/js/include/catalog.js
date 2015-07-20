var $gallery = $('.catalog-gallery');

//$gallery.css({
//  visibility: 'hidden'
//});

$('.catalog-gallery__pages', $gallery).slicer({
  count: 6,
  items: '.catalog-gallery__preview'
});


$gallery.each(function (index, node) {
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
    arrows: false,
    pages: selectors.pages,
    autoplay: false,
    fluid: true
  });

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

$(window).on('resize', $.debounce(100, function (e) {
  $gallery.each(function (index, node) {
    var $slider = $(node);
    var $slides = $('.catalog-gallery__grid', $slider);

    var max = 0;
    $slides.each(function (i, slide) {
      var $slide = $(slide);
      $slide.css({
        height: 'auto',
        minHeight: 'auto'
      });
      var height = $slide.actual('outerHeight');
      max = (height > max) ? height : max;
    });

    $slides.css({
      minHeight: max
    });

    $slider.data('unslider').to($slider.data('unslider').i);
  });
}));

//$gallery.css({
//  visibility: 'visible'
//});


$('.project').each(function (index, project) {
  var $project = $(project);
    $project.closest('.modal').on('shown.bs.modal', (function ($project) {
      return function (e) {
        var $photosSlider = $('[data-slider="photos"]', $project);
        var $previewsSlider = $('[data-slider="previews"]', $project);

        if ($photosSlider.hasClass('slick-initialized')) { return; }

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

        var $previewsSlides = $previewsSlider.find('[data-slider__slide]');
        $previewsSlides.filter('.slick-cloned').remove();
        //$previewsSlides.filter(':last-child').remove();

        $photosSlider.slick({
          centerPadding: 0,
          slidesToShow: 1,
          slidesToScroll: 1,
          asNavFor: $previewsSlider,
          arrows: false,
          dots: false,
          speed: 200,
          autoplay: false
        });

      };
    })($project));
});
