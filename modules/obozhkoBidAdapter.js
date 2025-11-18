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
    return validBidRequests.map(bid => ({
      method: 'POST',
      url: AUCTION_PATH,
      headers: {
      'Content-Type': 'application/json'
      },
      data: {
        anonId: bid.params.anonId,
        adUnitCode: bid.adUnitCode,
        sizes: bid.sizes,
        pageUrl: bidderRequest.refererInfo?.page || '',
        userAgent: navigator.userAgent,
        geo: bid.params.geo,
        bidId: bid.bidId
      }
    }));
  },

  interpretResponse: function(serverResponse, request) {
    const resp = serverResponse.body;
    if (resp && resp.nobid) {
      console.log('obozhko adapter nobid:', resp.message || 'No creatives available');
      if (window.pbjs && window.pbjs.logMessage) {
        window.pbjs.logMessage(`Obozhko adapter: ${resp.message || 'nobid'}`);
      }
      return [];
    }

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
