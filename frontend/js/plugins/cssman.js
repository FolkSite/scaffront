(function (window, document, undefined) {

  /**
   * Logger
   */
  var log = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var consoleMethod = null;
    if (console) {
      if (typeof console.info != 'undefined') {
        consoleMethod = 'info';
      } else if (typeof console.log != 'undefined') {
        consoleMethod = 'log';
      }
    }

    if (consoleMethod) {
      console[consoleMethod].apply(console, ['[cssMan]'].concat(args));
    }
  };


  var cssMan = function () {
    if (this instanceof cssMan) {
      log('I\'m is not a constructor!');
    } else {
      log('Use my methods, Luke!');
    }
  };

  cssMan.parentNode = document.getElementsByTagName("HEAD")[0] || document.getElementsByTagName("BODY")[0] || document.getElementsByTagName("HTML")[0];

  cssMan.appendFile = function (file) {
    if (!file) { return; }

    var link = document.createElement('link');
    cssMan.parentNode.appendChild(link);
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = file;

    link.onerror = (function (file) {
      return function () {
        log('Couldn\'t load css file: "'+ file +'"');
      };
    })(file);
  };

  cssMan.appendRawStyles = function (content) {
    if (!content) { return; }

    var style = document.createElement('style');
    style.rel = 'stylesheet';
    cssMan.parentNode.appendChild(style);
    style.textContent = content;
  };

  cssMan.getFilename = function (file) {
    if (!file) { return ''; }
    var pathes = file.split('/');
    var fileName = pathes[pathes.length - 1];
    var tmp = fileName.split('.');
    var ext = tmp.pop();
    fileName = tmp.join('.');
    fileName = fileName.replace(/[^ёЁа-яА-Яa-zA-Z0-9]/, '');

    return fileName;
  };
  cssMan.ajaxLoadFile = function (file, cb) {
    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        cb(null, request.responseText);
      } else {
        cb('Couldn\'t load css file with font: "'+ file +'"');
      }
    };

    request.send();
  };

  cssMan.appendFiles = function (files) {
    files = files || [];
    if (!files.length) { return; }

    for (var i = 0, length = files.length; i < length; i++) {
      cssMan.appendFile(files[i]);
    }
  };

  cssMan.loadAndStorageFiles = function (files) {
    try {
      files = files || [];
      if (!files.length) { return; }

      var file, fileName;
      for (var i = 0, length = files.length; i < length; i++) {
        file = files[i];
        fileName = cssMan.getFilename(file);

        if (localStorage[fileName]) {
          cssMan.appendRawStyles(localStorage[fileName]);
        } else {
          cssMan.ajaxLoadFile(file, (function (file, fileName) {
            return function (err, content) {
              if (err) {
                log(err);
                return;
              }

              localStorage[fileName] = content;
              cssMan.appendRawStyles(content);
            };
          })(file, fileName));
        }
      }
    } catch (err) {}
  };


  window.cssMan = cssMan;

})(window, document);