#!/usr/bin/env node

var join = require('path').join;
var tmpdir = require('os').tmpdir;
var shelljs = require('shelljs');
var ls = shelljs.ls, rm = shelljs.rm, mkdir = shelljs.mkdir, cp = shelljs.cp,
  cd = shelljs.cd, exec = shelljs.exec;

var tmp = join(tmpdir(), 'webpack-postcss-tools.' + process.pid);
var base = process.cwd();
var testDirs = [];

mkdir(tmp);

ls('examples').forEach(function(d) {
  var dir = join(tmp, d);

  testDirs.push(dir);
  cp('-r', join('examples', d), tmp);
  cd(dir);

  console.log('building example', d);

  if (exec('npm install').code != 0)
    throw new Error('`npm install` failed in', dir);

  if (exec('npm run build').code != 0)
    throw new Error('`npm run build` failed in', dir);

  cd(base);
});

console.log('successfully built tests:\n' + testDirs.join('\n'));
console.log('you can manually test these by running `npm run dev` in the ' +
            'above directories and ensuring that when you load the page, no ' +
            'exceptions are thrown');
