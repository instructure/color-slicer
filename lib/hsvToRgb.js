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
