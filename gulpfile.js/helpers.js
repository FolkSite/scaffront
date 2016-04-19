var _              = require('lodash'),
    FS             = require('fs'),
    Path           = require('path'),
    Crypto         = require('crypto'),
    bowerDirectory = require('bower-directory')
  ;

var __ = {};

__.noop = function noop () {};

var bowerPath = (bowerDirectory) ? bowerDirectory.sync() : '';
__.bower = {
  path: bowerPath,
  pathRelative: Path.relative(process.cwd(), bowerPath)
};

/**
 * @param {string} [directory]
 * @returns String
 */
__.getPackagePath = function (directory) {
  return Path.join('node_modules', directory || '');
};

/**
 * @param {string} [directory]
 * @returns String
 */
__.getBowerPath = function (directory) {
  return Path.join(__.bower.pathRelative, directory || '');
};

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
 * @param {String} path
 * @param {{startSlash: Boolean, trailingSlash: Boolean}} [config]
 * @param {...} [toJoin]
 */
__.preparePath = function (path, config, toJoin) {
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
 *
 * @param {String|String[]} paths
 * @param {String|String[]|boolean} [globs] Default is '.*'. Pass false for return only paths without extensions
 * @param {boolean} [forceDeep] If undefined then has no effect. But if it == true/false then to each path will be added/removed suffix '/**'
 * @returns {[]}
 */
__.getGlob = function (paths, globs, forceDeep) {
  var result = [];
  paths = __.getArray(paths || null);
  globs = __.getArray(globs || null);

  if (!globs.length || (globs.length == 1 && !globs[0])) {
    globs = [];
  }

  paths = _.compact(paths);
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

  _.each(paths, function (path) {
    var isPathExcluded = (path.indexOf('!') === 0);

    if (_.isBoolean(forceDeep)) {
      path = __.preparePath({trailingSlash: false}, path);
      var pathIsDeep = /\*\*$/.test(path);

      if (forceDeep && !pathIsDeep) {
        path = Path.join(path, '**');
      } else if (!forceDeep && pathIsDeep) {
        path = path.slice(0, path.length - 2);
      }
    }

    if (!globs.length) {
      result.push(path);
    } else {
      _.each(globs, function (file) {
        var isFileExcluded = (file.indexOf('!') === 0);
        if (isFileExcluded) {
          file = file.slice(1);
        }

        if ((isFileExcluded || isPathExcluded) && path.indexOf('!') !== 0) {
          path = '!'+ path;
        }

        result.push(Path.join(path, file));
      });
    }
  });

  return _.uniq(result);
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
 * @param {*} anything
 */
__.getArray = function (anything) {
  if (!_.isUndefined(anything)) {
    return (_.isArray(anything)) ? anything : [anything];
  }

  return [];
};

/**
 * @param {(...string|...string[])} paths
 */
__.pathResolver = function (paths) {
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
