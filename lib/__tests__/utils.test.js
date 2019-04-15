const { uniqueCount, uniqueCountObjects } = require('../utils');

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
