(function () {
  if (typeof $.fn.magnificPopup == 'undefined') { return; }

  $('.go-to-modal').magnificPopup({
    type: 'inline',
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
  });

})();


