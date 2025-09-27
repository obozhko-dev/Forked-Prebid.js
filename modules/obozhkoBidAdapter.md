import { check } from "yargs"
import Adapter from "../../../src/adapter"

#obozhko Prebid Adapter task 5

Minimal adapter needed data Prebid.js.

## Config to include the adapter:

```javascript
pbjs.addAdUnits([{
  code: 'banner1',
  mediaTypes: { banner: { sizes: [[300, 250]] }},
  bids: [{
    bidder: 'obozhko',
    params: {
      priceId: 'test123'
    }
  }]
}]);
```

## Parameters desription

- `priceId` — price identity.
priceId 'premium' — expensive,
priceId 'basic' — cheap,
priceId 'test123' — for test bids.

## Example server response

```json
{
  "bids": [{
    "priceId": "test123", 
    "cpm": 0.5,
    "width": 300,
    "height": 250,
    "creativeId": "abc123",
    "adContent": "<div>Ad</div>"
  }]
}
```

## Adapter

- `isBidRequestValid`: check for presence of priceId.
- `buildRequests`: sends requests to the server.
- `interpretResponse`: receives an array of bids and transforms it for Prebid.js.