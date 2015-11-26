var _      = require('lodash'),
    __     = require('../helpers'),
    Path   = require('path'),
    Extend = require('extend'),
    FS     = require('fs');

module.exports = (function () {

  var config = {
    src: 'app/scripts',
    dest: 'dist/js',
  };

  /**
   * @property {BundleConfig|BundleConfig[]} config.bundles
   */
  config.bundles = [
    {
      build: {
        entry: 'libs.js',
        outfile: 'libs.js',
        //options: {},
        setup: function setup (bundler) {
          // можно подключать напрямую в script (классический принцип scope'а подключаемых файлов). ignore просто выпиливает этот модуль из бандла
          bundler.ignore('jquery');
          // должен быть доступен из require (из другого бандла)
          //bundler.external('jquery');

          //bundler.add('app/scripts/app/js.js');
        },
        // callback will be passed to .bundle(callback)
        callback: function callback (err, buf) {}
      },
      dist: {

      }
    }
  ];

  return config;
})();