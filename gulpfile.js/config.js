'use strict';

const path = require('path');
const env = require('../scaffront.env.js');

let servers = {
  dev: {
    ui: false,
    open: false,
    //reloadDelay: 1000,
    //reloadDebounce: 1000,
    ghostMode: false,

    startPath: '/',
    port: 1313,
    server: {
      index: 'index.html',
      directory: true,
      baseDir: 'dist/frontend'
    }
  }
};

var paths = {
  //js : {
  //  context      : path.resolve(process.cwd()),
  //    rootJSPath   : path.resolve(process.cwd(), dir.js),
  //    publicPath   : '/js/',
  //    dest         : path.join(dir.build, 'js'),
  //},
  //styles: {
  //  watch : path.join(dir.stl, '**/*.*'),
  //    src   : path.join(dir.stl, 'main.*'),
  //    dest  : path.join(dir.build, 'css'),
  //},
  //templates : {
  //  watch : path.join(dir.tpl, '**/*.*'),
  //    src   : path.join(dir.tpl, '!(_)*.jade'),
  //    dest  : dir.build,
  //},
  //fonts : {
  //  src  : path.join(dir.fonts, '**.*'),
  //    dest : path.join(dir.build, 'fonts'),
  //},
  //img : {
  //  watch : path.join(dir.dsgn, '**/*.@(jpg|jpeg|png|gif)'),
  //    src   : path.join(dir.dsgn, '**/*.@(jpg|jpeg|png|gif)'),
  //    dest  : path.join(dir.build, 'img'),
  //},
  //imggag : {
  //  watch : path.join(dir.imggag, '**/*.@(jpg|jpeg|png|gif)'),
  //    src   : path.join(dir.imggag, '**/*.@(jpg|jpeg|png|gif)'),
  //    dest  : path.join(dir.build, 'pic'),
  //},
  //svg : {
  //  watch : path.join(dir.svg, '**/*.svg'),
  //    src   : path.join(dir.svg, '**/*.svg'),
  //    dest  : path.join(dir.build, 'svg'),
  //    templates : {
  //    svg : path.resolve(dir.img, 'svg-sprite-templates/svg-sprite.svg'),
  //      css : path.resolve(dir.img, 'svg-sprite-templates/svg-sprite.css'),
  //  },
  //},
};

module.exports = {env, paths, servers};