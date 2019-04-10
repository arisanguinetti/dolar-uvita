const { runCron } = require('../scraper');

describe('runCron', () => {
  it('should be a function', () => {
    expect(runCron).toBeInstanceOf(Function);
  });
});
