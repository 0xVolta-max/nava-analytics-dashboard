const { chromium } = require('playwright');

async function comprehensiveAltchaDebug() {
  console.log('🔍 Starting comprehensive Altcha debug using context7 + BMAD + Sequential Thinking...\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-csp']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    bypassCSP: true
  });

  const page = await context.newPage();

  // Enhanced monitoring for all diagnostic data
  const diagnostics = {
    errors: [],
    warnings: [],
    network: [],
    console: [],
    performance: [],
    csp: [],
    cors: [],
    altcha: {
      scriptLoaded: false,
      webComponentRegistered: false,
      challengeRequested: false,
      widgetRendered: false,
      initializationAttempts: 0
    }
  };

  // Console monitoring
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();

    if (type === 'error') {
      diagnostics.errors.push({
        type: 'console_error',
        message: text,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'warning') {
      diagnostics.warnings.push({
        type: 'console_warning',
        message: text,
        timestamp: new Date().toISOString()
      });
    } else {
      diagnostics.console.push({
        type: `console_${type}`,
        message: text,
        timestamp: new Date().toISOString()
      });
    }

    // Altcha-specific logging
    if (text.includes('Altcha')) {
      diagnostics.altcha.initializationAttempts++;
      if (text.includes('script loaded successfully')) {
        diagnostics.altcha.scriptLoaded = true;
      }
      if (text.includes('component registered successfully')) {
        diagnostics.altcha.webComponentRegistered = true;
      }
    }
  });

  // Network monitoring
  page.on('request', (request) => {
    const url = request.url();
    diagnostics.network.push({
      type: 'request',
      url: url,
      method: request.method(),
      timestamp: new Date().toISOString()
    });

    if (url.includes('altcha-challenge')) {
      diagnostics.altcha.challengeRequested = true;
    }
  });

  page.on('response', (response) => {
    const url = response.url();
    const status = response.status();
    diagnostics.network.push({
      type: 'response',
      url: url,
      status: status,
      timestamp: new Date().toISOString()
    });

    // Check for redirects
    if (status >= 300 && status < 400) {
      diagnostics.warnings.push({
        type: 'redirect_detected',
        message: `Redirect detected: ${url} -> ${status}`,
        timestamp: new Date().toISOString()
      });
    }
  });

  try {
    console.log('🌐 Step 1: Environment Verification\n');

    // Test 1: Load the login page
    console.log('📄 Test 1.1: Loading login page...');
    await page.goto('http://localhost:8083/login', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Test 2: Check CSP and security headers
    console.log('📄 Test 1.2: Checking CSP and security policies...');
    const cspHeaders = await page.evaluate(() => {
      const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return {
        hasMetaCSP: !!metaCSP,
        metaCSP: metaCSP?.getAttribute('content'),
        hasCSPHeaders: false // Can't check response headers from client-side
      };
    });

    console.log('🔒 CSP Analysis:', cspHeaders);

    // Test 3: Check CORS configuration
    console.log('📄 Test 1.3: Testing CORS and API endpoints...');
    const apiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/altcha-challenge', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const corsHeaders = {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
          'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
          'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
        };

        return {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          corsHeaders,
          contentType: response.headers.get('content-type'),
          body: await response.text().catch(() => 'Unable to read body')
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          type: error.constructor.name
        };
      }
    });

    console.log('🔗 API Test Results:', apiTest);

    // Test 4: Check for Service Worker
    console.log('📄 Test 1.4: Checking for Service Worker interference...');
    const swInfo = await page.evaluate(() => {
      return {
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerState: navigator.serviceWorker?.controller?.state || 'none'
      };
    });

    console.log('⚙️ Service Worker Status:', swInfo);

    console.log('\n🧠 Step 2: Widget Initialization Analysis\n');

    // Test 5: Monitor Altcha widget initialization
    console.log('📄 Test 2.1: Monitoring Altcha widget initialization...');

    const widgetAnalysis = await page.evaluate(() => {
      return new Promise((resolve) => {
        const results = {
          altchaScriptExists: false,
          altchaWebComponentRegistered: false,
          altchaElements: [],
          altchaContainerExists: false,
          loadingAnimationVisible: false,
          initializationEvents: []
        };

        // Check for script
        const altchaScripts = Array.from(document.querySelectorAll('script')).filter(s =>
          s.src.includes('altcha') || s.textContent?.includes('altcha')
        );
        results.altchaScriptExists = altchaScripts.length > 0;

        // Check for web component registration
        results.altchaWebComponentRegistered = !!customElements.get('altcha-widget');

        // Check for altcha elements
        results.altchaElements = Array.from(document.querySelectorAll('[class*="altcha"]')).map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          textContent: el.textContent?.trim().substring(0, 100) || '',
          attributes: Array.from(el.attributes).map(attr => ({ name: attr.name, value: attr.value }))
        }));

        // Check for container
        results.altchaContainerExists = !!document.querySelector('.altcha-container');

        // Check for loading animation
        const loadingElement = document.querySelector('.altcha-container .animate-spin');
        results.loadingAnimationVisible = !!loadingElement;

        // Monitor for changes
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              const addedAltcha = Array.from(mutation.addedNodes).find(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.tagName === 'ALTCHA-WIDGET' ||
                 node.classList?.contains('altcha') ||
                 node.textContent?.includes('altcha'))
              );

              if (addedAltcha) {
                results.initializationEvents.push({
                  type: 'element_added',
                  tagName: addedAltcha.tagName,
                  className: addedAltcha.className,
                  timestamp: new Date().toISOString()
                });
              }
            }
          });
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        // Wait for potential initialization
        setTimeout(() => {
          observer.disconnect();
          resolve(results);
        }, 5000);
      });
    });

    console.log('🤖 Widget Analysis:', widgetAnalysis);

    console.log('\n🔍 Step 3: Network Analysis\n');

    // Test 6: Monitor network activity during widget initialization
    console.log('📄 Test 3.1: Analyzing network requests...');

    const networkAnalysis = diagnostics.network.filter(req =>
      req.url.includes('altcha') ||
      req.url.includes('challenge') ||
      req.method === 'POST'
    );

    console.log('📡 Altcha-related network requests:', networkAnalysis);

    console.log('\n⚡ Step 4: React Lifecycle Investigation\n');

    // Test 7: Check for React strict mode issues
    console.log('📄 Test 4.1: Checking React development mode...');

    const reactAnalysis = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        isReactApp: !!root && root.hasAttribute('data-reactroot'),
        reactVersion: window.React?.version || 'unknown',
        hasStrictMode: document.querySelector('[data-strictmode]') !== null,
        componentCount: document.querySelectorAll('[data-reactroot], [data-react]').length
      };
    });

    console.log('⚛️ React Analysis:', reactAnalysis);

    // Test 8: Check for hydration issues
    console.log('📄 Test 4.2: Checking for hydration mismatches...');

    const hydrationIssues = diagnostics.console.filter(log =>
      log.message.includes('hydration') ||
      log.message.includes('Hydration') ||
      log.message.includes('Expected server HTML')
    );

    if (hydrationIssues.length > 0) {
      console.log('💧 Hydration Issues Found:', hydrationIssues);
    } else {
      console.log('💧 No hydration issues detected');
    }

    console.log('\n🎯 Step 5: Root Cause Analysis\n');

    // Analyze all collected data
    const rootCauseAnalysis = {
      likelyCauses: [],
      evidence: [],
      recommendations: []
    };

    // Analyze script loading
    if (!diagnostics.altcha.scriptLoaded) {
      rootCauseAnalysis.likelyCauses.push('Script Loading Failure');
      rootCauseAnalysis.evidence.push('Altcha script not loaded successfully');
      rootCauseAnalysis.recommendations.push('Check CDN URL and network connectivity');
    }

    // Analyze web component registration
    if (!diagnostics.altcha.webComponentRegistered) {
      rootCauseAnalysis.likelyCauses.push('Web Component Registration Failure');
      rootCauseAnalysis.evidence.push('altcha-widget custom element not registered');
      rootCauseAnalysis.recommendations.push('Verify Altcha script loads and executes properly');
    }

    // Analyze network issues
    const redirectRequests = diagnostics.network.filter(req =>
      req.status >= 300 && req.status < 400
    );

    if (redirectRequests.length > 0) {
      rootCauseAnalysis.likelyCauses.push('Redirect Loop Detected');
      rootCauseAnalysis.evidence.push(`${redirectRequests.length} redirect responses found`);
      rootCauseAnalysis.recommendations.push('Check authentication middleware and redirect logic');
    }

    // Analyze CSP issues
    const cspErrors = diagnostics.errors.filter(err =>
      err.message.includes('CSP') ||
      err.message.includes('Content Security Policy')
    );

    if (cspErrors.length > 0) {
      rootCauseAnalysis.likelyCauses.push('CSP Blocking Resources');
      rootCauseAnalysis.evidence.push(`${cspErrors.length} CSP-related errors`);
      rootCauseAnalysis.recommendations.push('Update CSP to allow Altcha scripts and connections');
    }

    // Analyze CORS issues
    const corsErrors = diagnostics.errors.filter(err =>
      err.message.includes('CORS') ||
      err.message.includes('Cross-Origin')
    );

    if (corsErrors.length > 0) {
      rootCauseAnalysis.likelyCauses.push('CORS Policy Blocking');
      rootCauseAnalysis.evidence.push(`${corsErrors.length} CORS-related errors`);
      rootCauseAnalysis.recommendations.push('Configure CORS headers for Altcha endpoints');
    }

    console.log('🎯 Root Cause Analysis:');
    console.log('   Likely Causes:', rootCauseAnalysis.likelyCauses);
    console.log('   Evidence:', rootCauseAnalysis.evidence);
    console.log('   Recommendations:', rootCauseAnalysis.recommendations);

  } catch (error) {
    console.error('❌ Diagnostic test failed:', error);
    diagnostics.errors.push({
      type: 'test_error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  } finally {
    await browser.close();
  }

  // Generate comprehensive diagnostic report
  console.log('\n' + '='.repeat(80));
  console.log('📋 COMPREHENSIVE ALTCHA DIAGNOSTIC REPORT');
  console.log('='.repeat(80));

  console.log(`\n❌ Errors Found: ${diagnostics.errors.length}`);
  diagnostics.errors.slice(0, 10).forEach((error, index) => {
    console.log(`   ${index + 1}. [${error.type}] ${error.message}`);
  });

  console.log(`\n⚠️  Warnings Found: ${diagnostics.warnings.length}`);
  diagnostics.warnings.slice(0, 10).forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning.message}`);
  });

  console.log(`\n🔗 Altcha Network Requests: ${diagnostics.network.filter(r => r.url.includes('altcha')).length}`);
  console.log(`\n🤖 Altcha Status:`);
  console.log(`   Script Loaded: ${diagnostics.altcha.scriptLoaded}`);
  console.log(`   Web Component Registered: ${diagnostics.altcha.webComponentRegistered}`);
  console.log(`   Challenge Requested: ${diagnostics.altcha.challengeRequested}`);
  console.log(`   Initialization Attempts: ${diagnostics.altcha.initializationAttempts}`);

  console.log('\n' + '='.repeat(80));

  // Provide actionable insights
  console.log('\n💡 DIAGNOSTIC INSIGHTS:');
  console.log('   1. Focus on web component registration first');
  console.log('   2. Check if Altcha script is loading without ES module errors');
  console.log('   3. Verify CSP policies allow Altcha resources');
  console.log('   4. Ensure no redirect loops in authentication middleware');
  console.log('   5. Test with CSP disabled to isolate the issue');

  console.log('\n🎉 Altcha diagnostic completed!');

  return diagnostics;
}

// Run the comprehensive diagnostic
comprehensiveAltchaDebug().catch(console.error);
