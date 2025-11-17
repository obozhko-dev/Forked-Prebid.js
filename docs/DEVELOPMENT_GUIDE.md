# Development Guide - Prebid.js with Custom Adapters

## 🚀 Quick Start Commands

### Development Server
```bash
# Start development server with custom adapters
npx gulp serve-e2e-dev --modules=adtelligentBidAdapter,bidmaticBidAdapter,obozhkoBidAdapter

# Alternative: Start basic development server
npx gulp serve

# Start with specific modules only
npx gulp serve --modules=obozhkoBidAdapter

# Start with debug mode
npx gulp serve --debug
```

### Testing Your Custom Adapters

#### Run All Tests
```bash
# Run complete test suite (takes 10-15+ minutes)
npm test

# Run tests with lint checking
npx gulp test

# Run tests without linting (faster if already linted)
npx gulp test --nolint
```

#### Run Specific Adapter Tests
```bash
# Test only Obozhko adapter
npx gulp test --file test/spec/modules/obozhkoBidAdapter_spec.js --nolint

# Test only Adtelligent adapter  
npx gulp test --file test/spec/modules/adtelligentBidAdapter_spec.js --nolint

# Test both custom adapters
npx gulp test --file "test/spec/modules/*BidAdapter_spec.js" --nolint

# Run tests with browser debugging
npx gulp serve-and-test --file test/spec/modules/obozhkoBidAdapter_spec.js
```

#### Lint Only Your Files
```bash
# Lint specific files to avoid full project linting
npx eslint 'modules/obozhkoBidAdapter.js' --cache --cache-strategy content
npx eslint 'test/spec/modules/obozhkoBidAdapter_spec.js' --cache --cache-strategy content

# Lint multiple files
npx eslint 'modules/*BidAdapter.js' 'test/spec/modules/*BidAdapter_spec.js' --cache --cache-strategy content
```

---

## 🏗️ Building Custom Prebid Bundle

### Production Build Commands

#### Build with Custom Adapters
```bash
# Build production bundle with your adapters
npx gulp build --modules=adtelligentBidAdapter,obozhkoBidAdapter

# Build with additional standard adapters
npx gulp build --modules=adtelligentBidAdapter,obozhkoBidAdapter,appnexusBidAdapter,rubiconBidAdapter

# Build minimal bundle (only your adapters)
npx gulp build --modules=obozhkoBidAdapter
```

#### Build Outputs
After successful build, files will be created in:
```
build/
├── prebid_disclosures.json
└── dev/
    ├── prebid.js              # Development build (readable)
    ├── prebid.min.js          # Production build (minified)
    └── prebid.min.js.map      # Source maps for debugging
```

### Custom Build Configuration

#### Create Build Config File
Create `buildConfig.json` in project root:
```json
{
  "modules": [
    "adtelligentBidAdapter",
    "obozhkoBidAdapter"
  ],
  "analytics": [],
  "libraries": [
    "adtelligentUtils"
  ]
}
```

#### Use Config File for Build
```bash
# Build using config file
npx gulp build --file buildConfig.json

# Alternative: specify modules directly
npx gulp build --modules=$(cat buildConfig.json | jq -r '.modules | join(",")')
```

---

## 🧪 Development Workflow

### Step 1: Code Changes
1. **Edit Adapter:** Modify `modules/obozhkoBidAdapter.js`
2. **Update Tests:** Modify `test/spec/modules/obozhkoBidAdapter_spec.js`

### Step 2: Lint Your Changes
```bash
# Lint only changed files
npx eslint 'modules/obozhkoBidAdapter.js' 'test/spec/modules/obozhkoBidAdapter_spec.js' --cache --cache-strategy content

# Auto-fix common issues
npx eslint 'modules/obozhkoBidAdapter.js' --fix --cache --cache-strategy content
```

### Step 3: Test Your Changes
```bash
# Quick test of your specific adapter
npx gulp test --file test/spec/modules/obozhkoBidAdapter_spec.js --nolint

# Test with development server
npx gulp serve-and-test --file test/spec/modules/obozhkoBidAdapter_spec.js
```

### Step 4: Integration Testing
```bash
# Start development server with your adapters
npx gulp serve-e2e-dev --modules=adtelligentBidAdapter,obozhkoBidAdapter

# Open browser to: http://localhost:9999/integrationExamples/gpt/hello_world.html
# Test your adapters in real environment
```

### Step 5: Build Verification
```bash
# Build production bundle
npx gulp build --modules=adtelligentBidAdapter,obozhkoBidAdapter

# Verify build size and content
ls -la build/dev/prebid.min.js
```

---

## 📦 Integration Examples

### Basic HTML Integration
```html
<!DOCTYPE html>
<html>
<head>
    <script src="./build/dev/prebid.js"></script>
    <script>
        // Configure Prebid
        pbjs.que.push(function() {
            pbjs.addAdUnits([{
                code: 'ad-slot-1',
                sizes: [[728, 90]],
                bids: [{
                    bidder: 'obozhko',
                    params: {
                        anonId: 'user-12345',
                        geo: 'UA'
                    }
                }, {
                    bidder: 'adtelligent',
                    params: {
                        aid: 12345
                    }
                }]
            }]);
            
            pbjs.requestBids({
                timeout: 1000,
                bidsBackHandler: function() {
                    // Handle auction completion
                }
            });
        });
    </script>
</head>
<body>
    <div id="ad-slot-1"></div>
</body>
</html>
```

### Test Your Local Backend
```javascript
// Make sure your backend is running on localhost:3000
// Test endpoint: POST http://localhost:3000/ads/bid

// Sample test request:
fetch('http://localhost:3000/ads/bid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        anonId: 'test-user-123',
        adUnitCode: 'test-banner',
        sizes: [[728, 90]],
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        geo: 'UA',
        bidId: 'test-bid-' + Date.now()
    })
}).then(r => r.json()).then(console.log);
```

---

## 🔧 Advanced Build Options

### Environment-Specific Builds

#### Development Build (with debugging)
```bash
# Development build with source maps and debugging
npx gulp build --modules=obozhkoBidAdapter --debug

# Development build with analytics
npx gulp build --modules=obozhkoBidAdapter --analytics=ga,freewheel
```

#### Production Build (optimized)
```bash
# Production build (minified, optimized)
npx gulp build --modules=obozhkoBidAdapter --minify

# Production build with specific target browsers
npx gulp build --modules=obozhkoBidAdapter --browsers="> 1%, last 2 versions"
```

### Bundle Analysis
```bash
# Analyze bundle size and dependencies
npx webpack-bundle-analyzer build/dev/prebid.js

# Generate build report
npx gulp build --modules=obozhkoBidAdapter --analyze

# Check which modules are included
grep -o "registerBidder.*" build/dev/prebid.js
```

### Custom Webpack Config
Create `webpack.custom.js`:
```javascript
const path = require('path');

module.exports = {
  entry: './src/prebid.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'custom-prebid.js',
    library: 'pbjs',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'modules'),
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  }
};
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Build Fails
```bash
# Clear cache and node_modules
rm -rf node_modules package-lock.json
npm install

# Clear Gulp cache
rm -rf .gulp-cache

# Run with verbose output
npx gulp build --modules=obozhkoBidAdapter --verbose
```

#### Tests Fail
```bash
# Run single test with debug output
npx mocha test/spec/modules/obozhkoBidAdapter_spec.js --reporter spec

# Run tests in browser for debugging
npx gulp serve-and-test --file test/spec/modules/obozhkoBidAdapter_spec.js
# Open: http://localhost:9876/debug.html
```

#### Linting Errors
```bash
# Fix common linting issues automatically
npx eslint modules/obozhkoBidAdapter.js --fix

# Check specific ESLint rules
npx eslint modules/obozhkoBidAdapter.js --format=json

# Disable specific rule for one line
// eslint-disable-next-line no-console
console.log('Debug message');
```

#### Server Won't Start
```bash
# Check if ports are available
netstat -ano | findstr :9999
netstat -ano | findstr :8080

# Kill processes on ports (Windows)
taskkill /PID <PID> /F

# Start server on different port
npx gulp serve --port 8888
```

### Debug Mode Tips
```javascript
// Enable debug mode in browser console
pbjs.setConfig({debug: true});

// Check loaded adapters
pbjs.installedModules;

// View auction results
pbjs.getBidResponses();

// Check adapter configuration
pbjs.getConfig();
```

---

## 📝 Code Quality Checklist

### Before Committing
- [ ] Lint passes: `npx eslint modules/obozhkoBidAdapter.js`
- [ ] Tests pass: `npx gulp test --file test/spec/modules/obozhkoBidAdapter_spec.js --nolint`
- [ ] Build succeeds: `npx gulp build --modules=obozhkoBidAdapter`
- [ ] Integration test works: `npx gulp serve-e2e-dev --modules=obozhkoBidAdapter`
- [ ] Documentation updated
- [ ] Example code tested

### Performance Checklist
- [ ] Bundle size reasonable: `ls -la build/dev/prebid.min.js`
- [ ] No console errors in browser
- [ ] Adapter responds within timeout (1000ms)
- [ ] Memory usage stable (no leaks)
- [ ] Network requests optimized

### Security Checklist
- [ ] Input validation implemented
- [ ] No XSS vulnerabilities
- [ ] HTTPS endpoints only
- [ ] User consent handled properly
- [ ] No sensitive data logged

---

## 🔄 Continuous Integration

### GitHub Actions Workflow
Create `.github/workflows/test-custom-adapters.yml`:
```yaml
name: Test Custom Adapters
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npx eslint modules/*BidAdapter.js test/spec/modules/*BidAdapter_spec.js
      - run: npx gulp test --file "test/spec/modules/obozhkoBidAdapter_spec.js" --nolint
      - run: npx gulp test --file "test/spec/modules/adtelligentBidAdapter_spec.js" --nolint
      - run: npx gulp build --modules=adtelligentBidAdapter,obozhkoBidAdapter
```

### Local Pre-commit Hook
Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
# Lint and test custom adapters before commit
echo "Running pre-commit checks..."

# Lint custom adapter files
npx eslint modules/obozhkoBidAdapter.js modules/adtelligentBidAdapter.js
if [ $? -ne 0 ]; then
  echo "ESLint failed. Please fix linting errors."
  exit 1
fi

# Test custom adapters
npx gulp test --file "test/spec/modules/*BidAdapter_spec.js" --nolint
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix failing tests."
  exit 1
fi

echo "Pre-commit checks passed!"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

This development guide provides comprehensive instructions for working with your custom Prebid.js adapters, from development to production deployment.