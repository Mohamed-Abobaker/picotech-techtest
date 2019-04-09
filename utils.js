const getWave = (array, start, name) => {
  const cycleLength = waveCycleLength(array, start, name);

  let count = 0;
  const arrayOfWaveResults = [];

  for (let i = 0; i < array.length / cycleLength; i++) {
    const wave = array.slice(count, count + cycleLength);
    const topWaveVolt = wave
      .map(row => {
        return row[1];
      })
      .sort((a, b) => {
        if (a < 0) a = -a;
        if (b < 0) b = -b;
        return b - a;
      })
      .slice(0, 1);
    const time = waveTime(wave);
    arrayOfWaveResults.push([time, ...topWaveVolt]);
    count += cycleLength;
  }

  const biggestAmplitudeWave = getBiggestAmplitudeWave(
    arrayOfWaveResults,
    name
  );
  return [name, `${1 / biggestAmplitudeWave[0]}`];
};

const waveTime = arr => {
  const time = arr.reduce((acc, curr) => {
    return acc + curr[0];
  }, 0);
  return time;
};

const getBiggestAmplitudeWave = (arr, name) => {
  const sortedArr = arr.sort((a, b) => {
    a = a[1];
    b = b[1];
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    return b - a;
  });
  const filteredArr = sortedArr
    .filter(wave => {
      return wave[1] == sortedArr[0][1];
    })
    .sort((a, b) => {
      a = a[0];
      b = b[0];
      return a - b;
    });
  return filteredArr[0];
};

const waveCycleLength = (array, start, name) => {
  let volts = array.map(row => {
    return row[1];
  });
  let cycleLength = 0;
  let isMinus = false;
  let isPositive = false;
  let reachedBelowStart = false;
  let reachedAboveStart = false;
  let isCurrent = false;
  for (let x = 0; x < array.length; x++) {
    if (start === volts[0]) {
      if (array[x][1] < start) reachedBelowStart = true;
      if (array[x][1] == start && reachedBelowStart) {
        cycleLength = x + 1;
        break;
      }
    } else if (
      volts.some(num => num < 0) &&
      volts.some(num => num > 0) &&
      start !== 0 &&
      volts.includes(start)
    ) {
      if (volts.includes(start)) isCurrent = false;
      if (array[x][1] < 0) isMinus = true;
      if (array[x][1] > 0) isPositive = true;
      if (array[x][1] === start) isCurrent = true;
      if (isMinus && isPositive && isCurrent) {
        cycleLength = x + 1;
        break;
      }
    } else if (
      volts.some(num => num < 0) &&
      volts.some(num => num > 0) &&
      start !== 0 &&
      start < 0
    ) {
      if (array[x][1] < 0) isMinus = true;
      if (array[x][1] > 0) isPositive = true;
      if (array[x][1] > start) reachedAboveStart = true;
      if (isMinus && isPositive && reachedAboveStart && array[x][1] < 0) {
        cycleLength = x + 1;
        break;
      }
    } else if (
      volts.some(num => num < 0) &&
      volts.some(num => num > 0) &&
      start !== 0
    ) {
      if (array[x][1] < 0) isMinus = true;
      if (array[x][1] > 0) isPositive = true;
      if (array[x][1] > start) reachedAboveStart = true;
      if (array[x][1] < start) reachedBelowStart = true;
      if (
        isMinus &&
        isPositive &&
        reachedBelowStart &&
        reachedAboveStart &&
        array[x][1] > 0
      ) {
        cycleLength = x + 1;
        break;
      }
    } else if (
      volts.some(num => num < 0) &&
      volts.some(num => num > 0) &&
      start === 0
    ) {
      if (array[x][1] < 0) isMinus = true;
      if (array[x][1] > 0) isPositive = true;
      if (isMinus && isPositive && array[x][1] > 0) {
        cycleLength = x + 1;
        break;
      }
    } else if (!volts.some(num => num < 0) && volts.includes(start)) {
      if (array[x][1] <= start) reachedBelowStart = true;
      if (array[x][1] > start) reachedAboveStart = true;
      if (array[x][1] == start && reachedBelowStart && reachedAboveStart) {
        cycleLength = x + 1;
        break;
      }
    } else {
      if (array[x][1] <= start) reachedBelowStart = true;
      if (array[x][1] <= start) reachedAboveStart = true;
      if (array[x][1] == start && reachedBelowStart) {
        cycleLength = x + 1;
        break;
      }
    }
  }
  // console.log(name, "  cycleLength:", cycleLength);
  return cycleLength;
};

module.exports = { getWave, waveTime };
