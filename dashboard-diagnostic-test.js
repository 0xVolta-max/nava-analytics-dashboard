const { chromium } = require('playwright');

async function comprehensiveDashboardDiagnostic() {
  console.log('🔍 Starting comprehensive dashboard diagnostic...\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  // Collect all diagnostic data
  const diagnostics = {
    errors: [],
    warnings: [],
    networkRequests: [],
    consoleLogs: [],
    screenshots: [],
    performance: {}
  };

  // Enhanced error and console monitoring
  page.on('pageerror', (error) => {
    diagnostics.errors.push({
      type: 'pageerror',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

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
      diagnostics.consoleLogs.push({
        type: `console_${type}`,
        message: text,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Network monitoring
  page.on('request', (request) => {
    diagnostics.networkRequests.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString()
    });
  });

  page.on('response', (response) => {
    diagnostics.networkRequests.push({
      type: 'response',
      url: response.url(),
      status: response.status(),
      timestamp: new Date().toISOString()
    });
  });

  try {
    console.log('🌐 Testing dashboard loading...');

    // Test 1: Load dashboard directly
    console.log('📄 Test 1: Loading dashboard page...');
    const startTime = Date.now();

    await page.goto('http://localhost:8083/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;
    diagnostics.performance.dashboardLoadTime = loadTime;

    console.log(`✅ Dashboard loaded in ${loadTime}ms`);

    // Check if dashboard content loaded
    const hasDashboardContent = await page.locator('[data-testid="dashboard"], .dashboard, main, #root:has(*)').count() > 0;
    console.log(`📊 Dashboard content detected: ${hasDashboardContent}`);

    // Take screenshot of dashboard
    await page.screenshot({
      path: 'dashboard-diagnostic-main.png',
      fullPage: true
    });
    diagnostics.screenshots.push('dashboard-diagnostic-main.png');

    // Test 2: Check for empty screen indicators
    console.log('\n📄 Test 2: Checking for empty screen issues...');

    const isEmptyScreen = await page.evaluate(() => {
      const root = document.getElementById('root');
      if (!root) return 'NO_ROOT';

      const content = root.textContent?.trim();
      if (!content) return 'EMPTY_ROOT';

      if (content.includes('Loading application...')) return 'LOADING_SCREEN';
      if (content.includes('Something went wrong')) return 'ERROR_BOUNDARY';
      if (content.includes('Bot verification failed')) return 'ALTCHA_ERROR';

      return 'HAS_CONTENT';
    });

    console.log(`📊 Dashboard state: ${isEmptyScreen}`);

    // Test 3: Check authentication state
    console.log('\n📄 Test 3: Checking authentication state...');

    const authState = await page.evaluate(() => {
      // Check for login form
      const hasLoginForm = document.querySelector('form') !== null;
      const hasLoginButton = document.querySelector('button[type="submit"]') !== null;
      const hasEmailInput = document.querySelector('input[type="email"]') !== null;

      // Check for dashboard elements
      const hasDashboardElements = document.querySelector('[data-testid="dashboard"], .metric-card, .chart, .dashboard-header') !== null;

      return {
        hasLoginForm,
        hasLoginButton,
        hasEmailInput,
        hasDashboardElements,
        currentURL: window.location.href
      };
    });

    console.log('🔐 Authentication state:', authState);

    // Test 4: Check Altcha widget
    console.log('\n📄 Test 4: Checking Altcha widget...');

    const altchaState = await page.evaluate(() => {
      const altchaContainer = document.querySelector('.altcha-container');
      const altchaWidget = document.querySelector('.altcha-widget');
      const altchaElement = document.querySelector('altcha-widget');

      return {
        hasAltchaContainer: !!altchaContainer,
        hasAltchaWidget: !!altchaWidget,
        hasAltchaElement: !!altchaElement,
        altchaContent: altchaElement?.textContent?.trim() || '',
        altchaAttributes: altchaElement ? Array.from(altchaElement.attributes).map(attr => ({ name: attr.name, value: attr.value })) : []
      };
    });

    console.log('🤖 Altcha widget state:', altchaState);

    // Test 5: Test navigation to login
    console.log('\n📄 Test 5: Testing login page navigation...');

    await page.goto('http://localhost:8083/login', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    const loginState = await page.evaluate(() => {
      const hasLoginForm = document.querySelector('form') !== null;
      const hasEmailInput = document.querySelector('input[type="email"]') !== null;
      const hasPasswordInput = document.querySelector('input[type="password"]') !== null;
      const hasSubmitButton = document.querySelector('button[type="submit"]') !== null;
      const hasAltcha = document.querySelector('.altcha-container') !== null;

      return {
        hasLoginForm,
        hasEmailInput,
        hasPasswordInput,
        hasSubmitButton,
        hasAltcha,
        currentURL: window.location.href
      };
    });

    console.log('🔑 Login page state:', loginState);

    // Take login page screenshot
    await page.screenshot({
      path: 'dashboard-diagnostic-login.png',
      fullPage: true
    });
    diagnostics.screenshots.push('dashboard-diagnostic-login.png');

    // Test 6: Test API endpoints
    console.log('\n📄 Test 6: Testing API endpoints...');

    const apiTests = [];

    // Test Altcha challenge API
    try {
      const challengeResponse = await page.request.get('http://localhost:8083/api/altcha-challenge');
      apiTests.push({
        endpoint: '/api/altcha-challenge',
        status: challengeResponse.status(),
        success: challengeResponse.ok()
      });
    } catch (error) {
      apiTests.push({
        endpoint: '/api/altcha-challenge',
        status: 'ERROR',
        success: false,
        error: error.message
      });
    }

    console.log('🔗 API test results:', apiTests);

    // Test 7: Performance metrics
    console.log('\n📄 Test 7: Performance analysis...');

    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');

      return {
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        totalResources: resources.length,
        failedResources: resources.filter(r => r.responseStatus >= 400).length
      };
    });

    console.log('⚡ Performance metrics:', performanceMetrics);
    diagnostics.performance = { ...diagnostics.performance, ...performanceMetrics };

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

  // Generate comprehensive report
  console.log('\n' + '='.repeat(60));
  console.log('📋 COMPREHENSIVE DIAGNOSTIC REPORT');
  console.log('='.repeat(60));

  console.log(`\n❌ Errors Found: ${diagnostics.errors.length}`);
  diagnostics.errors.forEach((error, index) => {
    console.log(`   ${index + 1}. [${error.type}] ${error.message}`);
  });

  console.log(`\n⚠️  Warnings Found: ${diagnostics.warnings.length}`);
  diagnostics.warnings.slice(0, 5).forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning.message}`);
  });

  console.log(`\n🔗 Network Requests: ${diagnostics.networkRequests.filter(r => r.type === 'request').length}`);
  console.log(`🔗 Network Responses: ${diagnostics.networkRequests.filter(r => r.type === 'response').length}`);

  console.log(`\n📸 Screenshots Taken: ${diagnostics.screenshots.length}`);
  diagnostics.screenshots.forEach(screenshot => {
    console.log(`   ✅ ${screenshot}`);
  });

  console.log(`\n⚡ Performance Metrics:`);
  Object.entries(diagnostics.performance).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}ms`);
  });

  console.log('\n' + '='.repeat(60));

  // Summary and recommendations
  const hasCriticalIssues = diagnostics.errors.length > 0;
  const hasPerformanceIssues = diagnostics.performance.dashboardLoadTime > 5000;

  if (hasCriticalIssues) {
    console.log('🚨 CRITICAL ISSUES DETECTED - REQUIRES IMMEDIATE ATTENTION');
    console.log('📝 Most common errors:');
    const errorTypes = diagnostics.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count} occurrences`);
    });
  } else {
    console.log('✅ NO CRITICAL ISSUES DETECTED');
  }

  if (hasPerformanceIssues) {
    console.log('⚡ PERFORMANCE ISSUES DETECTED');
    console.log(`   Dashboard load time: ${diagnostics.performance.dashboardLoadTime}ms (should be < 5000ms)`);
  }

  console.log('\n🎉 Diagnostic test completed!');
  console.log('📊 Check the screenshots and console logs for detailed analysis.');
}

// Run the diagnostic
comprehensiveDashboardDiagnostic().catch(console.error);
