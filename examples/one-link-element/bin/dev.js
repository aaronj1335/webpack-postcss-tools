#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var connect = require('connect');
var connectLogger = require('connect-logger');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackConfig = require('../webpack.config.dev');

var port = 8080;

function indexMiddleware(request, response) {
  fs.createReadStream('index.html').pipe(response);
}

function devServer() {
  var webpackMiddleware = webpackDevMiddleware(webpack(webpackConfig), {
    publicPath: '/',
    outputPath: '/',
    filename: webpackConfig.output.filename,
    hot: false,
    contentBase: __dirname,
    lazy: !process.env.WEBPACK_NO_LAZY,
    stats: {
      cached: false
    }
  });

  var dev = connect()
    .use(connectLogger())
    .use(webpackMiddleware)
    .use(indexMiddleware);

  http.createServer(dev).listen(port);
  console.log('dev server running on port ' + port);
}

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
devServer();

