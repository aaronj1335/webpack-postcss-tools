module.exports = function() {
  var qsa = document.querySelectorAll.bind(document);

  if (qsa('style').length)
    throw new Error('there should not be any <style> elements');

  if (qsa('link[rel=stylesheet]').length != 1)
    throw new Error('there should only be one stylesheet link');

  if (document.styleSheets[0].rules.length != 206)
    throw new Error('expected 206 rules');
};
