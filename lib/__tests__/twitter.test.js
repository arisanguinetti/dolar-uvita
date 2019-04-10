const { sendLatestToTwitter } = require('../twitter');

describe('sendLatestToTwitter', () => {
  it('should be a function', () => {
    expect(sendLatestToTwitter).toBeInstanceOf(Function);
  });
});
