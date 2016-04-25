'use strict';

const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const path     = require('path');
const envs     = require('../../scaffront.env.js');
const lazypipe = require('lazypipe');
const gulplog  = require('gulplog');

const webpackStream = require('webpack-stream');
const webpack       = webpackStream.webpack;
const named         = require('vinyl-named');
const AssetsPlugin  = require('assets-webpack-plugin');

var streams = {};

streams.webpack = function (options) {
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return;  // emit('error', err) in webpack-stream
    }

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true
    }));

  }

  if (!_.isPlainObject(options)) {
    options = {
      output: {
        publicPath: '/js/',
        filename: !envs.isProd ? '[name].js' : '[name].v-[chunkhash:10].js',
        library: '[name]',
        chunkFilename: '[id].js',
      },

      resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js'],
        root: [
          path.resolve('./app/frontend')
        ]
      },

      //externals: {
      //  lodash: '_',
      //  jquery: 'jQuery',
      //},

      //watch:   !envs.isProd,
      //watchOptions: {
      //  aggregateTimeout: 300
      //},

      devtool: !envs.isProd ? '#inline-source-map' : '#source-map',

      plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.EnvironmentPlugin(Object.keys(process.env)),
        new webpack.DefinePlugin(Object.keys(envs).reduce((_envs, env) => {
          _envs[env] = JSON.stringify(envs[env]);

          return _envs;
        }, {})),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          minChunks: 2
        })
      ],

      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: [
              ['transform-runtime', {
                "polyfill": false,
                "regenerator": true
              }]
            ]
          },
        }],
        noParse: [
          /angular\/angular.js/,
          /lodash/,
          // /jquery/,
        ]
      },
      resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
      },
    };

    if (!envs.isProd) {
      options.plugins.push(new AssetsPlugin({
        filename: 'webpack.json',
        path:     __dirname + '/manifest',
        processOutput(assets) {
          for (let key in assets) {
            assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
            delete assets[key];
          }
          return JSON.stringify(assets);
        }
      }));
    }
  }

  return lazypipe()
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'Webpack',
        message: err.message
      }))
    }))
    .pipe(named())
    .pipe(webpackStream(options, null, done))
    .pipe($.if(!envs.isProd, uglify()))
  ;
};


module.exports = streams;