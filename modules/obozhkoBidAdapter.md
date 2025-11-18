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

## Backend Request

Each ad slot (bid) results in a separate HTTP POST to the backend with at least:
- `anonId`
- `adUnitCode`
- `sizes`
- `pageUrl`
- `userAgent`
- `geo`
- `bidId`

## Backend Response Should Include:

- `requestId` (must match `bidId` from the POST request)
- `creativeId`
- `adType`
- `width`
- `height`
- `cpm`
- `creativeUrl` or `adContent`
- `currency`
- `ttl`
