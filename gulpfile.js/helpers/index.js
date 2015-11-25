var FS = require('fs');
var Path = require('path');
var Crypto = require('crypto');
var _ = require('lodash');
var Gutil = require('gulp-util');
var Notifier = require('node-notifier');


var __ = {};

/**
 *
 */
__.noop = function () {};

/**
 * @param {String} from
 * @param {String} [to]
 * @returns {string}
 */
__.getRelativePath = function (from, to) {
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
__.hasTrailingSlash = function (path) {
  path = path.toString() || '';
  if (!path) { return false; }

  var lastChar = path.substr(path.length - 1);
  return (lastChar == '/' || lastChar == '\\')
};

/**
 * @param {String} path
 * @returns {boolean}
 */
__.isFile = function (path) {
  path = path.toString() || '';
  if (!path) { return false; }

  return (!!Path.extname(path) && !__.hasTrailingSlash(path));
};

/**
 *
 * @param {{startSlash: Boolean, trailingSlash: Boolean}} [config]
 * @param {String} [path]
 * @param {...} [toJoin]
 */
__.preparePath = function (config, path, toJoin) {
  var args = _.toArray(arguments);

  if (_.isPlainObject(args[0])) {
    config = args[0];
    path = args[1];
    toJoin = args.slice(2);
  } else if (_.isString(args[0])) {
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

    if (config.trailingSlash && !__.isFile(path)) {
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
 * @param {string} path
 * @param {boolean} [format=false]
 * @returns {{root: string, dir: string, base: string, ext: string, name: string, isOnlyFile: boolean, isOnlyPath: boolean, isPathToFile: boolean}|string}
 */
__.parsePath = function (path, format) {
  format = !!format;
  var isFile = Helpers.isFile(path);
  var parsed = Path.parse(path);

  if (!isFile) {
    parsed.base = '';
    parsed.name = '';
    parsed.dir = path;
  } else {
    parsed.dir = parsed.dir.split(Path.sep).join('/');
  }

  parsed.isPathToFile = isFile && !!parsed.dir;
  parsed.isOnlyFile   = isFile && !parsed.isPathToFile;
  parsed.isOnlyPath   = !isFile;

  return (format)
    ? Path.normalize(Path.format(parsed))
    : parsed;
};

/**
 * @param content
 * @returns {String}
 */
__.md5 = function (content) {
  return Crypto.createHash('md5').update(content).digest('hex');
};

/**
 * @param {String|{path: string}} file
 * @returns {{css: boolean, scss: boolean, sass: boolean, js: boolean, minified: boolean, underscored: boolean}}
 * @constructor
 */
__.Is = function (file) {
  var path = '';
  if (_.isString(file)) {
    path = file;
  } else if (_.isString(file.path)) {
    path = file.path;
  }

  var extname = Path.extname(path);
  var basename = Path.basename(path, extname);

  return {
    css: extname === '.css',
    scss: extname === '.scss',
    sass: extname === '.sass',
    js: extname === '.js',
    minified: /\.min$/.test(basename),
    underscored: /^_/.test(basename)
  };
};

__.filePathWithoutExt = function (path) {
  return Path.basename(path, Path.extname(path))
};

/**
 * @param {Function} getFile
 * @returns {Function}
 */
__.getDataForTpl = function (getFile) {

  return function (file) {
    var dataFile = false;
    var data = {}, _data;

    if (_.isFunction(getFile)) {
      dataFile = getFile(file);
    } else if (_.isString(getFile)) {
      dataFile = getFile;
    }

    if (dataFile && FS.existsSync(dataFile)) {
      _data = require(dataFile);
      data = (_.isPlainObject(_data)) ? _data : data;
    }

    return data;
  };
};

/**
 * @type {{errorHandler: Function}}
 */
__.plumberErrorHandler = {
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
__.notify = function (file, msg, isFail) {
  var color = isFail ? 'red' : 'green';

  msg = msg || 'Bundled!';

  Gutil.log(msg, gutil.colors[color](file));
};

/**
 * @param {string} str
 * @returns {string}
 */
__.capitalize = function (str) {
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
__.getGlobPaths = function (sources, extnames, deep, exclude) {
  deep    = (typeof deep != 'undefined') ? !!deep : true;
  exclude = (typeof exclude != 'undefined') ? !!exclude : false;
  extnames = (typeof extnames != 'undefined') ? extnames : '.*';

  var inners = (deep) ? '**/*' : '*';

  sources  = (!_.isArray(sources)) ? [sources] : sources;

  if (extnames !== false) {
    extnames = (!_.isArray(extnames)) ? [extnames] : extnames;
    extnames = _.map(extnames, function (ext) {
      if (ext) {
        ext = ((ext.indexOf('.') !== 0) ? '.'+ ext : ext);
        ext = inners + ext;
      }
      return ext;
    });

    sources = _.map(sources, function (src) {
      src = (exclude) ? '!'+ src : src;
      return _.map(extnames, function (ext) {
        return Path.join(src, ext);
      });
    });
  }

  return _.unique(_.flatten(sources));
};

/**
 * @param {*} anything
 * @returns {string}
 */
__.getConstructorName = function (anything) {
  if (anything) {
    return test.constructor.toString().trim().match(/^function (\w*)/)[1] || '';
  }

  return '';
};

/**
 * @param {*} anything
 * @returns {boolean}
 */
__.isGulpSrc = function (anything) {
  if (anything) {
    // fuck this
    return __.getConstructorName(anything) == 'DestroyableTransform';
  }

  return false;
};

/**
 * @param {*} obj
 * @returns {string}
 */
__.stringify = function (obj) {
  var prop, string = [];

  if (typeof obj == 'undefined') {
    return String(obj);
  } else
  // is object
  if (_.isPlainObject(obj)) {
    for (prop in obj) {
      if (obj.hasOwnProperty(prop))
        string.push(prop + ': ' + __.stringify(obj[prop]));
    }

    return '{' + string.join(', ') + '}';
  } else

  // is array
  if (_.isArray(obj)) {
    for (var index = 0, length = obj.length; index < length; index++) {
      string.push(__.stringify(obj[index]));
    }

    return '[' + string.join(', ') + ']';
  } else

  // is function
  if (_.isFunction(obj)) {
    string.push(obj.toString());

  // all other values can be done with JSON.stringify
  } else {
    string.push(JSON.stringify(obj))
  }

  return string.join(',');
};


module.exports = __;