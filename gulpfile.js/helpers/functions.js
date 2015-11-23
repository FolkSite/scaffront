var FS = require('fs');
var Path = require('path');
var Crypto = require('crypto');
var lodash = require('lodash');
var Gutil = require('gulp-util');
var Notifier = require('node-notifier');


var _ = {};

/**
 *
 */
_.noop = function () {};

/**
 * @param {String} from
 * @param {String} [to]
 * @returns {string}
 */
_.getRelativePath = function (from, to) {
  var result = '';
  from = from || null;
  to = to || null;

  if (!from) { return result; }

  if (to) {
    result = Path.relative(from, to);
  } else if (Path.isAbsolute(from)) {
    result = from.substr(1);
  } else {
    result = from;
  }

  return result;
};

/**
 * @param {String} path
 * @returns {Boolean}
 */
_.hasTrailingSlash = function (path) {
  path = path.toString() || '';
  if (!path) { return false; }

  var lastChar = path.substr(path.length - 1);
  return (lastChar == '/' || lastChar == '\\')
};

/**
 * @param {String} path
 * @returns {boolean}
 */
_.isFile = function (path) {
  path = path.toString() || '';
  if (!path) { return false; }

  return (!!Path.extname(path) && !_.hasTrailingSlash(path));
};

/**
 *
 * @param {{startSlash: Boolean, trailingSlash: Boolean}} [config]
 * @param {String} [path]
 * @param {...} [toJoin]
 */
_.preparePath = function (config, path, toJoin) {
  var args = lodash.toArray(arguments);

  if (lodash.isPlainObject(args[0])) {
    config = args[0];
    path = args[1];
    toJoin = args.slice(2);
  } else if (lodash.isString(args[0])) {
    config = {};
    path = args[0];
    toJoin = args.slice(1);
  } else {
    config = {};
    path = null;
    toJoin = [];
  }

  if (!path) { return ''; }

  path = Path.join.apply(null, [path].concat(toJoin));

  if (typeof config.startSlash != 'undefined') {

    if (config.startSlash && !Path.isAbsolute(path)) {
      path = Path.join('/', path);
    }
    if (!config.startSlash && Path.isAbsolute(path)) {
      path = Path.relative('/', path);
    }

  }

  if (typeof config.trailingSlash != 'undefined') {

    if (config.trailingSlash && !_.isFile(path)) {
      path += '/';
    }
    if (!config.trailingSlash) {
      var lastChar = path.substr(path.length - 1);
      if (lastChar == '/' || lastChar == '\/') {
        path = path.substr(0, path.length - 1);
      }
    }

  }

  path = Path.normalize(path);

  return path;
};

/**
 *
 * @param {String} sourceDir For example: 'app/scripts/plugins'
 * @param {String} destDir For example: 'dist/js/plugins'
 * @param {String} src For example: '*.js'
 * @param {String} [watch] For example: '**\/*.js' (without backslash)
 * @param {String|[]} [srcFilter] For example: ['*', '!_*]
 * @param {String|[]} [watchFilter] For example: ['*', '!_*]
 */
_.getConfig = function (sourceDir, destDir, src, watch, srcFilter, watchFilter) {
  sourceDir = _.preparePath({startSlash: false, trailingSlash: false}, sourceDir);
  destDir = _.preparePath({startSlash: false, trailingSlash: true}, destDir);

  return {
    src: Path.join(sourceDir, src),
    dest: destDir,
    watch: (watch) ? Path.join(sourceDir, watch) : false,
    srcFilter: srcFilter || [],
    watchFilter: watchFilter || []
  };
};

/**
 * @param content
 * @returns {String}
 */
_.md5 = function (content) {
  return Crypto.createHash('md5').update(content).digest('hex');
};

/**
 * @param {String} file
 * @returns {{css: boolean, scss: boolean, sass: boolean, js: boolean, minified: boolean, underscored: boolean}}
 * @constructor
 */
_.Is = function (file) {
  var extname = Path.extname(file.path);
  var basename = Path.basename(file.path, extname);

  return {
    css: extname === '.css',
    scss: extname === '.scss',
    sass: extname === '.sass',
    js: extname === '.js',
    minified: /\.min$/.test(basename),
    underscored: /^_/.test(basename)
  };
};

_.filePathWithoutExt = function (path) {
  return Path.basename(path, Path.extname(path))
};

/**
 * @param {Function} getFile
 * @returns {Function}
 */
_.getDataForTpl = function (getFile) {

  return function (file) {
    var dataFile = false;
    var data = {}, _data;

    if (lodash.isFunction(getFile)) {
      dataFile = getFile(file);
    } else if (lodash.isString(getFile)) {
      dataFile = getFile;
    }

    if (dataFile && FS.existsSync(dataFile)) {
      _data = require(dataFile);
      data = (lodash.isPlainObject(_data)) ? _data : data;
    }

    return data;
  };
};

/**
 * @type {{errorHandler: Function}}
 */
_.plumberErrorHandler = {
  errorHandler: function errorHandler$ (err) {
    Gutil.log(err);

    Notifier.notify({
      title: 'Scaffront error!',
      message: err.toString(),
      sound: true,
      time: 5000,
      wait: false
    });

    this.emit('end');
  }
};

/**
 * @param file
 * @param msg
 * @param isFail
 */
_.notify = function (file, msg, isFail) {
  var color = isFail ? 'red' : 'green';

  msg = msg || 'Bundled!';

  Gutil.log(msg, gutil.colors[color](file));
};

/**
 * @param {string} str
 * @returns {string}
 */
_.capitalize = function (str) {
  str = str.toString();
  return str.charAt(0).toUpperCase() + str.substring(1);
};

/**
 *
 * @param {String|[]} sources
 * @param {String|[]|boolean} [extnames] Default is '.*'. Pass false for return only paths without extensions
 * @param {boolean} [deep] Default true.
 * @param {boolean} [exclude] Default true.
 * @returns {[]}
 */
_.getGlobPaths = function (sources, extnames, deep, exclude) {
  deep    = (typeof deep != 'undefined') ? !!deep : true;
  exclude = (typeof exclude != 'undefined') ? !!exclude : false;
  extnames = (typeof extnames != 'undefined') ? extnames : '.*';

  var inners = (deep) ? '**/*' : '*';

  sources  = (!lodash.isArray(sources)) ? [sources] : sources;

  if (extnames !== false) {
    extnames = (!lodash.isArray(extnames)) ? [extnames] : extnames;
    extnames = lodash.map(extnames, function (ext) {
      if (ext) {
        ext = ((ext.indexOf('.') !== 0) ? '.'+ ext : ext);
        ext = inners + ext;
      }
      return ext;
    });

    sources = lodash.map(sources, function (src) {
      src = (exclude) ? '!'+ src : src;
      return lodash.map(extnames, function (ext) {
        return Path.join(src, ext);
      });
    });
  }

  return lodash.unique(lodash.flatten(sources));
};

var BrowserSync = require('browser-sync');
/**
 * @param {String} instanceName
 * @param {boolean} [init]
 * @param {{}} [config]
 * @param {Function} [cb]
 */
_.getBrowserSyncInstance = function (instanceName, init, config, cb) {
  init = (typeof init != 'undefined') ? !!init : false;
  config = (typeof config != 'undefined' && lodash.isPlainObject(config)) ? config : {};
  cb = (lodash.isFunction(cb)) ? cb : _.noop;

  if (!instanceName) { return null; }

  var bs;
  try {
    bs = BrowserSync.get(instanceName);
  } catch (e) {
    bs = BrowserSync.create(instanceName);
  }

  if (init) {
    if (bs.paused) {
      bs.resume();
    } else
    if (!bs.active) {
      bs.init(config, cb);
    }
  }

  return bs;
};

module.exports = _;