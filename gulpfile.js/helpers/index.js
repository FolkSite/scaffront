var _        = require('lodash'),
    FS       = require('fs'),
    Path     = require('path'),
    Crypto   = require('crypto'),
    Gulp     = require('gulp'),
    GulpUtil = require('gulp-util'),
    Notifier = require('node-notifier');


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
  var isFile = __.isFile(path);
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
  errorHandler: function errorHandler (err) {
    GulpUtil.log(err);

    Notifier.notify({
      title: 'Scaffront error!',
      message: err.toString(),
      sound: true,
      time: 5000,
      wait: false
    });

    if ('emit' in this && _.isFunction(this.emit)) {
      this.emit('end');
    }
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

  GulpUtil.log(msg, gutil.colors[color](file));
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
 * @param {String|String[]|boolean} extnames Default is '.*'. Pass false for return only paths without extensions
 */
__.getGlobExtnames = function (extnames) {

};

/**
 *
 * @param {String|String[]} paths
 * @param {String|String[]|boolean} [files] Default is '.*'. Pass false for return only paths without extensions
 * @param {boolean} [forceDeep] If undefined then has no effect. But if it == true/false then to each path will be added/removed suffix '/**'
 * @returns {[]}
 */
__.getGlobPaths = function (paths, files, forceDeep) {
  var result = [];
  paths = __.getArray(paths || null);
  files = __.getArray(files || null);

  if (!files.length || (files.length == 1 && !files[0])) {
    files = ['.*'];
  }

  paths = _.compact(paths);
  files = _.compact(files);

  files = _.map(files, function (ext) {
    var itsExclude = (ext.indexOf('!') === 0);
    if (itsExclude) {
      ext = ext.slice(1);
    }

    if (ext.indexOf('.') >= 0 && ext.indexOf('*') >= 0 ) {
      // it's filename mask
    } else {
      // dot unify
      ext = ((ext.indexOf('.') !== 0) ? '.'+ ext : ext);
      ext = '*'+ ext;
    }

    if (itsExclude) {
      ext = '!'+ ext;
    }

    return ext;
  });

  _.each(paths, function (path) {
    var isPathExcluded = (path.indexOf('!') === 0);

    if (typeof forceDeep != 'undefined') {
      path = __.preparePath({trailingSlash: false}, path);
      var pathIsDeep = /\*\*$/.test(path);

      if (forceDeep && !pathIsDeep) {
        path = Path.join(path, '**');
      } else if (!forceDeep && pathIsDeep) {
        path = path.slice(0, path.length - 2);
      }
    }

    _.each(files, function (file) {
      var isFileExcluded = (file.indexOf('!') === 0);
      if (isFileExcluded) {
        file = file.slice(1);
      }

      if ((isFileExcluded || isPathExcluded) && path.indexOf('!') !== 0) {
        path = '!'+ path;
      }

      result.push(Path.join(path, file));
    });
  });

  return _.unique(result);
};

/**
 * @param {*} anything
 * @returns {string}
 */
__.getConstructorName = function (anything) {
  if (anything) {
    return anything.constructor.toString().trim().match(/^function (\w*)/)[1] || '';
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
 * @param {*} anything
 * @returns {*}
 */
__.getGulpSrc = function (anything) {
  return (!__.isGulpSrc(anything)) ? Gulp.src(anything) : anything;
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


/**
 * @param {{}} [funcContext]
 * @param {[]} [funcArgs]
 * @param {Function} [func]
 * @param {Function} [cb]
 */
__.runSyncAsync = function (funcContext, funcArgs, func, cb) {
  var args = _.toArray(arguments);

  funcContext = null;
  funcArgs = [];
  func = __.noop;
  cb = __.noop;

  switch (args.length) {
    case 4:
      // runSyncAsync(funcContext, funcArgs, function func () {}, function cb () {});
      funcContext = args[0];
      if (_.isArray(args[1])) {
        funcArgs = args[1];
      }
      if (typeof args[2] == 'function') {
        func = args[2];
      }
      if (typeof args[3] == 'function') {
        cb = args[3];
      }

      break;
    case 3:
      // runSyncAsync(funcArgs, function func () {}, function cb () {});
      if (_.isArray(args[0])) {
        funcArgs = args[0];
      }

      // runSyncAsync(funcContext, function func () {}, function cb () {});
      else {
        funcContext = args[0];
      }

      if (typeof args[1] == 'function') {
        func = args[1];
      }
      if (typeof args[2] == 'function') {
        cb = args[2];
      }

      break;
    case 2:
      // runSyncAsync(function func () {}, function cb () {});
      if (typeof args[0] == 'function') {
        func = args[0];

        if (typeof args[1] == 'function') {
          cb = args[1];
        }
      }

      // runSyncAsync(funcArgs, function func () {});
      else if (_.isArray(args[0])) {
        funcArgs = args[0];

        if (typeof args[1] == 'function') {
          func = args[1];
        }
      }

      // runSyncAsync(funcContext, function func () {});
      else {
        funcContext = args[0];

        if (typeof args[1] == 'function') {
          func = args[1];
        }
      }

      break;
    case 1:
      // runSyncAsync(function () {});

      if (typeof args[0] == 'function') {
        func = args[0];
      }

      break;
    default:
      throw new Error('[runSyncAsync] Invalid arguments list');
      break;
  }

  cb.runSyncAsyncRunned = false;

  var callback = (function (cb) {
    return function () {
      if (cb.runSyncAsyncRunned) {
        delete cb.runSyncAsyncRunned;
      } else {
        cb.runSyncAsyncRunned = true;
        cb.apply(null, arguments);
      }
    }
  })(cb);

  funcArgs.push(callback);

  var result = func.apply(funcContext, funcArgs);
  if (cb.runSyncAsyncRunned) {
    delete cb.runSyncAsyncRunned;
  } else if (typeof result != 'undefined') {
    cb.runSyncAsyncRunned = true;
    console.log('result', result);
    cb.apply(null, [result]);
  }
};


/**
 * @param {*} anything
 */
__.getArray = function (anything) {
  if (!_.isUndefined(anything)) {
    return (_.isArray(anything)) ? anything : [anything];
  }

  return [];
};

/**
 * @param {(...string|...string[])} pathes
 */
__.pathResolver = function (pathes) {
  var tmp = _.compact(_.flatten(_.toArray(arguments)));

  tmp = _.map(tmp, function (path, index) {
    // first item
    if (!index) {
      return path;
    }
    return (tmp[index - 1] != path) ? path : null;
  });

  return _.reduce(_.compact(tmp), function (result, path) {
    return Path.resolve(result, path);
  });
};

module.exports = __;