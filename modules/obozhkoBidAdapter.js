import { registerBidder } from '../src/adapters/bidderFactory.js';
import { BANNER } from '../src/mediaTypes.js';

const AUCTION_PATH = 'https://prebid.obozhko.ua/auction';
const BIDDER_CODE = 'obozhko';

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],

  isBidRequestValid: (bid) => {
    return !!bid.params.priceId;
  },

  buildRequests: (validBidRequests) => {
    return {
      method: 'POST',
      url: AUCTION_PATH,
      data: validBidRequests.map(req => ({
        priceId: req.params.priceId,
        adUnitCode: req.adUnitCode
      }))
    };
  },

  interpretResponse: (serverResponse, bidRequest) => {
    if (!serverResponse.body) return [];
    return serverResponse.body.bids.map(bid => ({
      requestId: bidRequest.data[0].adUnitCode,
      cpm: bid.cpm,
      width: bid.width,
      height: bid.height,
      creativeId: bid.creativeId,
      currency: bid.currency || 'USD',
      ad: bid.adContent,
      ttl: 300
    }));
  }
};

registerBidder(spec);
