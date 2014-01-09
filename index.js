// This uses fairSlicer to provide arbitrarily fine
// divisions of the hue space. It uses the lab color
// space to maintain legibility and distinctiveness.

// x here is a hue angle in degrees

var fairSlicer = require('./lib/fair-slicer');
var converter = require("color-convert");

module.exports = {
  lchToLab: function(l, c, h) {
    h = h / 360 * 2 * Math.PI;
    return [l, c * Math.cos(h), c * Math.sin(h)];
  },

  getLightnessAndChroma: function(type) {
    if (type == 'bright') {
      return {l: 85, c: 48};
    } else {
      // legible for small text on a white background
      return {l: 50, c: 32};
    }
  },

  labToRgb: function(lab) {
    var xyz = converter.lab2xyz.apply(converter, lab);
    var rgb = converter.xyz2rgb.apply(converter, xyz);
    return rgb;
  },

  rgbToCss: function(rgb) {
    return "rgb("+rgb.join(',')+")";
  },

  getLabColors: function(limit, startX, options) {
    if (startX === undefined) {
      startX = 330;
    }
    if (!options) {
      options = {};
    }

    if (!options.l) {
      options = this.getLightnessAndChroma(options.type);
    }
    var hueToLab = function(h) {
      return this.lchToLab(options.l, options.c, h);
    }.bind(this);

    var slices = fairSlicer(limit, 0, 360, startX);
    return slices.map(hueToLab);
  },

  getRgbColors: function(limit, startX, options) {
    var labColors = this.getLabColors(limit, startX, options);
    return labColors.map(this.labToRgb);
  },

  getColors: function(limit, startX, options) {
    var rgbColors = this.getRgbColors(limit, startX, options);
    return rgbColors.map(this.rgbToCss);
  }
};
