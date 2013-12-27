var fairSlicer = require('../lib/fair-slicer');
var _ = require('underscore');

exports.testBasic = function(test) {
  var slices = fairSlicer(3);
  test.equal(slices.length, 3, 'correct number of results');
  test.done();
};

exports.testRange = function(test) {
  var slices = fairSlicer(100, -5, 5);
  var min = Math.min.apply(null, slices);
  var max = Math.max.apply(null, slices);
  test.ok(-5 <= min && min < -4, 'correct minimum');
  test.ok(4 < max && max <= 5, 'correct maximum');
  test.done();
};

exports.testStart = function(test) {
  var slices = fairSlicer(5, 0, 1, 0.5);
  test.equal(slices[0], 0.5, 'correct start');
  test.done();
};

exports.testSpacing = function(test) {
  var counts = [3, 4, 5, 10, 30, 100, 300];
  var cmp = function(a, b) {return a - b;};
  var diff = function(x) {return x[0] - x[1];};
  for (var i = 0; i < counts.length; i++) {
    var count = counts[i];
    var slices = fairSlicer(count);
    slices.sort(cmp);
    var gaps = _.map(_.zip(_.rest(slices), _.initial(slices)), diff);
    min = Math.min.apply(null, gaps);
    max = Math.max.apply(null, gaps);
    test.ok(max / min <= 2, 'correct spacing');
  }
  test.done();
};
