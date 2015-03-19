var React = require('react');

require('./index.css');
require('suitcss');

module.exports = React.createClass({
  render: function() {
    return React.DOM.span({className: 'Main u-block'},
      'i get enough exercise just pushing my luck!');
  }
});
