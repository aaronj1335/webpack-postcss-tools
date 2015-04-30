var expect = require('chai').expect;

var validCSS = "@import './_variables.css';div{background: darkblue;}@media(max-width: 640px){h1,\nh2,\nh3,\nh4,\nh5,\nh6{margin-top: 0;}}";

describe('postcss-tools', function() {
  it('processes CSS with external definitions', function () {
    var css = require('!raw!postcss?pack=tools!./style.css');
    expect(css).to.eql(validCSS);
  });

  it('PostCSS cannot handle external definitions', function () {
    var css = require('!raw!postcss!./style.css');
    expect(css).to.not.eql(validCSS);
  });
});
