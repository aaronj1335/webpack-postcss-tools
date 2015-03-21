var join = require('path').join;
var webpackPostcssTools = require('webpack-postcss-tools');

var map = webpackPostcssTools.makeVarMap('./src/index.css');

module.exports = {
  entry: './src/index',

  resolve: {
    // this is important if, like SUIT CSS, you specify a `style` property in
    // the package.json
    packageMains: ['webpack', 'browser', 'web', 'style', 'main']
  },

  output: {
    path: join(__dirname, 'dist'),
    filename: 'index.[hash].js'
  },

  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css?importLoaders=1!postcss'},
      {
        test: /\.((png)|(eot)|(woff)|(ttf)|(svg)|(gif))$/,
        loader: 'file?name=/[hash].[ext]'
      }
    ]
  },

  postcss: [
    webpackPostcssTools.prependTildesToImports,

    require('postcss-custom-properties')({
      variables: map.vars
    }),

    require('postcss-custom-media')({
      extensions: map.media
    }),

    require('postcss-calc')()
  ]
};

