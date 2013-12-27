(function(root, factory) {
  var name = 'hsvToRgb';
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root[name] = factory();
  }
}(this, function() {
  // copy/pasted from:
  // http://matthaynes.net/blog/2008/08/07/javascript-colour-functions/

  /**
  * Converts HSV to RGB value.
  *
  * @param {Integer} h Hue as a value between 0 - 360 degrees
  * @param {Integer} s Saturation as a value between 0 - 100 %
  * @param {Integer} v Value as a value between 0 - 100 %
  * @returns {Array} The RGB values  EG: [r,g,b], [255,255,255]
  */
  return function(h, s, v) {
    s = s / 100;
    v = v / 100;
    var hi = Math.floor((h / 60) % 6);
    var f = (h / 60) - hi;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var rgb = [];
    switch (hi) {
      case 0:
        rgb = [v, t, p];
        break;
      case 1:
        rgb = [q, v, p];
        break;
      case 2:
        rgb = [p, v, t];
        break;
      case 3:
        rgb = [p, q, v];
        break;
      case 4:
        rgb = [t, p, v];
        break;
      case 5:
        rgb = [v, p, q];
    }
    var r = Math.min(255, Math.round(rgb[0] * 256));
    var g = Math.min(255, Math.round(rgb[1] * 256));
    var b = Math.min(255, Math.round(rgb[2] * 256));
    return [r, g, b];
  };
}));

(function(root, factory) {
  var name = 'fairSlicer';
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root[name] = factory();
  }
}(this, function() {
  // This divides a range iteratively, using progressively smaller binary
  // increments. A potential improvement here would be jumping around
  // within each pass, to avoid having a temporarily lopsided distribution,
  // but it's not too bad.
  //
  // I originally implemented this using the golden ratio, which gives nice
  // results for small numbers, but it's significantly worse at scale.

  return function(count, min, max, start) {
    if (min === undefined) {
      min = 0;
    }
    if (max === undefined) {
      max = 1;
    }
    if (start === undefined) {
      start = 0;
    }
    var width = max - min;

    var step = 1;
    var gapCount = 1;
    var gapIdx = 0;
    var pos = 0;
    var slices = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      var cut = pos + step;
      pos += step * 2;
      gapIdx++;
      if (gapIdx === gapCount) {
        gapIdx = 0;
        pos = 0;
        step /= 2;
        gapCount = 1 / step / 2;
      }
      cut = min + cut * width + start;
      if (cut >= max) {
        cut -= width;
      }
      slices.push(cut);
    }
    return slices;
  };
}));

(function(root, factory) {
  var name = 'colorSlicer';
  var deps = ['hsvToRgb', 'fairSlicer'];
  var paths = deps.map(function(x) {return './'+x;});
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
