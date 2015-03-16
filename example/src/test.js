var React = require('react');

module.exports = function() {
  var qsa = document.querySelectorAll.bind(document);
  var styles = [].slice.call(qsa('style'), 0);
  var nonEmptyStyles = styles.filter(function(style) {
    return style.textContent.replace(/\s/g, '').length;
  });
  var styleText = nonEmptyStyles.map(function(style) {
    return style.textContent;
  }).join('\n');

  if (qsa('.Main').length != 1)
    throw new Error('expected a .Main element');

  if (nonEmptyStyles.length != 28)
    throw new Error('expected 28 non-empty <style> elements');

  nonEmptyStyles.reduce(function(styleSet, style) {
    if (style.textContent in styleSet)
      throw new Error('style duplicated: ' + style.textContent);

    styleSet[style.textContent] = true;

    return styleSet;
  }, {});

  if (/aww-yiss/.test(styleText))
    throw new Error('media queries were not traversed');
};
