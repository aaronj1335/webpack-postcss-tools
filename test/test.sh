#!/bin/bash -e

tmp=/tmp/webpack-postcss-tools.$$
thisdir=`pwd`

rm -rf $tmp/example
mkdir -p $tmp
cp -r example $tmp/
cd $tmp/example
npm install $thisdir
npm install
npm run build

