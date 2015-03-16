var fs = require('fs');
var join = require('path').join;
var resolve = require('resolve');
var extend = require('lodash').extend;
var postcss = require('postcss');
var dirname = require('path').dirname;

/**
 * create maps of variables and custom media queries
 *
 * because we want to:
 *
 * - treat every css file as a separate webpack module
 * - statically resolve css variables during the build
 *
 * we run into an issue where we're compiling a css library with variables that
 * might be overridden by a later stylesheet. we solve this by resolving all
 * variables up front (making a "variable map"), and then using this while
 * actually compiling the css during the webpack build.
 *
 * the downside of this approach is that changing a variable value usually
 * requires you to restart the webpack dev build.
 *
 * this takes a single css filename as an entry point and makes a map of all
 * variables, including those defined in `import`'ed css files. it does the
 * same for custom media queries.
 */
function makeVarMap(filename) {
  var map = {vars: {}, media: {}};

  function resolveImport(path, basedir) {
    if (path[0] === '/')
      return path;

    if (path[0] === '.')
      return join(basedir, path);

    // webpack treats anything starting w/ ~ as a module name, which we're
    // about to do below, so just remove leading tildes
    path = path.replace(/^~/, '');

    return resolve.sync(path, {
      basedir: basedir,
      packageFilter: function(package) {
        var newPackage = extend({}, package);

        if (newPackage.style != null)
          newPackage.main = newPackage.style;

        return newPackage;
      }
    });
  }

  function process(filename) {
    var style = postcss().process(fs.readFileSync(filename, 'utf8'));

    // recurse into each import. because we make the recursive call before
    // extracting values (depth-first, post-order traversal), files that import
    // libraries can re-define variable declarations, which more-closely
    // matches the browser's behavior
    style.root.eachAtRule(function(atRule) {
      if (atRule.name !== 'import')
        return;

      var stripped = atRule.params.replace(/^["']/, '').replace(/['"]$/, '');

      process(resolveImport(stripped, dirname(filename)));
    });


    // extract variable definitions
    style.root.eachRule(function(rule) {
      if (rule.type !== 'rule')
        return;

      // only variables declared for `:root` are supported for now
      if (rule.selectors.length !== 1 ||
          rule.selectors[0] !== ':root' ||
          rule.parent.type !== 'root')
        return;

      rule.each(function(decl) {
        var prop = decl.prop;
        var value = decl.value;

        if (prop && prop.indexOf('--') === 0)
          map.vars[prop] = value;
      });
    });


    // extract custom media declarations
    style.root.eachAtRule(function(atRule) {
      if (atRule.name !== 'custom-media')
        return;

      var name = atRule.params.split(/\s+/, 1)[0];
      var nameRe = new RegExp('^' + name + '\\s+');
      var rest = atRule.params.replace(nameRe, '');

      map.media[name] = rest;
    });
  }

  process(filename);

  return map;
}

/**
 * prepend a tilde to css module imports
 *
 * webpack's css-loader [treats css imports as relative paths][url-to-req], not
 * modules. the easiest way i've found to correct this prepending a `~` to each
 * import to force webpack to use it's full module lookup machinery.
 *
 * [url-to-req]: https://github.com/webpack/css-loader/blob/7b50d4f569adcaf5bf185180c15435bde03f4de7/index.js#L37
 */
function prependTildesToImports(styles) {
  styles.eachAtRule(function(atRule) {
    if (atRule.name !== 'import')
      return;

    var stripped = atRule.params.replace(/^["']/, '').replace(/['"]$/, '');

    if (stripped[0] !== '.' && stripped[0] !== '~' && stripped[0] !== '/')
      atRule.params = '"~' + stripped + '"';

  });
}

module.exports = {
  makeVarMap: makeVarMap,
  prependTildesToImports: prependTildesToImports
};
