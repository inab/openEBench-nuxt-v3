export default function BoxPlotConverter(data, log2) {
  const name = data[0].label;
  const metric_id = data[0].metric_id;
  const values = data[0].values;

  if (values != null && Array.isArray(values)) {
    const array = values;
    const z = new Array(array.length);

    for (let j = 0, m = array.length; j < m; j++) {
      const value = array[j];
      if (typeof value === "number") {
        z[j] = value;
      } else if (value && typeof value.toDouble === "function") {
        z[j] = value.toDouble();
      } else if (value && value._bsontype === "Double") {
        z[j] = value.value;
      }
    }

    if (log2) {
      for (let i = 0, n = z.length; i < n; i++) {
        z[i] = Math.log10(z[i]);
      }
    }

    z.sort((a, b) => a - b);

    const mean =
      z.length > 0 ? z.reduce((sum, val) => sum + val, 0) / z.length : NaN;
    const y0 = z[Math.ceil(0.25 * z.length)];
    const y1 = z[Math.ceil(0.5 * z.length)];
    const y2 = z[Math.ceil(0.75 * z.length)];
    const iqr = y2 - y0;

    const lowerFence = y0 - 1.5 * iqr;
    const upperFence = y2 + 1.5 * iqr;

    const lo = getLowOutliers(z, lowerFence);
    const ho = getHighOutliers(z, upperFence);

    const loOutlier = lo < 0 || lo >= z.length ? [null, null] : [z[0], z[lo]];
    const hiOutlier =
      ho < 0 || ho >= z.length ? [null, null] : [z[z.length - 1], z[ho]];

    const boxplot = {
      name: name,
      metric_id: metric_id,
      q1: y0,
      mean: mean,
      median: y1,
      q3: y2,
      lowerfence: lowerFence,
      upperfence: upperFence,
      looutlier: loOutlier,
      hioutlier: hiOutlier,
    };

    return boxplot;
  }

  return null;
}

function binarySearch(array, from, to, target) {
  let low = from;
  let high = to - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = array[mid];

    if (value < target) {
      low = mid + 1;
    } else if (value > target) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return ~low;
}

function getLowOutliers(z, lowerFence) {
  const end = Math.ceil(0.25 * z.length);
  const idx = binarySearch(z, 0, end, lowerFence);
  return (idx < 0 ? ~idx : idx) - 1;
}

function getHighOutliers(z, upperFence) {
  const start = Math.ceil(0.75 * z.length);
  const idx = binarySearch(z, start, z.length, upperFence);
  return (idx < 0 ? ~idx : idx) + 1;
}
