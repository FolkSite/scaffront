try{(function (window, document, $, undefined) {

  // https://www.google.ru/#q=browserify-shim&newwindow=1&tbs=lr:lang_1ru&lr=lang_ru
  // https://github.com/thlorenz/exorcist
  // https://github.com/thlorenz/es6ify
  // https://github.com/thlorenz/browserify-shim
  // https://www.npmjs.com/package/shimbro#purpose
  // https://medium.com/@mattdesl/gulp-and-browserify-shim-f1c587cb56b9#.ionwr0ltk
  // http://stackoverflow.com/questions/26480519/browserify-shim-does-not-resolve-dependencies
  // http://ru.stackoverflow.com/questions/457126/browserify-shim-%D0%B3%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE-%D0%B4%D0%BB%D1%8F-%D0%B2%D1%81%D0%B5%D1%85-%D0%B7%D0%B0%D0%B2%D0%B8%D1%81%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B5%D0%B9
  // https://toster.ru/q/176877

  //запаковать в bower библиотеки для plugin-exists и сериализации элементов формы
  //остальные сниппеты
  //спрайты


  //= include('include/forms.js')
  //= include('include/modals.js')
  //= include('include/product-slider.js')
  //= include('include/layout-slider.js')
  //= include('include/yt-video-ratio.js')
  //= include('include/bbc.js')



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


