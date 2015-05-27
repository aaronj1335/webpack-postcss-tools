var expect = require('chai').expect;

describe('webpack-postcss-tools', function() {
  it('injects variables from another file imported by @import ...', function () {
    var css = require('!raw!postcss?pack=tools!./style.css');
    expect(css).to.eql("@import './_variables.css';div{background: darkblue;}@media(max-width: 640px){h1,\nh2,\nh3,\nh4,\nh5,\nh6{margin-top: 0;}}");
  });

  it('injects variables from another file imported  @import url(...)', function () {
    var css = require('!raw!postcss?pack=tools!./styleWithUrlImport.css');
    expect(css).to.eql("@import url('./_variables.css');div{background: darkblue;}@media(max-width: 640px){h1,\nh2,\nh3,\nh4,\nh5,\nh6{margin-top: 0;}}");
  });
});

describe('postcss without webpack-postcss-tools', function() {
  it('does not inject variables from @import-ed file', function () {
    var css = require('!raw!postcss!./style.css');
    expect(css).to.eql("@import './_variables.css';div{background:var(--darkBlue);}@media(--mobile){--heading{margin-top: 0;}}");
  });
});
