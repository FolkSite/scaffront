const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const fs             = require('fs');
const path           = require('path');
const crypto         = require('crypto');
const bowerDirectory = require('bower-directory');
const browserSync    = require('browser-sync');

var __ = {};

__.noop = function noop () {};

var bowerPath = (bowerDirectory) ? bowerDirectory.sync() : '';
__.bower = {
  path: bowerPath,
  pathRelative: path.relative(process.cwd(), bowerPath)
};

/**
 * @param {string} [directory]
 * @returns String
 */
__.getPackagePath = function getPackagePath (directory) {
  return path.join('node_modules', directory || '');
};

/**
 * @param {string} [directory]
 * @returns String
 */
__.getBowerPath = function getBowerPath (directory) {
  return path.join(__.bower.pathRelative, directory || '');
};

/**
 * @param {String} from
 * @param {String} [to]
 * @returns {string}
 */
__.getRelativePath = function getRelativePath (from, to) {
  var result = '';
  from = from || null;
  to = to || null;

  if (!from) { return result; }

  if (to) {
    result = path.relative(from, to);
  } else if (path.isAbsolute(from)) {
    result = from.substr(1);
  } else {
    result = from;
  }

  return result;
};

/**
 * @param {String} pathname
 * @returns {Boolean}
 */
__.hasTrailingSlash = function hasTrailingSlash (pathname) {
  pathname = pathname.toString() || '';
  if (!pathname) { return false; }

  var lastChar = pathname.substr(pathname.length - 1);
  return (lastChar == '/' || lastChar == '\\')
};

/**
 * @param {String} pathname
 * @returns {boolean}
 */
__.isFile = function isFile (pathname) {
  pathname = pathname.toString() || '';
  if (!pathname) { return false; }

  return (!!path.extname(pathname) && !__.hasTrailingSlash(pathname));
};

/**
 * @param {String} pathname
 * @param {{}} config
 * @param {Boolean} [config.startSlash]
 * @param {Boolean} [config.trailingSlash]
 * @param {string[]} [toJoin]
 */
__.preparePath = function preparePath (pathname, config, toJoin) {
  if (!pathname) { return ''; }

  config = _.isPlainObject(config) ? config : {};
  toJoin = (_.isArray(toJoin)) ? toJoin : [];
  pathname = path.join.apply(null, [pathname].concat(toJoin));

  if (typeof config.startSlash != 'undefined') {

    if (config.startSlash && !path.isAbsolute(pathname)) {
      pathname = path.join('/', pathname);
    }
    if (!config.startSlash && path.isAbsolute(pathname)) {
      pathname = path.relative('/', pathname);
    }

  }

  if (typeof config.trailingSlash != 'undefined') {

    if (config.trailingSlash && !__.isFile(pathname)) {
      pathname += '/';
    }
    if (!config.trailingSlash) {
      var lastChar = pathname.substr(pathname.length - 1);
      if (lastChar == '/' || lastChar == '\/') {
        pathname = pathname.substr(0, pathname.length - 1);
      }
    }

  }

  pathname = path.normalize(pathname);

  return pathname;
};

/**
 * @param {string} pathname
 * @param {boolean} [format=false]
 * @returns {{root: string, dir: string, base: string, ext: string, name: string, isOnlyFile: boolean, isOnlyPath:
 *   boolean, isPathToFile: boolean}|string}
 */
__.parsePath = function parsePath (pathname, format) {
  format = !!format;
  var isFile = __.isFile(pathname);
  var parsed = path.parse(pathname);

  if (!isFile) {
    parsed.base = '';
    parsed.name = '';
    parsed.dir = pathname;
  } else {
    parsed.dir = parsed.dir.split(path.sep).join('/');
  }

  parsed.isPathToFile = isFile && !!parsed.dir;
  parsed.isOnlyFile   = isFile && !parsed.isPathToFile;
  parsed.isOnlyPath   = !isFile;

  return (format)
    ? path.normalize(path.format(parsed))
    : parsed;
};

/**
 * @param content
 * @returns {String}
 */
__.md5 = function md5 (content) {
  return crypto.createHash('md5').update(content).digest('hex');
};

/**
 * @param {String|{path: string}} file
 * @returns {{css: boolean, scss: boolean, sass: boolean, js: boolean, minified: boolean, underscored: boolean}}
 * @constructor
 */
__.Is = function Is (file) {
  var pathname = '';
  if (_.isString(file)) {
    pathname = file;
  } else if (_.isString(file.path)) {
    pathname = file.path;
  }

  var extname = path.extname(pathname);
  var basename = path.basename(pathname, extname);

  return {
    css: extname === '.css',
    scss: extname === '.scss',
    sass: extname === '.sass',
    js: extname === '.js',
    minified: /\.min$/.test(basename),
    underscored: /^_/.test(basename)
  };
};

/**
 * @param {string} pathname
 * @returns {string}
 */
__.filePathWithoutExt = function filePathWithoutExt (pathname) {
  return path.basename(pathname, path.extname(pathname))
};

/**
 * @param {Function} getFile
 * @returns {Function}
 */
__.getDataForTpl = function getDataForTpl (getFile) {

  return function (file) {
    var dataFile = false;
    var data = {}, _data;

    if (_.isFunction(getFile)) {
      dataFile = getFile(file);
    } else if (_.isString(getFile)) {
      dataFile = getFile;
    }

    if (dataFile && fs.existsSync(dataFile)) {
      _data = require(dataFile);
      data = (_.isPlainObject(_data)) ? _data : data;
    }

    return data;
  };
};

/**
 *
 * @param {String|String[]} pathnames
 * @param {String|String[]|boolean} [globs] Default is '.*'. Pass false for return only pathnames without extensions
 * @param {boolean} [forceDeep] If undefined then has no effect. But if it == true/false then to each path will be
 *   added/removed suffix '/**'
 * @returns {[]}
 */
__.glob =
__.getGlob = function glob (pathnames, globs, forceDeep) {
  var result = [];
  pathnames = __.getArray(pathnames || null);
  globs = __.getArray(globs || null);

  if (!globs.length || (globs.length == 1 && !globs[0])) {
    globs = [];
  }

  pathnames = _.compact(pathnames);
  globs = _.compact(globs);

  globs = _.map(globs, function (glob) {
    var itsExclude = (glob.indexOf('!') === 0);
    if (itsExclude) {
      glob = glob.slice(1);
    }

    var isSimpleExt = false,
        ext = '',
        matches = glob.match(/^\*?\.?([a-z0-9]+)$/i);

    if (matches && matches[1]) {
      ext = matches[1];
      isSimpleExt = true;
    }

    if (isSimpleExt && ext) {
      glob = '*.'+ ext;
    }

    if (itsExclude) {
      glob = '!'+ glob;
    }

    return glob;
  });

  _.each(pathnames, function (pathname) {
    var isPathExcluded = (pathname.indexOf('!') === 0);

    if (_.isBoolean(forceDeep)) {
      pathname = __.preparePath(pathname, {trailingSlash: false});
      var pathIsDeep = /\*\*$/.test(pathname);

      if (forceDeep && !pathIsDeep) {
        pathname = path.join(pathname, '**');
      } else if (!forceDeep && pathIsDeep) {
        pathname = pathname.slice(0, pathname.length - 2);
      }
    }

    if (!globs.length) {
      result.push(pathname);
    } else {
      _.each(globs, function (file) {
        var isFileExcluded = (file.indexOf('!') === 0);
        if (isFileExcluded) {
          file = file.slice(1);
        }

        if ((isFileExcluded || isPathExcluded) && pathname.indexOf('!') !== 0) {
          pathname = '!'+ pathname;
        }

        result.push(path.join(pathname, file));
      });
    }
  });

  return _.uniq(result);
};

/**
 * @param {*} obj
 * @returns {string}
 */
__.stringify = function stringify (obj) {
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
 * @param {*} anything
 */
__.getArray = function getArray (anything) {
  if (!_.isUndefined(anything)) {
    return (_.isArray(anything)) ? anything : [anything];
  }

  return [];
};

/**
 * @param {(...string|...string[])} paths
 */
__.pathResolver = function pathResolver (paths) {
  var tmp = _.compact(_.flatten(_.toArray(arguments)));

  tmp = _.map(tmp, function (pathname, index) {
    // first item
    if (!index) {
      return pathname;
    }
    return (tmp[index - 1] != pathname) ? pathname : null;
  });

  return _.reduce(_.compact(tmp), function (result, pathname) {
    return path.resolve(result, pathname);
  });
};


var bsInstances = {};
__.server = {
  get: function server$get (instanceName) {
    return bsInstances[instanceName] && bsInstances[instanceName].instance || null;
  },

  /**
   * @param {string} instanceName
   * @param {{}} [config]
   * @returns {*}
   */
  run: function server$run (instanceName, config) {
    if (!instanceName) {
      console.warn('[runServer] `instanceName` is required');
    }

    config = (_.isPlainObject(config)) ? config : {};

    var bs;
    try {
      bs = browserSync.get(instanceName);
    } catch (e) {
      bs = browserSync.create(instanceName);

      bsInstances[instanceName] = {
        name:     instanceName,
        inited:   false,
        pending:  false,
        instance: bs
      };

      bs.emitter.on('init', (function (instanceName) {
        return function () {
          bsInstances[instanceName].inited = true;
          bsInstances[instanceName].pending = false;
        }
      })(instanceName));
    }

    if (bs.paused) {
      bs.resume();
    } else
    if (!bs.active && !bsInstances[instanceName].pending) {
      bsInstances[instanceName].pending = true;
      bs.init(config);
    }

    return bs;
  },

  /**
   *
   * @param {string} instanceName
   * @param {Stream} [stream]
   * @param {{}} [options]
   * @returns {*}
   */
  reload: function server$reload (instanceName, stream, options) {
    if (!instanceName) {
      console.warn('[reloadServer] `instanceName` is required');
    }

    var instance = __.server.run(instanceName);
    if (!instance) {
      console.warn('[reloadServer] Try to reload not existing `instanceName`');
    }

    var args; for (var i = arguments.length, a = args = new Array(i); i--; a[i] = arguments[i]) {}

    switch (args.length) {
      case 1:
        stream = null;
        options = {};
        break;
      case 2:
        if ($.util.isStream(args[1])) {
          options = {};
        } else if (!_.isUndefined(args[1])) {
          stream = null;
          options = args[1];
        }
        break;
      default:
        stream = $.util.isStream(stream) ? stream : null;
        options = (!_.isUndefined(options)) ? options : {};
    }

    if (stream) {
      stream.pipe(instance.stream(options));
    } else {
      instance.reload(options);
    }

    return instance;
  }
};

module.exports = __;
