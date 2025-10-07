import { spec } from '../../../modules/obozhkoBidAdapter.js';

describe('obozhkoBidAdapter', () => {
  it('should validate bid request with priceId', () => {
    const bid = { params: { priceId: 'test' } };
    expect(spec.isBidRequestValid(bid)).to.be.true;
  });

  it('should not validate bid request without priceId', () => {
    const bid = { params: {} };
    expect(spec.isBidRequestValid(bid)).to.be.false;
  });

  it('should build request correctly', () => {
    const bids = [{ params: { priceId: 'test123' }, adUnitCode: 'banner1' }];
    const req = spec.buildRequests(bids);
    expect(req.method).to.equal('POST');
    expect(req.url).to.include('prebid.obozhko.ua');
    expect(req.data[0].priceId).to.equal('test123');
  });

  it('should interpret server response', () => {
    const serverResponse = {
      body: {
        bids: [{
          priceId: "test123",
          cpm: 1,
          width: 300,
          height: 250,
          creativeId: 'id1',
          adContent: '<div>ad</div>'
        }]
      }
    };
    const bidRequest = { data: [{ adUnitCode: 'banner1', priceId: 'test123' }] };
    const bids = spec.interpretResponse(serverResponse, bidRequest);
    expect(bids[0].cpm).to.equal(1);
    expect(bids[0].ad).to.include('<div>ad</div>');
  });
});
