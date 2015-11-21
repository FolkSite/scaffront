/*
 * Project: Fit To Parent blocks
 * Author: http://github.com/antixrist
 * License: MIT
 */

(function ($, window, document, undefined) {
  var pluginName = "ftp";
  var defaults = {
    position: "center center",
    css: {
      position: 'absolute',
      padding: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      visibility: 'visible'
    },
    dimentions: {}
  };

  var Plugin = function (element, options) {
    this.element = element;
    this.$element = $(element);
    this.$parent = this.$element.parent();
    this.options = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.css = this.options.css;
    this.scaleData = {};
    this.init();
  };

  Plugin.prototype = {
    constructor: Plugin,

    definePositions: function () {
      var positions = this.options.position.split(' ');
      var verticalPositions = {top: 'top', bottom: 'bottom'};
      var horizontalPositions = {left: 'left', right: 'right'};
      var vertical = verticalPositions[positions[0]] || verticalPositions[positions[1]] || 'center';
      var horizontal = horizontalPositions[positions[0]] || horizontalPositions[positions[1]] || 'center';

      this.positions = {
        vertical: vertical,
        horizontal: horizontal
      };
    },
    positioning: function () {
      var css = {};

      if (this.positions.vertical === 'center') {
        css.top = '50%';
        css.marginTop = -(this.scaleData.height/2);
      } else {
        css[this.positions.vertical] = 0;
      }
      if (this.positions.horizontal === 'center') {
        css.left = '50%';
        css.marginLeft = -(this.scaleData.width/2);
      } else {
        css[this.positions.horizontal] = 0;
      }

      this.css = $.extend(this.css, css);
    },
    setScaleData: function () {
      var width = this.blockDimentions.width;
      var height = this.blockDimentions.height;
      if (width > height) {
        this.scaleData.ratio = width/height;
        this.scaleData.orientation = 'landscape';
      } else if (width < height) {
        this.scaleData.ratio = height/width;
        this.scaleData.orientation = 'portrait';
      } else {
        this.scaleData.ratio = 1;
        this.scaleData.orientation = false;
      }
    },
    cover: function () {
      var parentDimentions = {
        width: this.$parent.outerWidth(),
        height: this.$parent.outerHeight()
      };

      console.log(this.$parent, parentDimentions);

      var newWidth,
          newHeight;
      switch (this.scaleData.orientation) {
        case 'portrait':
          newHeight = parentDimentions.height;
          newWidth = newHeight / this.scaleData.ratio;
          if (newWidth < parentDimentions.width) {
            newWidth = parentDimentions.width;
            newHeight = newWidth * this.scaleData.ratio;
          }
          break;
        case 'landscape':
        /* falls through */
        default:
          newWidth = parentDimentions.width;
          newHeight = newWidth / this.scaleData.ratio;
          if (newHeight < parentDimentions.height) {
            newHeight = parentDimentions.height;
            newWidth = newHeight * this.scaleData.ratio;
          }
          break;
      }

      this.scaleData.height = newHeight;
      this.scaleData.width = newWidth;

      this.css = $.extend(this.css, {
        height: newHeight,
        width: newWidth
      });
    },
    setCss: function () {
      if (this.$parent.css('position') === 'static') {
        this.$parent.css({
          position: 'relative',
          overflow: 'hidden'
        });
      }
      this.$element.css(this.css);
    },
    init: function () {
      this.blockDimentions = $.extend({
        width: parseInt(this.$element.data('width'), 10),
        height: parseInt(this.$element.data('height'), 10)
      }, this.options.dimentions);
      if (!this.blockDimentions.width || !this.blockDimentions.height) {
        this.blockDimentions = {
          width: this.$element.outerWidth(),
          height: this.$element.outerHeight()
        };
      }

      this.$element
        //          .width(this.blockDimentions.width)
        //          .height(this.blockDimentions.height)
        // hide this
          .css({visibility: 'hidden'});

      this.setScaleData();
      this.definePositions();
      this.cover();
      this.positioning();
      this.setCss();

      var self = this;
      $(window).on('resize.'+ self._name, function (e) {
        self.cover();
        self.positioning();
        self.setCss();
      });//.triggerHandler('resize.'+ self._name);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);