import { registerBidder } from '../src/adapters/bidderFactory.js';

import { BANNER } from '../src/mediaTypes.js';

// const AUCTION_PATH = 'https://prebid.obozhko.ua/auction';
const BIDDER_CODE = 'obozhko';
const AUCTION_PATH = 'http://localhost:3000/ads/bid';

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],

  isBidRequestValid: function(bid) {
    return !!bid.params && !!bid.params.anonId && !!bid.sizes;
  },

  buildRequests: function(validBidRequests, bidderRequest) {
    const sizes = validBidRequests[0].sizes || [];
    const anonId = validBidRequests[0].params.anonId;
    const geo = validBidRequests[0].params.geo;

    return {
      method: 'POST',
      url: AUCTION_PATH,
      data: {
        anonId: anonId,
        adUnitCode: validBidRequests[0].adUnitCode,
        sizes: sizes,
        pageUrl: bidderRequest.refererInfo?.page || '',
        userAgent: navigator.userAgent,
        geo: geo,
      }
    };
  },

  interpretResponse: function(serverResponse, request) {
    const resp = serverResponse.body;
    if (resp && resp.nobid) return [];

    return [{
      requestId: resp.requestId,
      cpm: resp.cpm,
      width: resp.width,
      height: resp.height,
      creativeId: resp.creativeId,
      currency: resp.currency,
      ad: resp.adContent,
      ttl: resp.ttl,
      meta: resp.meta || {},
      netRevenue: true,
    }];
  }
};

registerBidder(spec);
