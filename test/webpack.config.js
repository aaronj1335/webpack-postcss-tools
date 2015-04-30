var path = require('path');

var webpackPostcssTools = require('..');
var varMap = webpackPostcssTools.makeVarMap(path.join(__dirname, 'style.css'));

var properties = require('postcss-custom-properties');
var media = require('postcss-custom-media');
var selectors = require('postcss-custom-selectors');

module.exports = {
  target: 'node',
  context: __dirname,
  entry: './css_test.js',
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: 'css_test.js'
  },
  postcss: {
    defaults: [properties, media, selectors],
    tools: [
      webpackPostcssTools.prependTildesToImports,
      properties({variables: varMap.vars}),
      media({extensions: varMap.media}),
      selectors({extensions: varMap.selector})
    ]
  }
};
