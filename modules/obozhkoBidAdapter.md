# Obozhko Bid Adapter

This Prebid adapter allows connecting server-side creative delivery from your own backend (e.g., Fastify/FastAPI/Node.js) to Prebid.js.

## Overview

- **Bidder code:** `obozhko`
- **Ad type:** Banner
- **Endpoint:** `POST http://localhost:3000/ads/bid`

## Parameters

- `anonId` — unique anonymous user identifier (retrieved from localStorage or cookies)
- `geo` — geotargeting (optional)

## Usage Example

```javascript
pbjs.addAdUnits([{
  code: 'ad-slot-1',
  sizes: [[728, 90]],
  bids: [{
    bidder: 'obozhko',
    params: {
      anonId: localStorage.getItem('anonId'),
      geo: 'UA'
    }
  }]
}]);
```

## Backend Response Should Include:

- `requestId`
- `creativeId`
- `adType`
- `width`
- `height`
- `cpm`
- `creativeUrl` or `adContent`
- `currency`
- `ttl`
- (optional) `meta`

## License

MIT