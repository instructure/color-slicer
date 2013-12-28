// This uses fairSlicer to provide arbitrarily fine
// divisions of the hue space. It adjusts saturation
// and brightness to try to maintain legibility
// and visual distinctness.

// x here is a hue angle in degrees

var fairSlicer = require('./lib/fair-slicer');
var converter = require("color-convert");

module.exports = {
  // vary from 95 saturation at red and cyan to 75 at green and violet
  hueToSaturation: function(x) {
    return 85 + Math.round(Math.cos((x-10) / 90 * Math.PI) * 10);
  },

  // This tries to give vivid reds, oranges, and blues,
  // but deep cyans, greens, yellows, and purples.
  // http://imgur.com/YTwrQR1
  hueToBrightness: function(x) {
    return 75 +
      Math.round(Math.cos((x) / 60 * Math.PI) * 10) +
      Math.round(Math.cos((x-20) / 90 * Math.PI) * 5) +
      Math.round(Math.cos((x-30) / 180 * Math.PI) * 10);
  },

  hueToHSV: function(x) {
    return [x, this.hueToSaturation(x), this.hueToBrightness(x)];
  },

  hueToRgb: function(x) {
    var hsb = this.hueToHSV(x);
    return converter.hsv2rgb(hsb[0], hsb[1], hsb[2]);
  },

  rgbToCss: function(rgb) {
    return "rgb("+rgb.join(',')+")";
  },

  getRawColors: function(limit, startX) {
    if (startX === undefined) {
      startX = 270;
    }
    var slices = fairSlicer(limit, 0, 360, startX);
    return slices.map(this.hueToRgb.bind(this));
  },

  getColors: function(limit, startX) {
    var rawColors = this.getRawColors(limit, startX);
    return rawColors.map(this.rgbToCss);
  }
};
