# `webpack-postcss-tools`

> tools that make it easier to use postcss plugins with webpack's css-loader

<a href="https://travis-ci.org/aaronj1335/webpack-postcss-tools">
  <img src="https://travis-ci.org/aaronj1335/webpack-postcss-tools.svg" />
</a>

[webpack][]'s [`css-loader`][css-loader] is a great way to include css your
frontend builds because it treats every css file as a separate webpack module
in the dependency graph. this means:

- you only include the css you want
- it resolves `@import` statements just like `require()` calls in js (i.e. by
  finding packages in `node_modules`)
- you can make css-only npm packages (like [suitcss][])

the downside is things like variable resolution get tricky (more on that
[here][var-resolution]).

these tools give you the full power of webpack's dependency management without
sacrificing must-have css features.

## usage

check out [the examples directory][] to see it working. the webpack config
looks something like this:

```js
var join = require('path').join;
var webpackPostcssTools = require('webpack-postcss-tools');

var map = webpackPostcssTools.makeVarMap('src/index.css');

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
      
    require('postcss-custom-selector')({
      extensions: map.selector
    }),

    require('postcss-calc')()
  ]
};
```

[webpack]: http://webpack.github.io
[css-loader]: https://github.com/webpack/css-loader
[suitcss]: https://suitcss.github.io
[var-resolution]: https://github.com/aaronj1335/rework-webpack-loader#why-not-just-chain-plugins-together
[the examples directory]: https://github.com/aaronj1335/webpack-postcss-tools/tree/master/examples
