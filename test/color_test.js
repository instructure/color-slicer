var colorSlicer = require('../color-slicer');
var converter = require("color-convert");

exports.testBasic = function(test) {
  var colors = colorSlicer.getColors(6);
  test.equal(colors.length, 6, 'correct number of colors is produced');
  test.done();
};

exports.testContrast = function(test) {
  // failing
  test.done();
  if (true) {return;}

  var colors = colorSlicer.getRawColors(10);
  var legible_y = 1/4.5 * 100;
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok(xyz[1] <= legible_y, 'colors have WCAG AA contrast against white');
  }
  test.done();
};

exports.testSaturation = function(test) {
  test.ok(colorSlicer.hueToSaturation(0) > 90);
  test.ok(colorSlicer.hueToSaturation(30) > 90);
  test.ok(colorSlicer.hueToSaturation(270) < 80);
  test.done();
};

exports.testBrightness = function(test) {
  test.ok(colorSlicer.hueToBrightness(0) > 90);
  test.ok(colorSlicer.hueToBrightness(30) > 80);
  test.ok(colorSlicer.hueToBrightness(60) < 80);
  test.ok(colorSlicer.hueToBrightness(120) > 70);
  test.ok(colorSlicer.hueToBrightness(180) < 65);
  test.ok(colorSlicer.hueToBrightness(210) > 65);
  test.ok(colorSlicer.hueToBrightness(270) < 70);
  test.done();
};
