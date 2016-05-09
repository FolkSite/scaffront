const _ = require('lodash');
const resolve = require('resolve');

var resolveModule = function resolveModule (url, opts) {
  var resolved;

  try {
    resolved = resolve.sync(url, opts || {});
  } catch (e) {
    resolved = '';
  }

  return resolved;
};

/**
 * @param id
 * @param {string|{basedir: string}} basedir
 * @param {{}} [opts]
 * @param {string} [opts.basedir]
 */
module.exports = function (id, basedir, opts) {
  if (_.isPlainObject(basedir)) {
    opts = basedir;
  } else {
    opts = (_.isPlainObject(opts)) ? opts : {};
    opts.basedir = basedir;
  }
  var paths = [].concat(opts.path || []);

  id = id.split('?')[0];

  var resolved = resolveModule('./'+ id, opts);
  if (!resolved) {
    resolved = resolveModule(id, opts);
  }

  if (!resolved) {
    if (paths.indexOf(opts.basedir) === -1) {
      paths.unshift(opts.basedir)
    }

    throw new Error([
      "Failed to find '" + id + "'",
      "in [ ",
      "    " + paths.join(",\n        "),
      "]"
    ].join("\n    "));
  }

  return resolved;
};
