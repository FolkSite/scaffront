/**
 * @typedef {{}}                  BundleConfig
 * @property {String|string[]}    entry Maybe a file or full path to file (relative to project path)
 * @property {String}             [src]
 * @property {String}             [dest]
 * @property {String}             [destFullPath] Generated
 * @property {String}             [outfile] Maybe a file or full path to file (relative to project path). If is undefined then outfile's name will be equal to entry filename
 * @property {{}}                 [options] Will be passed to Browserify constructor
 * @property {Function}           [setup] This function takes one argument "bundler" and here you can setup the bundler
 * @property {Function}           [callback] Will be passed to ".bundle(callback)"
 * @property {Function}           [errorHandler] Will be passed to ".on('error', errorHandler)"
 * @property {boolean}            [validated] Generated property
 * @property {null|*}             [bundler] Generated property
 */

var _          = require('lodash'),
    __         = require('../../helpers'),
    Browserify = require('browserify'),
    Watchify   = require('watchify'),
    Extend     = require('extend'),
    Path       = require('path'),
    jsface     = require("jsface"),
    Class      = jsface.Class;


var BundleMaker = Class({
  /**
   * @property {BundleConfig} defaults.bundle
   */
  defaults: {
    src: '',
    dest: '',
    bundle: {
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
      callback: function callback (err, buf) {},
      errorHandler: __.plumberErrorHandler.errorHandler
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

    //console.log('this.bundle', this.bundle);

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
      this.bundle.bundler = Browserify(
        this.bundle.entry,
        Extend(true, Watchify.args || {}, this.bundle.options)
      );
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

    //console.log('bundle before validate', extend({}, bundle));

    // если бандл уже проверен отвалидирован и унифицирован - пропускаем его
    if (bundle.validated) { return bundle; }

    /**
     * Валидация настроек бандлера
     */
    // если вместо конфига бандла пришла какая-то хрень, то нахер
    if (!_.isPlainObject(bundle) || !_.isPlainObject(bundle)) {
      throw new Error([
        'Invalid bundle.',
        __.stringify(bundle),
        ''
      ].join('\n'));
    }

    // расширяем build-настройки дефолтными (без глубокой замены!)
    bundle = Extend({}, self.defaults.bundle, bundle);

    // валидация опций бандлера
    if (!_.isPlainObject(bundle.options)) {
      bundle.options = self.defaults.bundle.options;
    } else {
      // а вот опции уже можно расширить глубокой заменой
      bundle.options = Extend(true, {}, self.defaults.bundle.options, bundle.options);
    }

    // сделаем массивом входной файл, если ещё не.
    if (!_.isArray(bundle.entry)) {
      bundle.entry = [bundle.entry || null];
    }
    // сделаем массивом входной файл из опций, если ещё не.
    if (!_.isArray(bundle.options.entries)) {
      bundle.options.entries = [bundle.options.entries || null];
    }

    // перенесём входные файлы из опций в entry, для консистентности
    bundle.entry = _.compact(_.union(bundle.entry, bundle.options.entries || []));
    delete bundle.options.entries;

    // теперь сформируем нормальные пути для каждого файла
    bundle.entry = _.map(bundle.entry, function (entry) {
      var _entry, result = null;

      if (entry) {
        _entry = __.parsePath(entry);

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

        result = Path.resolve(process.cwd(), Path.normalize(result));
      }

      return result;
    });

    bundle.entry = _.uniq(_.compact(bundle.entry));

    // если, после всех преобразований, нет ни одной входной точки, то нахер это всё
    if (!bundle.entry.length) {
      throw new Error([
        'Bundle\'s entry file is required.',
        __.stringify(bundle),
        ''
      ].join('\n'));
    }

    // если выходной файл не установлен и всего одна входная точка,
    // заберём из неё название файла
    //console.log('bundle.outfile', bundle.outfile);
    if (!bundle.outfile && bundle.entry.length == 1) {
      bundle.outfile = Path.parse(bundle.entry[0]).base;
    }
    //console.log('bundle.outfile', bundle.outfile);

    // если outfile установлен - нужно отделить мух от котлет (имя файла от пути)
    if (bundle.outfile) {
      var _outfile = __.parsePath(bundle.outfile);

      // если установлен только путь, то плохо
      if (_outfile.isOnlyPath) {
        bundle.outfile = null;
        bundle.dest    = null;
      } else {
        // если установлен только файл
        if (_outfile.isOnlyFile) {
          bundle.outfile = _outfile.base;
          // папкой назначения установим папку по умолчанию
          bundle.dest    = self.defaults.dest;
        } else
        // а если указан полный путь
        if (_outfile.isPathToFile) {
          // то его и оставляем
          bundle.outfile = _outfile.base;
          bundle.dest    = _outfile.dir;
        }

        bundle.dest = __.preparePath({trailingSlash: true}, bundle.dest);
        bundle.destFullPath = Path.join(bundle.dest, bundle.outfile);
      }
    }

    // если и выходного файла нет, то тем более нахер это всё
    if (!bundle.outfile) {
      throw new Error([
        'Cann\'t resolve bundle\'s output filename.',
        __.stringify(bundle)
      ].join('\n'));
    }

    // функция настройки бандлера
    if (!_.isFunction(bundle.setup)) {
      bundle.setup = self.defaults.bundle.setup;
    }

    // коллбек для бандлера
    if (!_.isFunction(bundle.callback)) {
      bundle.callback = self.defaults.bundle.callback;
    }

    // коллбек для бандлера
    if (!_.isFunction(bundle.errorHandler)) {
      bundle.errorHandler = self.defaults.bundle.errorHandler;
    }

    // ставим флаг, что этот бандл отвалидрован (чтобы в будущем, если что, повторно не прогонять его через эту функцию)
    bundle.validated = true;
    // заглушка для browserify-бандлера
    bundle.bundler = null;

    //console.log('bundle after validate', extend({}, bundle));

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
    return _.map(this.bundles, function (bundle) {
      return bundle.get(!!makeBundlers);
    });
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
