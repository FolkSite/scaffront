var _           = require('lodash'),
    __          = require('../../helpers'),
    path        = require('path'),
    extend      = require('extend'),
    gulp        = require('gulp'),
    fs          = require('fs')
;


//var config = {};
//
//config.src = 'app/pages';
//
//config.dest = 'dist/pages';
//
//config.transform = {
//  build: {
//    inline: function (stream) {
//      stream = stream
//        //.pipe()
//      ;
//
//      return stream;
//    },
//  },
//  dist: {
//    inline: function (stream) {
//      stream = stream
//        //.pipe()
//      ;
//
//      return stream;
//    },
//  },
//};
//
//config.cleanups = {
//  build: {
//    inline: __.getGlobPaths(config.dest, ['css', 'css.map', '!min.css', '!min.css.map'], true),
//  },
//  dist: {
//    inline: '',
//  }
//};
//
///**
// * @type {Copier|Copier[]}
// */
//config.copier = [{
//  //from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg', 'svg']),
//  //to: path.join(config.src.libs, 'fancybox'),
//  //cleanups: __.getGlobPaths(path.join(config.src.libs, 'fancybox'), ['gif', 'png', 'jpg', 'svg'])
//}];



var config = {};
var src = 'app/templates';

config.data = {
  src: gulp.src(path.join(src, '**/*-data.js')),
  dest: 'dist/html'
};

config.globalData = require('../../../app/templates/globals-data');

config.render = {
  src: __.getGlobPaths(src, 'tpl', true),
  dest: 'dist/html',
  swig: {
    swigSetup: function (swigInstance) {},
    swigOptions: {
      //varControls: ['{{', '}}'],
      //tagControls: ['{%', '%}'],
      //cmtControls: ['{#', '#}'],
      cache: false,
      autoescape: true,
      // global template's data
      locals: {

      }
    },
    data: require('../../../app/templates/globals-data'),
    mode: 'render'
  }
};

config.compile = {
  src: gulp.src(__.getGlobPaths(src, 'html')),
  dest: 'app/scripts/tpl',
  swig: {
    swigSetup: function (swigInstance) {},
    swigOptions: {
      varControls: ['{{', '}}'],
      tagControls: ['{%', '%}'],
      cmtControls: ['{#', '#}'],
      cache: false,
      autoescape: true,
      // global template's data
      locals: {

      }
    },
    mode: 'compile', // or 'compile'
    compileTemplate: 'module.exports = <%= template %>;'
  }
};


module.exports.utils  = require('./utils');
module.exports.config = config;