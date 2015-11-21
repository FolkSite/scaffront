try{(function (window, document, $, undefined) {

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
(function () {
  if (typeof $.fn.magnificPopup == 'undefined') { return; }

  $('.go-to-modal').magnificPopup({
    type: 'inline',
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
  });

})();



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


  $(document).on('mouseenter', '.catalog--pick-out .catalog__item', function () {
    var $node = $(this);

    $node.css({height: $node.outerHeight()}).addClass('hover');
  }).on('mouseleave', '.catalog--pick-out .catalog__item', function () {
    var $node = $(this);
    $node.css({height: 'auto'}).removeClass('hover');
  });

})(window, document, jQuery);} catch (e) { console.error(e); }


