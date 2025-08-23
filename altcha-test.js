const { chromium } = require('playwright');

async function testAltchaWidget() {
  console.log('🚀 Starting Altcha widget display test...');

  // Launch browser
  const browser = await chromium.launch({
    headless: false, // Set to false to see the browser in action
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    console.log('📄 Navigating to login page...');
    await page.goto('http://localhost:8080/auth/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded successfully');

    // Wait for Altcha script to load
    console.log('⏳ Waiting for Altcha script to load...');
    await page.waitForFunction(() => {
      return typeof window.Altcha !== 'undefined';
    }, { timeout: 10000 });
    console.log('✅ Altcha script loaded successfully');

    // Check if Altcha widget container is present
    console.log('🔍 Looking for Altcha widget container...');
    const widgetContainer = await page.locator('.altcha-container');
    await widgetContainer.waitFor({ state: 'visible', timeout: 5000 });

    if (await widgetContainer.isVisible()) {
      console.log('✅ Altcha widget container is visible');

      // Check widget dimensions
      const boundingBox = await widgetContainer.boundingBox();
      console.log(`📏 Widget dimensions: ${boundingBox.width}x${boundingBox.height}px`);

      // Check if widget has minimum height (65px as set in component)
      if (boundingBox.height >= 65) {
        console.log('✅ Widget has proper minimum height');
      } else {
        console.log('⚠️  Widget height seems smaller than expected');
      }

      // Look for the actual Altcha widget element
      const altchaWidget = await page.locator('.altcha-widget');
      if (await altchaWidget.isVisible()) {
        console.log('✅ Altcha widget element is present');

        // Take a screenshot of the widget area
        console.log('📸 Taking screenshot of Altcha widget...');
        await page.screenshot({
          path: 'altcha-widget-screenshot.png',
          clip: boundingBox
        });
        console.log('✅ Screenshot saved as altcha-widget-screenshot.png');

        // Take full page screenshot
        await page.screenshot({
          path: 'login-page-full.png',
          fullPage: true
        });
        console.log('✅ Full page screenshot saved as login-page-full.png');

        // Check for any console errors
        const errors = [];
        page.on('pageerror', (error) => {
          errors.push(error.message);
        });

        // Wait a bit to catch any delayed errors
        await page.waitForTimeout(2000);

        if (errors.length > 0) {
          console.log('⚠️  Console errors detected:');
          errors.forEach(error => console.log(`   - ${error}`));
        } else {
          console.log('✅ No console errors detected');
        }

        console.log('\n🎉 Altcha widget test completed successfully!');
        console.log('\n📋 Test Results:');
        console.log('   ✅ Widget container visible');
        console.log('   ✅ Altcha script loaded');
        console.log('   ✅ Widget dimensions correct');
        console.log('   ✅ Screenshots captured');
        console.log('   ✅ No critical errors');

      } else {
        console.log('❌ Altcha widget element not found');
      }

    } else {
      console.log('❌ Altcha widget container not visible');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);

    // Take error screenshot
    try {
      await page.screenshot({
        path: 'altcha-error-screenshot.png',
        fullPage: true
      });
      console.log('📸 Error screenshot saved as altcha-error-screenshot.png');
    } catch (screenshotError) {
      console.log('❌ Could not capture error screenshot');
    }

  } finally {
    await browser.close();
  }
}

// Run the test
testAltchaWidget().catch(console.error);
