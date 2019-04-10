const {
  sortObject,
  isEquivalent,
  uniqueCount,
  uniqueCountObjects,
} = require('../utils');

describe('sortObject', () => {
  it('should be a function', () => {
    expect(sortObject).toBeInstanceOf(Function);
  });
  const objA = {
    date: 1,
  };
  const objB = {
    date: 2,
  };
  it('should return 1 on sortObject(a,b)', () => {
    expect(sortObject(objA, objB)).toBe(1);
  });
  it('should return -1 on sortObject(b,a)', () => {
    expect(sortObject(objB, objA)).toBe(-1);
  });
  it('should return 0 on sortObject(a,a)', () => {
    expect(sortObject(objA, objA)).toBe(0);
  });
});

describe('isEquivalent', () => {
  it('should be a function', () => {
    expect(isEquivalent).toBeInstanceOf(Function);
  });
  const objA = {
    date: 1,
  };
  const objB = {
    date: 2,
  };
  const objC = {
    date: 1,
    other: '',
  };
  it('should return false on isEquivalent(a,b)', () => {
    expect(isEquivalent(objA, objB)).toBe(false);
  });
  it('should return false on isEquivalent(a,b)', () => {
    expect(isEquivalent(objA, objC)).toBe(false);
  });
  it('should return true on isEquivalent(a,a)', () => {
    expect(isEquivalent(objA, objA)).toBe(true);
  });
});

describe('uniqueCount', () => {
  it('should be a function', () => {
    expect(uniqueCount).toBeInstanceOf(Function);
  });
});

describe('uniqueCountObjects', () => {
  it('should be a function', () => {
    expect(uniqueCountObjects).toBeInstanceOf(Function);
  });
});
