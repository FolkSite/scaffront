var _            = require('lodash'),
    __           = require('../../helpers'),
    gulpUtil     = require('gulp-util')
;

var utils = {};

utils.getTplData = function (tplFile) {
  var dataFile,
      data = {},
      parsed = path.parse(tplFile.path),
      ext = '.js';

  parsed.name = parsed.name +'-data';
  parsed.ext = ext;
  parsed.base = parsed.name + ext;

  dataFile = path.format(parsed);

  if (dataFile && fs.existsSync(dataFile)) {
    data = require(dataFile);

    if (!_.isPlainObject(data)) {
      try {
        data = JSON.parse(data);
        data = data || {}; // prevent null
      } catch (e) { data = {}; }
    }
  }

  return data;
};


module.exports = utils;