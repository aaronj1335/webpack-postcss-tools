var merge = require('lodash').merge;
var webpackConfig = require('./webpack.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge({}, webpackConfig, {
  resolve: {
    alias: {
      debug: './debug'
    }
  },

  output: {
    filename: 'index.js'
  },

  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin('index.css')
  ]
});
