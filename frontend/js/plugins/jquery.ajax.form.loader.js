;(function ( $, window, document, undefined ) {
  var pluginName = "afl",
      defaults = {
        classes: {
          form: {
            error: 'error',
            success: 'success',
            loading: 'loading'
          },
          message: {
            error: 'error',
            success: 'success'
          },
          field: {
            error: 'error',
            success: 'success'
          },
          fieldMessage: {
            error: 'error',
            success: 'success'
          },
          fieldWrapper: {
            error: 'error',
            success: 'success'
          }
        },
        selectors: {
          fieldMessage: '.form__group-message',
          formMessage: '.form__message',
          fieldWrapper: '.form__group',
          fieldMessageAttr: 'data-message'
        },
        loading: {
          timer: 300,
          disableInputs: true
        },
        defaultErrorMessage: 'Извините, но произошла какая-то ошибка :-(<br>Проверьте, пожалуйста, - подключен ли у вас интернет.'
      };

  function Plugin ( element, options ) {
    this.element = element;
    this.$element = $(element);
    this.config = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this.name = pluginName;
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function () {
      var self = this;

      self.timerResponseOver = false;
      self.timerMinTimeOver = false;
      self.response = null;
      self.loading = false;

      self.bindEvents();
    },
    setFormMessage: function (message, success) {
      var self = this;
      message = message.toString() || '';
      var className = '';
      if (success !== null) {
        className = (!!success) ? self.config.classes.message.success : self.config.classes.message.error;
      }

      var $messageBlocks = $(self.config.selectors.formMessage, self.element);
      $messageBlocks.each(function () {
        var $messageBlock = $(this);
        $messageBlock.html(message);
        $messageBlock.removeClass(self.config.classes.message.error +' '+ self.config.classes.message.success).addClass(className);
      });
    },
    clearFormMessage: function () {
      var self = this;
      self.setFormMessage('', null);
    },
    _getInputs: function (name, value) {
      var self = this, selector = '', $inputs;
      if (typeof name == 'undefined') {
        $inputs = $('input,textarea,select,button', self.$element);
      } else {
        name = name.toString() || '';
        selector = '[name="'+ name +'"]';
        value = value && value.toString() || '';
        selector += (value) ? '[value="'+ value +'"]' : '';
        $inputs = $(selector, self.$element);
      }

      return $inputs;
    },
    setFieldFocus: function (name, value) {
      var self = this;
      var $inputs = self._getInputs(name, value);
      $($inputs[0]).focus();
    },
    setFormResultStatus: function (success, message) {
      var self = this;

      message = message.toString() || '';
      var className = '';
      if (success !== null) {
        className = (!!success) ? self.config.classes.form.success : self.config.classes.form.error;
      }

      self.$element.removeClass(self.config.classes.form.success +' '+ self.config.classes.form.error).addClass(className);

      if (message) {
        self.setFormMessage(message, success);
      }
    },
    setFieldStatus: function (message, success, name, value) {
      var self = this;

      name = (typeof name != 'undefined') ? name.toString() || '' : '';
      if (!name) {return;}
      value = (typeof value != 'undefined') ? value.toString() || '' : '';

      message = message.toString() || '';

      var inputClassName = '',
          wrapperClassName = '',
          messageClassName = '';
      if (success !== null) {
        inputClassName =    (!!success) ? self.config.classes.field.success        : self.config.classes.field.error;
        wrapperClassName =  (!!success) ? self.config.classes.fieldWrapper.success : self.config.classes.fieldWrapper.error;
        messageClassName =  (!!success) ? self.config.classes.fieldMessage.success : self.config.classes.fieldMessage.error;
      }

      self._getInputs(name, value).each(function () {
        var $input = $(this);
        $input.removeClass(self.config.classes.field.error +' '+ self.config.classes.field.success).addClass(inputClassName);

        var $wrapper = $input.closest(self.config.selectors.fieldWrapper);
        if ($wrapper.length) {
          $wrapper.removeClass(self.config.classes.fieldWrapper.error +' '+ self.config.classes.fieldWrapper.success).addClass(wrapperClassName);
        }

        var $messageBlocks = $();
        var inputMessageSelector = $input.attr(self.config.selectors.fieldMessageAttr);
        if (!inputMessageSelector) {
          if ($wrapper.length) {
            $messageBlocks = $wrapper.find(self.config.selectors.fieldMessage);
          }
        } else {
          $messageBlocks = self.$element.find(inputMessageSelector);
        }

        $messageBlocks.each(function () {
          var $messageBlock = $(this);
          $messageBlock.html(message);
          $messageBlock.removeClass(self.config.classes.fieldMessage.error +' '+ self.config.classes.fieldMessage.success).addClass(messageClassName);
        });
      });
    },
    clearFieldStatus: function (name, value) {
      var self = this;
      self.setFieldStatus('', null, name, value);
    },
    setLoadingForm: function () {
      var self = this;
      //if (!self.invokeEvent('beforesetloading')) {return;}

      self.loading = true;
      self.$element.addClass(self.config.classes.form.loading);

      self.clearFormMessage();
      self._getInputs().each(function (index, input) {
        //var $input = $(this);
        self.clearFieldStatus(input.name);
        if (self.config.loading.disableInputs) {
          $(input).attr('disabled', 'disabled').prop('disabled', true);
        }
      });

      //if (!self.invokeEvent('aftersetloading')) {return;}
    },
    resetLoadingForm: function () {
      var self = this;
      if (!self.invokeEvent('beforeresetloading')) {return;}

      self.$element.removeClass(self.config.classes.form.loading);
      if (self.config.loading.disableInputs) {
        self._getInputs().each(function () {
          $(this).prop('disabled', false).removeAttr('disabled');
        });
      }
      self.loading = false;

      if (!self.invokeEvent('afterresetloading')) {return;}
    },
    clearFields: function () {
      var self = this;
      if ($.fn.resetForm) {
        self.$element.resetForm();
      }
    },
    prepareResult: function () {
      var self = this, key;

      if (!self.response) {return;}
      var firstErrorField = {
        name : '',
        value: ''
      };

      if (!self.timerResponseOver || !self.timerMinTimeOver) { return; }

      self.timerResponseOver = false;
      self.timerMinTimeOver = false;

      if (!self.invokeEvent('beforePrepareResult')) {return;}
      if ($.isPlainObject(self.response.data)) {
        for (key in self.response.data) {
          if (self.response.data.hasOwnProperty(key)) {
            var fieldMessage = self.response.data[key];
            var fieldSuccess = false;
            if (!firstErrorField.name) {
              firstErrorField.name = key;
            }
            self.setFieldStatus(fieldMessage, fieldSuccess, key);
          }
        }
      }

      var success = (typeof self.response.success != 'undefined') ? !!self.response.success : false;
      if (success) {
        self.resetForm();
      } else {
        self.resetLoadingForm();
      }
      self.setFormResultStatus(success, self.response.message || '');
      if (!success && firstErrorField.name) {
        self.setFieldFocus(firstErrorField.name);
      }

      var eventName = 'success';
      if (!success) {
        if (typeof self.response.ajaxError != 'undefined' && self.response.ajaxError) {
          eventName = 'ajaxError';
        } else {
          eventName = 'error';
        }
      }

      self.invokeEvent(eventName);
      //self.invokeEvent('afterPrepareResult');
      self.response = null;
    },
    resetForm: function () {
      var self = this;
      //if (!self.invokeEvent('beforereset')) {return;}

      self.$element.removeClass(self.config.classes.form.error +' '+ self.config.classes.form.success);
      self.resetLoadingForm();
      self.clearFormMessage();
      if (self.config.loading.disableInputs) {
        self._getInputs().each(function () {
          var $input = $(this);
          $input.prop('disabled', false).removeAttr('disabled');
          //self.clearFieldStatus(this.name, this.value);
        });
      }
      self.clearFields();
      self.timerMinTimeOver = false;
      self.timerResponseOver = false;
      window.clearTimeout(self.$element.data('loadingTimer') || 0);
      //self.prepareResult();

      //if (!self.invokeEvent('afterreset')) {return;}
    },
    bindEvents: function () {
      var self = this;
      if ($.fn.ajaxForm == 'undefined') {return;}

      self.$element.ajaxForm({
        beforeSubmit: function (fields, $form) {
          self.response = null;
          if (!self.invokeEvent('beforeSubmit')) { return; }
          self.setLoadingForm();
          //self.clearForm();
          $form.data('loadingTimer', setTimeout(function () {
            self.timerMinTimeOver = true;
            self.prepareResult();
          }, self.config.loading.timer || 0));
        },
        success: function (responseText, statusText, xhr, $form) {
          self.timerResponseOver = true;
          self.response = responseText;
          self.prepareResult();
        },
        error: function () {
          self.timerMinTimeOver = true;
          self.timerResponseOver = true;
          self.response = {
            success: false,
            message: self.config.defaultErrorMessage,
            ajaxError: true
          };
          //self.invokeEvent('ajaxError');
          self.prepareResult();
        },
        url: (typeof afConfig !== 'undefined') ? afConfig.actionUrl : (self.$element.attr('action') || ''),
        dataType: 'json'
      });
    },
    invokeEvent: function (name, data) {
      var self = this;
      name = name.toString() || '';
      if (!name) {return;}

      var result = self.$element.triggerHandler(name +'.'+ self.name, self, data || {});
      if (result !== false) {
        result = true;
      }
      return result;
    }
  });

  $.fn[ pluginName ] = function ( options ) {
    this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });

    return this;
  };
})( jQuery, window, document );




