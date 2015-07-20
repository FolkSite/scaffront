

(function (window, document, $, undefined) {
  var pluginName = 'slicer',
      defaults = {
        count: 0,
        items: ''
      };

  function Plugin ( element, options ) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend(true, {}, defaults, options);
    //this._defaults = defaults;
    this._name = pluginName;

    if (this.options.count && this.options.items) {
      this.init();
    }
  }

  $.extend(Plugin.prototype, {
    init: function () {
      var self = this;
      self.containers = [];

      self.$items = $(self.options.items, self.$element);
      self.getContainers();
      self.unwrap();

      for (var i = 0; i < self.$items.length; i = i + self.options.count) {
        self.wrap(self.$items.slice(i, i + self.options.count));
      }
    },
    getContainers: function ($nodes) {
      var self = this;
      $nodes = $nodes || self.$items;
      var $parent = $nodes.parent();
      if (!$parent.is(self.$element)) {
        self.containers.push($parent.clone(true).html(''));
        self.getContainers($parent);
      }
    },
    unwrap: function () {
      var length = this.containers.length;
      if (!length) { return; }

      var $nodes = this.$items;
      var $parent = this.$items.parent();

      while (!$parent.is(this.$element)) {
        $parent = $parent.parent();
        $nodes.unwrap();
      }

    },
    wrap: function ($nodes) {
      var self = this;
      var length = self.containers.length;
      for (var i = 0; i < length; i++) {
        $nodes.wrapAll(self.containers[i].clone(true));
        $nodes = $nodes.parent();
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