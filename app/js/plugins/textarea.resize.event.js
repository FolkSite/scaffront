/*
 *  'resize' event for form controls
 *  https://github.com/antixrist/jquery.resize.event
 *
 *  Under WTFPL License
 */
;(function (window, document, $, undefined) {$(document).ready(function () {

  var pluginName = 'resize.event';
  var defaults = {
    fireOnKeyDown: false,
    fireOnKeyUp: false,
    fireOnKeyPress: false
  };

  var Plugin = function (element, options) {
    this._name = pluginName;
    /** @type {jQuery|HTMLElement} */
    this.$el =  $(element);
    /** @type {HTMLElement} */
    this.el = this.$el.get(0);
    this._defaults = defaults;
    this.options = {};

    this.setOptions(defaults);
    this.setOptions(options || {});

    this.init();
  };

  $.extend(Plugin.prototype, {
    /**
     * @param {{}} options
     */
    setOptions: function setOptions (options) {
      options = $.isPlainObject(options) ? options : {};
      return this.options = $.extend(true, this.options, options);
    },
    /**
     * @returns {{}}
     */
    getOptions: function setOptions () {
      return this.options;
    },
    /**
     * @param node
     * @returns {jQuery|HTMLElement}
     * @private
     */
    $: function (node) {
      return $(node, this.$el);
    },
    init: function init () {
      this.bindEvents();

      this.sizes = null;
      this.previousSizes = null;

      this.storeSizes();
    },
    bindEvents: function bindEvents () {
      var self = this;

      var triggeredEvents = [];

      if (this.options.fireOnKeyDown) {
        triggeredEvents.push('keydown');
      }
      if (this.options.fireOnKeyUp) {
        triggeredEvents.push('keyup');
      }
      if (this.options.fireOnKeyPress) {
        triggeredEvents.push('keypress');
      }

      this.$el
        .on(triggeredEvents.concat(['focus']).join(' '), function () {
          self.storeSizes(this, self.getControlSizes());
        });

      if (triggeredEvents.length) {
        this.$el
          .on(triggeredEvents.join(' '), function () {
            self.eventHandler();
          });
      }

      this.$el
        .on('mousedown',function () {
          var $this = $(this);
          $this.on('mousemove', function () {
            self.eventHandler();
          });
        })
        .on('mouseup', function () {
          $(this).off('mousemove');
        });

    },
    eventHandler: function eventHandler () {
      this.storeSizes();
      if (this.sizesChanged()) {
        this.triggerResizeEvent();
      }
    },
    getControlSizes: function getControlSizes () {
      return {
        width: this.$el.outerWidth(),
        height: this.$el.outerHeight()
      }
    },
    triggerResizeEvent: function triggerResizeEvent () {
      this.$el.triggerHandler('resize');
    },
    storeSizes: function storeSizes () {
      var currentSizes = this.getControlSizes();
      if (!this.previousSizes) {
        // first init
        this.previousSizes = currentSizes;
      } else {
        this.previousSizes = this.sizes;
      }
      this.sizes = currentSizes;
    },
    sizesChanged: function sizesChanged () {
      for (var key in this.sizes) if (this.sizes.hasOwnProperty(key)) {
        if (this.previousSizes[key] !== this.sizes[key]) {
          return true;
        }
      }

      return false;
    }
  });

  $.fn[pluginName] = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    var config = null;
    if (args.length && $.isPlainObject(args[0])) {
      config = args[0];
    }

    this.each(function () {
      var instance = $.data(this, 'plugin_'+ pluginName);
      if (!instance) {
        instance = new (Function.prototype.bind.apply(Plugin, [null, this].concat(args)));
        $.data(this, 'plugin_'+ pluginName, instance);
      }

      if (config) {
        instance.setOptions(config);
      }
    });

    return this;
  };

});})(window, document, jQuery);
