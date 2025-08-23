const { chromium } = require('playwright');

async function testChallengeAPI() {
  console.log('🔍 Testing Altcha Challenge API...');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    console.log('📄 Testing challenge API endpoint...');

    // Test the challenge API endpoint
    try {
      const response = await page.request.get('http://localhost:8080/api/altcha-challenge');
      const responseText = await response.text();

      console.log(`📊 API Response Status: ${response.status()}`);
      console.log(`📊 API Response Headers:`, response.headers());

      if (response.status() === 200) {
        try {
          const jsonResponse = JSON.parse(responseText);
          console.log('✅ API Response (parsed):', JSON.stringify(jsonResponse, null, 2));
        } catch (parseError) {
          console.log('📝 API Response (raw):', responseText);
        }
      } else {
        console.log('❌ API Response Error:', responseText);
      }
    } catch (apiError) {
      console.log('❌ API Request Failed:', apiError.message);
    }

    // Test if we can navigate to the login page and see the widget behavior
    console.log('📄 Testing login page with challenge API...');
    await page.goto('http://localhost:8080/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Login page loaded');

    // Wait a bit to see if any network requests are made to the challenge API
    console.log('⏳ Monitoring network requests...');

    const apiRequests = [];
    page.on('request', (request) => {
      if (request.url().includes('altcha-challenge')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString()
        });
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('altcha-challenge')) {
        apiRequests.push({
          url: response.url(),
          method: 'RESPONSE',
          status: response.status(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Wait for 5 seconds to capture any API calls
    await page.waitForTimeout(5000);

    console.log('\n📊 Challenge API Requests Made:');
    if (apiRequests.length > 0) {
      apiRequests.forEach((req, index) => {
        console.log(`   ${index + 1}. [${req.method}] ${req.url} (${req.timestamp})`);
        if (req.status) {
          console.log(`      Status: ${req.status}`);
        }
      });
    } else {
      console.log('   ❌ No challenge API requests detected');
    }

    // Check the current state of the Altcha widget
    const altchaWidget = await page.locator('.altcha-widget');
    if (await altchaWidget.count() > 0) {
      const widgetContent = await altchaWidget.textContent();
      const widgetHTML = await altchaWidget.innerHTML();

      console.log('\n🔧 Altcha Widget Status:');
      console.log(`   Content length: ${widgetContent?.length || 0} characters`);
      console.log(`   HTML length: ${widgetHTML?.length || 0} characters`);

      if (widgetHTML && widgetHTML.length > 0) {
        console.log(`   HTML preview: ${widgetHTML.substring(0, 200)}...`);
      }
    }

    // Take screenshot
    await page.screenshot({
      path: 'challenge-api-test.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved as challenge-api-test.png');

    console.log('\n🎉 Challenge API test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testChallengeAPI().catch(console.error);
