var _      = require('lodash'),
    __     = require('../helpers'),
    Path   = require('path'),
    Extend = require('extend'),
    FS     = require('fs');

module.exports = (function () {

  var config = {
    src: 'app/scripts',
    dest: 'dist/js',

    /**
     * - 'internal'
     *    - 1 бандл: будет создан один файл с полифиллами
     *    - 1+ бандлов: для каждого бандла будет создан свой файл с полифиллами
     *
     * - 'inject'
     *    - 1 бандл: полифиллы будут добавлены в начало этого бандла
     *    - 1+ бандлов: в начало каждого бандла будут добавлены только его полифиллы
     *
     * - 'internal concat'
     *    - 1 бандл: равнозначно варианту 'internal'
     *    - 1+ бандлов: полифиллы всех бандлов будут объединены в один файл (без дублирования кода полифиллов)
     *
     //* - 'inject concat' (вариант отключен)
     //*    - 1 бандл: равнозначно варианту 'inject'
     //*    - 1+ бандлов: полифиллы всех бандлов будут объединены в одну кучу (без дублирования кода полифиллов) и эта "куча" будет дробавлена в каждый бандл
     */
    polyfillsType: 'internal concat',

    polyfillyRenameConfig: {

    },
    minifyRenameConfig: {

    }
  };

  /**
   * @property {BundleConfig} config.bundleDefaults Структуру дефолтного конфига не менять!
   */
  config.bundleDefaults = {
    build: {
      entry: '',
      outfile: '',
      options: {
        debug: !global.isProduction
      },
      setup: function setup (bundler) {
        // можно подключать напрямую в script (классический принцип scope'а подключаемых файлов). ignore просто выпиливает этот модуль из бандла
        bundler.ignore('jquery');
        // должен быть доступен из require (т.е. из другого бандла)
        //bundler.external('jquery');

        //bundler.add('app/scripts/app/js.js');
      },
      callback: function callback (err, buf) {}
    },
    dist: {
      polyfilly: true,
      minify: true,
      autoPolyfillerConfig: {
        browsers: [
          'last 3 version',
          'ie 8',
          'ie 9'
        ],
          exclude: [
          'Promise'
        ]
      },
      uglifyConfig: {},

      polyfillsType: 'internal concat',

      polyfillyRenameConfig: {

      },
      minifyRenameConfig: {

      }
    }
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