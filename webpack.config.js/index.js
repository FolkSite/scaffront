'use strict';

const envs = require('../scaffront.env.js');
const fs   = require('fs');
const path = require('path');
const webpack = require('webpack');

// get all entries from './app/frontend/js/'
let context = path.resolve('./app/frontend/');
let entries = fs.readdirSync(path.join(context, 'js')).reduce(function (all, file) {
  if (/\.js$/.test(file) && !/^_/.test(file)) {
    all[path.basename(file, '.js')] = './js/'+ file;
  }

  return all;
}, {});

let config = {
  context: context, /* ignored in gulp task */
  entry: entries, /* ignored in gulp task */

  profile: !envs.isProd,
  devtool: !envs.isProd ? '#module-cheap-inline-source-map' : '#source-map', /* ignored in gulp task */

  output: {
    path: path.resolve('./dist/frontend/js'), /* ignored in gulp task */
    publicPath: '/js/',
    filename: !envs.isProd ? '[name].js' : '[name].v-[chunkhash:10].js',
    library: '[name]',
    chunkFilename: '[id].js',
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js'],
    root: [path.resolve('./app/frontend')] /* ignored in gulp task */
  },

  externals: {
    //lodash: 'window._',
    jquery: 'window.jQuery',
  },

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
      loader: 'babel',
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
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
  }
};

module.exports = config;
