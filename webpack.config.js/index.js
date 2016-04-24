'use strict';

const envs = require('../scaffront.env.js');
const webpack = require('webpack');

module.exports = {
  entry: './app/frontend/js/js.js',
  output: {
    path: './dist/frontend/js',
    filename: 'js.js',
    library: 'js'
  },
  //devtool: '#source-map',

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  // dev:
  //watch: true,
  //watchOptions: {
  //  aggregateTimeout: 300
  //},

  devtool: '#inline-source-map',
  //devtool: '#cheap-inline-module-source-map' ?

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
    moduleTemplates: ['*-loader'],
    extensions: ['', '.js']
  },

};
