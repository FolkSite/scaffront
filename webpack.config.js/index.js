'use strict';

const config  = require('../scaffront.config.js');
const path    = require('path');
const extend  = require('extend');
const webpack = require('webpack');

// get all entries from './app/frontend/js/'

let wpConfig = {
  output: {
    //filename: !config.env.isProd ? '[name].js' : '[name].v-[chunkhash:10].js',
    filename: '[name].js',
    library: '[name]',
    chunkFilename: '[id].js',
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js']
  },

  externals: {
    //lodash: 'window._',
    jquery: 'window.jQuery',
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new webpack.DefinePlugin(Object.keys(config.env).reduce((_envs, env) => {
      _envs[env] = JSON.stringify(config[env]);

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

wpConfig = extend(true, {}, wpConfig, config.tasks.scripts.webpack);

module.exports = wpConfig;
