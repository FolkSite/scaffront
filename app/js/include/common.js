if (typeof $.fn.afl != 'undefined') {
  $('.form').afl();
}

var formSelector = '#custom-project-form';
$('[type=file]', formSelector).on('change', function (e) {
  var $node = $(this);
  var name = $node.attr('name');
  if (!name) { return; }
  $('[data-value="'+ name +'"]', formSelector).html('"'+ $node.val() +'"');
});

if (typeof $.fn.stickyNavbar != 'undefined') {
  $('.menu').stickyNavbar({
    activeClass: "active",          // Class to be added to highlight nav elements
    sectionSelector: "layout-block",    // Class of the section that is interconnected with nav links
    animDuration: 250,              // Duration of jQuery animation
    startAt: 0,                     // Stick the menu at XXXpx from the top of the this() (nav container)
    easing: "linear",               // Easing type if jqueryEffects = true, use jQuery Easing plugin to extend easing types - gsgd.co.uk/sandbox/jquery/easing

    animateCSS: false,
    animateCSSRepeat: false,
    cssAnimation: "fadeInDown",     // AnimateCSS class that will be added to selector
    jqueryEffects: false,           // jQuery animation on/off
    jqueryAnim: "slideDown",        // jQuery animation type: fadeIn, show or slideDown
    selector: "a",                  // Selector to which activeClass will be added, either "a" or "li"
    mobile: false,                  // If false nav will not stick under 480px width of window
    mobileWidth: 480,               // The viewport width (without scrollbar) under which stickyNavbar will not be applied (due usability on mobile devices)
    zindex: 100,                   // The zindex value to apply to the element: default 9999, other option is "auto"
    stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
    unstickyModeClass: "unsticky"   // Class that will be applied to 'this' in non-sticky mode
  });
}

var getDOMIndex = function ($items, $search) {
  for (var index = 0, length = $items.length; index < length; index++) {
    if ($items.eq(index).is($search)) {
      return index;
    }
  }

  return -1;
};


CBHmetrika({
  button: 'Callbackhunter.button.click',
  main: 'Callbackhunter.Main.form.submit',
  deffered: 'Callbackhunter.Deffered.form.submit',
  letter: 'Callbackhunter.Letter.form.submit'
});
