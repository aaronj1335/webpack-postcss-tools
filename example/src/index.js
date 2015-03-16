var React = require('react');

var Main = require('./main/index');

require('./index.css');

React.renderComponent(Main(), document.body);

require('./test')();
