(function(root, factory) {
  var name = 'colorSlicer';
  var deps = ['hsvToRgb', 'fairSlicer'];
  var paths = ['./lib/hsvToRgb', './lib/fair-slicer'];
  if (typeof define === 'function' && define.amd) {
    define(paths, factory);
  } else if (typeof exports === 'object') {
    module.exports = factory.apply(root, paths.map(require));
  } else {
    var modules = deps.map(function(x) {return root[x];});
    root[name] = factory.apply(root, modules);
  }
}(this, function(hsvToRgb, fairSlicer) {
  // This uses fairSlicer to provide arbitrarily fine
  // divisions of the hue space. It adjusts saturation
  // and brightness to try to maintain legibility
  // and visual distinctness.

  // x here is a hue angle in degrees

  return {
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

    hueToCSS: function(x) {
      var hsb = this.hueToHSV(x);
      rgbArray = hsvToRgb(hsb[0], hsb[1], hsb[2]);
      return "rgb("+rgbArray.join(',')+")";
    },

    getColors: function(limit, startX) {
      if (startX === undefined) {
        startX = 270;
      }
      var slices = fairSlicer(limit, 0, 360, startX);
      return slices.map(this.hueToCSS.bind(this));
    }
  };
}));
