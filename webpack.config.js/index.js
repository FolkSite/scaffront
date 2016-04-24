'use strict';

const envs = require('../scaffront.env.js');
const path = require('path');
const webpack = require('webpack');

console.log(path.resolve('./app/frontend'));

const config = {
  entry: './app/frontend/js/js.js',
  output: {
    path: './dist/frontend/js',
    filename: 'js.js',
    library: 'js'
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js'],
    root: [
      path.resolve('./app/frontend')
    ]
  },

  //watch: (envs.isProd),
  //watchOptions: {
  //  aggregateTimeout: 300
  //},

  devtool: (!envs.isProd) ? '#inline-source-map' : '#source-map',

  plugins: [
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new webpack.DefinePlugin(Object.keys(envs).reduce((_envs, env) => {
      _envs[env] = JSON.stringify(envs[env]);

      return _envs;
    }, {}))
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
    }]
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },
};


if (envs.isProd) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}

module.exports = config;
