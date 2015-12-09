var _            = require('lodash'),
    __           = require('../../helpers'),
    path         = require('path')
;

var config = {};


/**
 * @property {Copier|Copier[]}
 */
config = [{
  //from: '',
  //to: '',
  //transform: function (stream, cb) {
  //  return stream;
  //},
  //cleanups: _.flatten(cleanupGlobs)
}];

module.exports.utils  = require('./utils');
module.exports.config = config;
