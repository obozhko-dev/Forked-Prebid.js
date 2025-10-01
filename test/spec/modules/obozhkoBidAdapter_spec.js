import { expect } from 'chai';
import { spec } from '../../../modules/obozhkoBidAdapter.js';

describe('obozhko Bid Adapter', function () {
  const bid = {
    adUnitCode: 'ad-slot-1',
    bidder: 'obozhko',
    sizes: [[728, 90]],
    params: { anonId: 'test-uuid', geo: 'UA' }
  };

  it('should validate bid request', function () {
    expect(spec.isBidRequestValid(bid)).to.be.true;
    expect(spec.isBidRequestValid({})).to.be.false;
  });

  it('should build request correctly', function () {
    const req = spec.buildRequests([bid], { refererInfo: { page: 'https://test.com' } });
    expect(req.method).to.equal('POST');
    expect(req.url).to.contain('/bid');
    expect(req.data.anonId).to.equal('test-uuid');
    expect(req.data.sizes).to.deep.equal([[728, 90]]);
  });

  it('should interpret server response correctly', function () {
    const serverResponse = {
      body: {
        requestId: 'ad-slot-1',
        cpm: 1.23,
        width: 728,
        height: 90,
        creativeId: 'abc123',
        currency: 'USD',
        adContent: '<img src="test.jpg">',
        ttl: 300
      }
    };
    const bids = spec.interpretResponse(serverResponse, {});
    expect(bids).to.be.an('array').that.is.not.empty;
    expect(bids[0].requestId).to.equal('ad-slot-1');
    expect(bids[0].cpm).to.equal(1.23);
    expect(bids[0].currency).to.equal('USD');
    expect(bids[0].ttl).to.equal(300);
  });

  it('should return empty array on nobid', function () {
    const serverResponse = { body: { requestId: 'ad-slot-1', nobid: true } };
    const bids = spec.interpretResponse(serverResponse, {});
    expect(bids).to.be.an('array').that.is.empty;
  });
});
