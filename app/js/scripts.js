try{(function (window, document, $, undefined) {

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


