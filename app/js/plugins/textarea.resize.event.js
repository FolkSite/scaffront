/**
 * Textarea resize event
 */
(function ($, window, document, undefined) {
  var $textareas = $('textarea');
  $textareas.each(function (i, textarea) {
    var $this = $(textarea);
    $this.data('x', $this.outerWidth()).data('y', $this.outerHeight());
  }).on('mousedown',function (e) {
    var $this = $(this);
    $this.on('mousemove', function (e) {
      if ($this.outerWidth() !== $this.data('x') || $this.outerHeight() !== $this.data('y')) {
        $this.data('x', $this.outerWidth());
        $this.data('y', $this.outerHeight());
        $this.triggerHandler('resize');
      }
    });
  }).on('mouseup', function (e) {
    $(this).off('mousemove');
  });
})(jQuery, window, document);