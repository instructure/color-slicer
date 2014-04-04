// This divides a range iteratively, using progressively smaller binary
// increments. A potential improvement here would be jumping around
// within each pass, to avoid having a temporarily lopsided distribution,
// but it's not too bad.
//
// I originally implemented this using the golden ratio, which gives nice
// results for small numbers, but it's significantly worse at scale.

module.exports = function(count, min, max, start) {
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

  var slices = [min];
  var build_adder = function(x) {return function(y) {return x + y;};};
  while (slices.length < count) {
      var shift = width / slices.length / 2;
      var adder = build_adder(shift);
      slices = slices.concat(slices.map(adder));
  }

  slices = slices.slice(0, count);
  slices = slices.map(function(slice) {
    slice += start;
    return slice > max ? slice - width : slice;
  });

  return slices;
};
