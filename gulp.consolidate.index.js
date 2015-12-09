var through = require('through2'),
    consolidate = require("consolidate"),
    Promise = require("bluebird"),
    extend = require('extend');

module.exports = function (engine, data, options) {
  "use strict";

  options = options || {};

  if (!engine) {
    throw new Error("gulp-consolidate: No template engine supplied");
  }

  var Engine;
  try {
    Engine = require(engine);
  } catch (e) {
    throw new Error("gulp-consolidate: The template engine \"" + engine + "\" was not found. " +
      "Did you forget to install it?\n\n    npm install --save-dev " + engine);
  }

  if (typeof options.setupEngine == 'function') {
    var tmp = options.setupEngine(engine, Engine);
    if (typeof tmp != 'undefined') {
      consolidate.requires[engine] = tmp;
    }
  }

  var fileData = data || {};

  return through.obj(function(file, enc, callback) {
    file.data = extend(true, {}, fileData, file.data || {});

    if (file.contents instanceof Buffer) {
      try {
        Promise.using(file, function (file) {
          var promise;
          if (!!options.useContents) {
            promise = consolidate[engine].render(String(file.contents), file.data);
          } else {
            promise = consolidate[engine](file.path, file.data);
          }

          promise.then(function (html) {
            file.contents = new Buffer(html);
            callback(null, file);
          }).catch(callback);
        });

      } catch (err) {
        callback(err);
      }
    } else {
      callback(new Error("gulp-consolidate: streams not supported"), undefined);
    }
  });
};
