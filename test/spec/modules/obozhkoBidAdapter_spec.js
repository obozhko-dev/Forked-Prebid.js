import { expect } from 'chai';
import { spec } from '../../../modules/obozhkoBidAdapter.js';

describe('obozhko Bid Adapter', function () {
  const bid1 = {
    adUnitCode: 'ad-slot-1',
    bidder: 'obozhko',
    sizes: [[728, 90]],
    params: { anonId: 'test-uuid', geo: 'UA' },
    bidId: 'bid-id-1'
  };
  const bid2 = {
    adUnitCode: 'ad-slot-2',
    bidder: 'obozhko',
    sizes: [[300, 250]],
    params: { anonId: 'test-uuid2', geo: 'UA' },
    bidId: 'bid-id-2'
  };
  const bidderRequest = { refererInfo: { page: 'https://test.com' } };

  it('should validate bid request', function () {
    expect(spec.isBidRequestValid(bid1)).to.be.true;
    expect(spec.isBidRequestValid({})).to.be.false;
  });

  it('should build requests as array (one per slot)', function () {
    const reqs = spec.buildRequests([bid1, bid2], bidderRequest);
    expect(reqs).to.be.an('array').with.lengthOf(2);

    const reqA = reqs[0];
    expect(reqA.method).to.equal('POST');
    expect(reqA.url).to.contain('/ads/bid');
    expect(reqA.data.anonId).to.equal('test-uuid');
    expect(reqA.data.sizes).to.deep.equal([[728, 90]]);
    expect(reqA.data.bidId).to.equal('bid-id-1');

    const reqB = reqs[1];
    expect(reqB.data.anonId).to.equal('test-uuid2');
    expect(reqB.data.sizes).to.deep.equal([[300, 250]]);
    expect(reqB.data.bidId).to.equal('bid-id-2');
  });

  it('should interpret server response correctly', function () {
    const serverResponse = {
      body: {
        requestId: 'bid-id-1',
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
    expect(bids[0].requestId).to.equal('bid-id-1');
    expect(bids[0].cpm).to.equal(1.23);
    expect(bids[0].currency).to.equal('USD');
    expect(bids[0].ttl).to.equal(300);
    expect(bids[0].ad).to.equal('<img src="test.jpg">');
  });

  it('should return empty array on nobid', function () {
    const serverResponse = { body: { requestId: 'bid-id-1', nobid: true } };
    const bids = spec.interpretResponse(serverResponse, {});
    expect(bids).to.be.an('array').that.is.empty;
  });
});