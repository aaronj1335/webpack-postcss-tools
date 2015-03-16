#!/usr/bin/env node

var shellJs = require('shelljs');
var webpackConfig = require('../webpack.config.js');

var rm = shellJs.rm;
var exec = shellJs.exec;
var cp = shellJs.cp;
var ls = shellJs.ls;
var sed = shellJs.sed;

var buildPath = webpackConfig.output.path;
var buildFilename = webpackConfig.output.filename;

var buildFilenameEscaped = buildFilename.replace(/\./g, '\\.');
var buildFilenameRegex =
  new RegExp(buildFilenameEscaped.replace('\\\.[hash]', ''));
var builtFilenameRegex =
  new RegExp(buildFilenameEscaped.replace('[hash]', '.*'));

function isBuiltFilename(filename) { return builtFilenameRegex.test(filename); }

function build() {
  rm('-rf', buildPath);

  if (exec('./node_modules/.bin/webpack --bail').code !== 0)
    throw new Error('webpack build failed');

  var builtFilename = ls(buildPath).filter(isBuiltFilename)[0];

  cp('index.html', buildPath);
  sed('-i', buildFilenameRegex, builtFilename, buildPath + '/index.html');
}

build();

