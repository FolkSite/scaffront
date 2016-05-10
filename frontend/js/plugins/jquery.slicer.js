

(function (window, document, $, undefined) {
  var pluginName = 'slicer',
      defaults = {
        count: 0,
        items: ''
      };

  function Plugin ( element, options ) {
    this.element = element;
    this.$element = $(element);
    this.config = $.extend(true, {}, defaults, options);
    //this._defaults = defaults;
    this.name = pluginName;

    if (this.config.count && this.config.items) {
      this.init();
    }
  }

  $.extend(Plugin.prototype, {
    init: function () {
      var self = this;
      self.containers = [];

      self.$items = $(self.config.items, self.$element);
      self.getContainers();
      self.unwrap();

      for (var i = 0; i < self.$items.length; i = i + self.config.count) {
        self.wrap(self.$items.slice(i, i + self.config.count));
      }
    },
    getContainers: function ($nodes) {
      var self = this;
      $nodes = $nodes || self.$items;
      var $parent = $nodes.parentNode();
      if (!$parent.is(self.$element)) {
        self.containers.push($parent.clone(true).html(''));
        self.getContainers($parent);
      }
    },
    unwrap: function () {
      var length = this.containers.length;
      if (!length) { return; }

      var $nodes = this.$items;
      var $parent = this.$items.parentNode();

      while (!$parent.is(this.$element)) {
        $parent = $parent.parentNode();
        $nodes.unwrap();
      }

    },
    wrap: function ($nodes) {
      var self = this;
      var length = self.containers.length;
      for (var i = 0; i < length; i++) {
        $nodes.wrapAll(self.containers[i].clone(true));
        $nodes = $nodes.parentNode();
      }
    }
  });

  $.fn[pluginName] = function (options) {
    this.each(function() {
      if (!$.data(this, 'plugin_'+ pluginName)) {
        $.data(this, 'plugin_'+ pluginName, new Plugin(this, options));
      }
    });

    return this;
  };

})(this, document, jQuery);