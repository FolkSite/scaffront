/**
 * @typedef {{}}                  BundleConfig
 * @property {{}}                 build
 * @property {String|string[]}    build.entry Maybe a file or full path to file (relative to project path)
 * @property {String}             [build.src]
 * @property {String}             [build.dest]
 * @property {String}             [build.outfile] Maybe a file or full path to file (relative to project path). If is undefined then outfile's name will be equal to entry filename
 * @property {{}}                 [build.options] Will be passed to Browserify constructor
 * @property {Function}           [build.setup] This function takes one argument "bundler" and here you can setup the bundler
 * @property {Function}           [build.callback] Will be passed to ".bundle()": .bundle(callback)
 * @property {{}}                 [dist]
 * @property {boolean}            [dist.polyfilly]
 * @property {string[]|string}    [dist.polyfillyType] Описание:
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
 //* - 'inject concat' (вариант отключен ибо бессмысленен)
 //*    - 1 бандл: равнозначно варианту 'inject'
 //*    - 1+ бандлов: полифиллы всех бандлов будут объединены в одну кучу (без дублирования кода полифиллов) и эта "куча" будет добавлена в каждый бандл
 *
 * @property {{}}                 [dist.polyfillyRenameConfig]
 * @property {{}}                 [dist.autoPolyfillerConfig]
 * @property {boolean}            [dist.minify]
 * @property {{}}                 [dist.uglifyConfig]
 * @property {{}}                 [dist.minifyRenameConfig]
 * @property {boolean}            [validated] Generated property
 * @property {null|*}             [bundler] Generated property
 */

var     _                 = require('lodash'),
        Browserify        = require('browserify'),
        Watchify          = require('watchify'),
        Extend            = require('extend'),
        jsface            = require("jsface"),
        Class             = jsface.Class;


var BundleMaker = Class({
  /**
   * @property {BundleConfig} defaults.bundle
   */
  defaults: {
    src: '',
    dest: '',
    bundle: {
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
        polyfillyType: 'internal concat',
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
        polyfillyRenameConfig: {
          suffix: '.polyfills'
        },

        minify: true,
        uglifyConfig: {},
        minifyRenameConfig: {
          suffix: '.min'
        }
      }
    }
  },

  /**
   * @param {{}} defaults
   * @returns {BundleMaker}
   */
  setDefaults: function (defaults) {
    this.defaults = Extend(this.defaults, defaults || {});
    return this;
  },
  /**
   * @param {BundleConfig} bundle
   * @param {{}} defaults
   * @returns {BundleMaker}
   */
  constructor: function constructor (bundle, defaults) {
    defaults && this.setDefaults(defaults);

    this.bundle = this._validate(bundle);

    return this;
  },

  /**
   * @param {boolean} [makeBundler]
   * @returns {BundleConfig}
   */
  get: function get (makeBundler) {
    if (!!makeBundler) {
      this.makeBundler();
    }
    return this.bundle;
  },

  /**
   * @returns {BundleMaker}
   */
  makeBundler: function makeBundler () {
    if (!this.bundle.bundler) {
      this.bundle.bundler = Browserify(this.bundle.entry, Extend(true, Watchify.args || {}, this.bundle.options));
      this.bundle.setup(this.bundle.bundler);
    }

    return this;
  },

  /**
   * @param {BundleConfig} bundle
   * @returns {BundleConfig}
   */
  _validate: function _validate (bundle) {
    var self = this;

    // если бандл уже проверен отвалидирован и унифицирован - пропускаем его
    if (bundle.validated) { return bundle; }

    /**
     * Валидация настроек бандлера
     */
    // если вместо конфига бандла пришла какая-то хрень, то нахер
    if (!_.isPlainObject(bundle) || !_.isPlainObject(bundle.build)) {
      throw new Error([
        'Invalid bundle.',
        Helpers.stringify(bundle),
        ''
      ].join('\n'));
    }

    // расширяем build-настройки дефолтными (без глубокой замены!)
    bundle.build = Extend(self.defaults.bundle.build, bundle.build);
    // то же самое с dist-конфигом
    bundle.dist = Extend(self.defaults.bundle.dist, bundle.dist || {});

    // валидация опций бандлера
    if (!_.isPlainObject(bundle.build.options)) {
      bundle.build.options = self.defaults.bundle.build.options;
    } else {
      // а вот опции уже можно расширить глубокой заменой
      bundle.build.options = Extend(true, self.defaults.bundle.build.options, bundle.build.options);
    }

    // сделаем массивом входной файл, если ещё не.
    if (!_.isArray(bundle.build.entry)) {
      bundle.build.entry = [bundle.build.entry || null];
    }
    // сделаем массивом входной файл из опций, если ещё не.
    if (!_.isArray(bundle.build.options.entries)) {
      bundle.build.options.entries = [bundle.build.options.entries || null];
    }

    // перенесём входные файлы из опций в entry, для консистентности
    bundle.build.entry = _.compact(_.union(bundle.build.entry, bundle.build.options.entries || []));
    delete bundle.build.options.entries;

    // теперь сформируем нормальные пути для каждого файла
    bundle.build.entry = _.map(bundle.build.entry, function (entry) {
      var _entry, result = null;

      if (entry) {
        _entry = Helpers.parsePath(entry);

        // если записано просто название файла
        if (_entry.isOnlyFile) {
          // то сформируем полный путь к файлу
          result = Path.join(self.defaults.src, _entry.base);
        } else
        // если это и так полный путь
        if (_entry.isPathToFile) {
          // сделаем из него обратно строку
          result = Path.format(_entry);
        }

        result = Path.normalize(result);
      }

      return result;
    });

    bundle.build.entry = _.uniq(_.compact(bundle.build.entry));

    // если, после всех преобразований, нет ни одной входной точки, то нахер это всё
    if (!bundle.build.entry.length) {
      throw new Error([
        'Bundle\'s entry file is required.',
        Helpers.stringify(bundle),
        ''
      ].join('\n'));
    }

    // если выходной файл не установлен и всего одна входная точка,
    // заберём из неё название файла
    if (!bundle.build.outfile && bundle.build.entry.length == 1) {
      bundle.build.outfile = Path.parse(bundle.build.entry[0]).base;
    }

    // если outfile установлен - нужно отделить мух от котлет (имя файла от пути)
    if (bundle.build.outfile) {
      var _outfile = Helpers.parsePath(entry);

      // если установлен только путь, то плохо
      if (_outfile.isOnlyPath) {
        bundle.build.outfile = null;
        bundle.build.dest    = null;
      } else {
        // если установлен только файл
        if (_outfile.isOnlyFile) {
          bundle.build.outfile = _outfile.base;

          bundle.build.dest    = self.defaults.dest;
        } else if (_outfile.isPathToFile) {
          bundle.build.outfile = _outfile.base;
          bundle.build.dest    = _outfile.dir;
        }

        bundle.build.dest = Helpers.preparePath({trailingSlash: true}, bundle.build.dest);
      }
    }

    // если и выходного файла нет, то тем более нахер это всё
    if (!bundle.build.outfile) {
      throw new Error([
        'Cann\'t resolve bundle\'s output filename.',
        Helpers.stringify(bundle)
      ].join('\n'));
    }

    // функция настройки бандлера
    if (!_.isFunction(bundle.build.setup)) {
      bundle.build.setup = self.defaults.bundle.build.setup;
    }

    // коллбек для бандлера
    if (!_.isFunction(bundle.build.callback)) {
      bundle.build.callback = self.defaults.bundle.build.callback;
    }

    /**
     * Вылидация dist-настроек
     */
      // надо ли генерировать полифиллы
    bundle.dist.polyfilly = !!bundle.dist.polyfilly;
    // стратегия полифиллирования
    bundle.dist.polyfillyType = (_.isString(bundle.dist.polyfillyType))
      ? bundle.dist.polyfillyType.split(' ').map(function (item) {
      return item.trim();
    })
      : bundle.dist.polyfillyType;
    // конфиг для autopolyfiller'a
    if (!_.isPlainObject(bundle.dist.autoPolyfillerConfig)) {
      bundle.dist.autoPolyfillerConfig = {};
    }
    // конфиг для rename'ра
    if (!_.isPlainObject(bundle.dist.polyfillyRenameConfig)) {
      bundle.dist.polyfillyRenameConfig = {};
    }

    // надо ли минимизировать
    bundle.dist.minify = !!bundle.dist.minify;
    // конфиг для uglify
    if (!_.isPlainObject(bundle.dist.uglifyConfig)) {
      bundle.dist.uglifyConfig = {};
    }
    // конфиг для rename'ра
    if (!_.isPlainObject(bundle.dist.minifyRenameConfig)) {
      bundle.dist.minifyRenameConfig = {};
    }

    // ставим флаг, что этот бандл отвалидрован (чтобы в будущем, если что, повторно не прогонять его через эту функцию)
    bundle.validated = true;
    // заглушка для browserify-бандлера
    bundle.bundler = null;

    return bundle;
  }
});

var BundlesMaker = Class({
  /**
   * @param {{}} defaults
   * @returns {BundlesMaker}
   */
  setDefaults: function (defaults) {
    this.defaults = Extend(this.defaults, defaults || {});
    return this;
  },

  /**
   * @param {BundleConfig|BundleConfig[]} bundles
   * @param {{}} defaults
   * @returns {BundlesMaker}
   */
  constructor: function constructor (bundles, defaults) {
    defaults && this.setDefaults(defaults);

    this.bundles = this._validate(bundles || []);

    return this;
  },

  /**
   * @param {boolean} [makeBundlers]
   * @returns {BundleConfig[]}
   */
  get: function get (makeBundlers) {
    this.bundles = _.map(this.bundles, function (bundle) {
      return bundle.get(makeBundlers);
    });

    return this.bundles;
  },

  /**
   * @returns {BundlesMaker}
   */
  makeBundlers: function makeBundlers () {
    this.bundles = _.map(this.bundles, function (bundle) {
      return bundle.makeBundler();
    });

    return this;
  },

  /**
   * @param {BundleConfig[]} bundles
   * @returns {[]}
   */
  _validate: function _validate (bundles) {
    var self = this;

    bundles = (!_.isArray(bundles)) ? [bundles] : bundles;

    return _.map(bundles, function (bundle) {
      return new BundleMaker(bundle, self.defaults);
    });
  }

});


module.exports.BundleMaker  = BundleMaker;
module.exports.BundlesMaker = BundlesMaker;
