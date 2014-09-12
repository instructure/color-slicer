var colorSlicer = require('../index');
var converter = require("color-convert");

exports.testBasic = function(test) {
  var colors = colorSlicer.getColors(6);
  test.equal(colors.length, 6, 'correct number of colors is produced');
  test.done();
};

exports.testContrast = function(test) {
  var colors = colorSlicer.getRgbColors(100);
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok((1+0.05)/(xyz[1]/100+0.05) >= 4.5, 'colors have WCAG AA contrast against white');
  }
  test.done();
};

exports.testBrightContrast = function(test) {
  var colors = colorSlicer.getRgbColors(100, undefined, {bright: true});
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    var xyz = converter.rgb2xyz(color);
    test.ok((xyz[1]/100+0.05)/(0+0.05) >= 4.5, 'bright colors have WCAG AA contrast against black');
  }
  test.done();
};

exports.testExpressible = function(test) {
  var colors = colorSlicer.getLchColors(100);
  for (var i = 0; i < colors.length; i++) {
    var lch = colors[i];
    var rgb = converter.lch2rgb(lch);
    var lch2 = converter.rgb2lch(rgb);
    lch[2] %= 360;
    lch2[2] %= 360;
    for (j = 0; j < 3; j++) {
      test.ok(Math.abs(lch[j] - lch2[j]) <= 1, 'colors are accurately expressible in RGB');
    }
  }
  test.done();
};

exports.testBrightExpressible = function(test) {
  var colors = colorSlicer.getLchColors(100, undefined, {bright: true});
  for (var i = 0; i < colors.length; i++) {
    var lch = colors[i];
    var rgb = converter.lch2rgb(lch);
    var lch2 = converter.rgb2lch(rgb);
    lch[2] %= 360;
    lch2[2] %= 360;
    for (j = 0; j < 3; j++) {
      test.ok(Math.abs(lch[j] - lch2[j]) <= 1, 'bright colors are accurately expressible in RGB');
    }
  }
  test.done();
};

exports.testUnsafeExpressible = function(test) {
  var colors = colorSlicer.getLchColors(100, undefined, {unsafe: true});
  for (var i = 0; i < colors.length; i++) {
    var lch = colors[i];
    var rgb = converter.lch2rgb(lch);
    var lch2 = converter.rgb2lch(rgb);
    lch[2] %= 360;
    lch2[2] %= 360;
    for (j = 0; j < 3; j++) {
      test.ok(Math.abs(lch[j] - lch2[j]) <= 1, 'unsafe colors are accurately expressible in RGB');
    }
  }
  test.done();
};
