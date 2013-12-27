var colorSlicer = require('../lib/colorSlicer');

exports.testBasic = function(test) {
  colors = colorSlicer.getColors(6);
  test.equal(colors.length, 6);
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
