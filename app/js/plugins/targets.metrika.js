(function (window, document, $, undefined) {
  window.reachGoal = function (targetName) {
    if (typeof window.yaMetrika == 'undefined') { return; }

    targetName = targetName || false;
    if (targetName) {
      //console.log(targetName);
      try {
        window.yaMetrika.reachGoal(targetName);
      } catch(e) {}
    }
  };

  $(document).on('click', '[data-metrika-target]:not(form)', function (e) {
    reachGoal(this.getAttribute('data-metrika-target'));
  });

  $('.form').on('success.afl', function () {
      //.on('ajaxError.afl', function () {
    var $form = $(this);
    reachGoal($form.attr('data-metrika-target'));

    var thanksPage = $form.attr('data-thanks-page');
    var targetBlank = $form.attr('data-thanks-page-target-blank');
    if (thanksPage) {
      if (!!targetBlank) {
        window.open(thanksPage, '_blank'); // опасно! браузер такое блокирует
      } else {
        window.location.href = thanksPage;
      }
    }
  });

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

  var cbhmInstance = null;
  CBHmetrika = function (options) {
    if (!(this instanceof CBHmetrika)) { return new CBHmetrika(options); }
    if (cbhmInstance instanceof CBHmetrika) { return cbhmInstance; }

    cbhmInstance = this;

    this.options = options;
    var self = this;
    if (typeof window.reachGoal != 'undefined') {
      waiter(2000, 100, function () {
        return typeof window.ClbhObject != 'undefined';
      }, function () {
        // cbh loaded
        var cbhContainer = '#cbh_container';

        waiter(10000, 200, function () {
          return $(cbhContainer).length;
        }, function () {
          // cbh widjet inserted to dom
          self._init();
        });
      });
    }
  };

  CBHmetrika.prototype = {
    constructor: CBHmetrika,

    _init: function () {
      var self = this;

      self.options.button && self._buttonHandler();
      self.options.main && self._mainHandler();
      self.options.deffered && self._defferedHandler();
      self.options.letter && self._letterHandler();
    },
    _buttonHandler: function () {
      var self = this;
      $(document).on('click', '#cbh_phone', function (e) {
        reachGoal(self.options.button || '');
      });
    },
    _mainHandler: function () {
      var self = this;
      //#cbh_send
      var mainContainerSelector = '#cbh_item_call';
      $(document).on('click', mainContainerSelector +' #cbh_send', function () {
        var current = false;
        var prev = false;
        waiter(800, 250, function () {
          if (!prev) {
            // первая итерация
            prev = $('#cbh_timer', mainContainerSelector).html();
            return false;
          }

          current = $('#cbh_timer', mainContainerSelector).html();
          if (prev != current) {
            // если сработало это условие,
            // значит в таймере меняются циферки.
            // а значит валидация формы пройдена успешно
            return true;
          }
          prev = current;
          return false;
        }, function () {
          reachGoal(self.options.main || '');
        });
      });
    },
    _defferedHandler: function () {
      var self = this;
      var defferedContainerSelector = '#cbh_item_call_deferred';
      $(document).on('click', defferedContainerSelector +' #cbh_send_deferred', function () {
        waiter(500, 100, function () {
          return !$(defferedContainerSelector).hasClass('cbh-show');
        }, function () {
          reachGoal(self.options.deffered || '');
        });
      });
    },
    _letterHandler: function () {
      var self = this;
      var letterContainerSelector = '#cbh_item_dialog';
      $(document).on('click', letterContainerSelector +' .cbh-form-elem .cbh-button', function (e) {
        waiter(500, 100, function () {
          var $inputs = $('[name="question"],[name="email"],[name="phone"]', letterContainerSelector);
          return !$inputs.length || !$(letterContainerSelector).hasClass('cbh-show');
        }, function () {
          reachGoal(self.options.letter || '');
        });
      });
    }
  };

})(window, document, jQuery);

