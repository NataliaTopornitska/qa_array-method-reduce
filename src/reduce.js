'use strict';

/**
 * @param {function} callback
 * @param {*} startValue
 *
 * @returns {*}
 */
function reduce(callback, startValue) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const arr = this;
  let hasInitialValue = arguments.length > 1;
  let accumulator;
  let startIndex = 0;

  if (arr.length === 0 && !hasInitialValue) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  if (hasInitialValue) {
    accumulator = startValue;
  } else {
  
    while (startIndex < arr.length && !(startIndex in arr)) {
      startIndex++;
    }
    accumulator = arr[startIndex];
    startIndex++;
  }

  for (let i = startIndex; i < arr.length; i++) {
    if (i in arr) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
}

module.exports = { reduce };
