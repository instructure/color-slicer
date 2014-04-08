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
    var min = Math.min.apply(null, gaps);
    var max = Math.max.apply(null, gaps);
    test.ok(max / min <= 2.7, 'correct spacing');
  }
  test.done();
};

exports.testNeighborSpacing = function(test) {
  var slices = fairSlicer(100);
  var neighborhood_size = 5;
  var neighborhoods = _.initial(slices, 3).map(function(x, i) {
    return slices.slice(i, i+neighborhood_size);
  });
  var build_diff = function(x) {return function(y) {return Math.abs(x - y);};};
  var closest_gaps = neighborhoods.map(function(neighbors) {
    var diff = build_diff(_.first(neighbors));
    var gaps = _.rest(neighbors).map(diff);
    var closest_gap = Math.min.apply(null, gaps);
    return closest_gap;
  });
  var closest_gap = Math.min.apply(null, closest_gaps);
  test.ok(closest_gap > 0.1, 'correct neighbor spacing');
  test.done();
};

exports.testSpeed = function(test) {
  var start = process.hrtime();
  var slices = fairSlicer(500);
  var time = process.hrtime(start)[1] / 1000;
  test.ok(time < 100, 'reasonable speed');
  test.done();
};
