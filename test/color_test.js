var colorSlicer = require('../index');
var converter = require("color-convert");

exports.testBasic = function(test) {
  var colors = colorSlicer.getColors(6);
  test.equal(colors.length, 6, 'correct number of colors is produced');
  test.done();
};

exports.testContrast = function(test) {
  var colors = colorSlicer.getRawColors(10);
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok((1+0.05)/(xyz[1]/100+0.05) >= 4.5, 'colors have WCAG AA contrast against white');
  }
  test.done();
};

exports.testBrightContrast = function(test) {
  var colors = colorSlicer.getRawColors(10, undefined, {type: 'bright'});
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok((xyz[1]/100+0.05)/(0+0.05) >= 4.5, 'bright colors have WCAG AA contrast against black');
  }
  test.done();
};
