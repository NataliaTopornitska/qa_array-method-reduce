'use strict';

const { reduce } = require('./reduce');

describe('reduce', () => {
  beforeAll(() => {
    Array.prototype.reduce2 = reduce;
  });

  afterAll(() => {
    delete Array.prototype.reduce2;
  });

  let callback;

  beforeEach(() => {
    callback = jest.fn().mockImplementation((a, b) => a + b);
  });

  it('should be declared', () => {
    expect(reduce).toBeInstanceOf(Function);
  });

  it('should not mutate array', () => {
    const array = [1, 2, 3, 4];
    const original = array.slice();

    array.reduce2(callback, 0);

    expect(array).toEqual(original);
  });

  it('should run callback array`s length times if initialValue is provided', () => {
    const array = [1, 2, 3, 4];
    array.reduce2(callback, 0);
    expect(callback).toHaveBeenCalledTimes(array.length);
  });

  it('should run callback array`s length - 1 times if no initialValue', () => {
    const array = [1, 2, 3, 4];
    array.reduce2(callback);
    expect(callback).toHaveBeenCalledTimes(array.length - 1);
  });

  it('should throw TypeError if array is empty and no initialValue', () => {
    expect(() => [].reduce2(callback)).toThrow(TypeError);
  });

  it('should run callback with correct arguments when initialValue is provided', () => {
    const array = [1, 2, 3, 4];
    array.reduce2(callback, 0);
    expect(callback).toHaveBeenNthCalledWith(1, 0, 1, 0, array);
    expect(callback).toHaveBeenNthCalledWith(2, 1, 2, 1, array);
    expect(callback).toHaveBeenNthCalledWith(3, 3, 3, 2, array);
    expect(callback).toHaveBeenNthCalledWith(4, 6, 4, 3, array);
  });

  it('should pass correct arguments when no initialValue', () => {
    const array = [10, 20, 30];
    array.reduce2(callback);
    expect(callback).toHaveBeenNthCalledWith(1, 10, 20, 1, array);
    expect(callback).toHaveBeenNthCalledWith(2, 30, 30, 2, array);
  });

  it('should return initial value if array is empty and initialValue is provided', () => {
    const array = [];
    const initialValue = 0;
    const result = array.reduce2(callback, initialValue);
    expect(result).toBe(initialValue);
    expect(callback).not.toHaveBeenCalled();
  });

  // ----- Extra edge cases -----
  it('should skip empty slots in sparse arrays', () => {
    const array = [1, , 3];
    const result = array.reduce2((acc, cur) => acc + cur, 0);
    expect(result).toBe(4);
  });

  it('should include undefined and null elements', () => {
    const array = [1, undefined, null, 2];
    const result = array.reduce2((acc, cur) => acc.concat([cur]), []);
    expect(result).toEqual([1, undefined, null, 2]);
  });

  it('should return the only element if single-element array without initialValue', () => {
    const array = [42];
    const result = array.reduce2(callback);
    expect(result).toBe(42);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should run callback once for single-element array with initialValue', () => {
    const array = [42];
    array.reduce2(callback, 10);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(10, 42, 0, array);
  });

  it('should handle element addition during iteration', () => {
    const array = [1, 2, 3];
    const result = array.reduce2((acc, cur, i, arr) => {
      if (i === 0) arr.push(4);
      return acc + cur;
    }, 0);
    expect(result).toBe(10);
  });

  it('should skip deleted unvisited indices', () => {
    const array = [1, 2, 3];
    const result = array.reduce2((acc, cur, i, arr) => {
      if (i === 0) arr.pop();
      return acc;
    }, 0);
    expect(result).toBe(3);
  });

  it('should process elements strictly left-to-right', () => {
    const array = [1, 2, 3];
    const seen = [];
    array.reduce2((acc, cur, i) => {
      seen.push([i, cur]);
      return acc;
    }, 0);
    expect(seen).toEqual([[0, 1], [1, 2], [2, 3]]);
  });

  it('should work with string concatenation', () => {
    const array = ['a', 'b', 'c'];
    const result = array.reduce2((acc, cur) => acc + cur, '');
    expect(result).toBe('abc');
  });

  it('should work with objects as accumulator', () => {
    const array = ['x', 'y'];
    const result = array.reduce2((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});
    expect(result).toEqual({ 0: 'x', 1: 'y' });
  });
});
