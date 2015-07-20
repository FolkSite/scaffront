var $body = $('body');
if (typeof $.fn.fancybox != 'undefined') {
  var fancyDefaults = {
    //minWidth: 940,
    maxWidth: 1250,
    closeClick: false,
    padding: 0,
    margin: 50,
    wrapCSS: 'custom-fancy',
    autoCenter: true,
    //fitToView: true,
    autoSize: true,
    //autoHeight: true,
    //autoWidth: true,
    //scrolling: false,
    helpers: {
      overlay: {
        locked: false,
        css: {
          background: 'rgba(0, 0, 0, .5)'
        }
      }
    },
    beforeShow: function() {
      $body.css({'overflow-y':'hidden'});
    },
    afterClose: function() {
      $body.css({'overflow-y':'visible'});
    }
  };

  var fancySelector = '.fancy, .preview';
  $(fancySelector).fancybox(fancyDefaults);
  $(document).on('click', fancySelector, function (e) {
    e.preventDefault();
  });

  //$('.modal').fancybox(fancyDefaults);
}

