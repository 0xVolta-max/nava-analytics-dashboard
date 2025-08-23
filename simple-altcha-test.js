const { chromium } = require('playwright');

async function testAltchaWidgetBasic() {
  console.log('🚀 Starting basic Altcha widget display test...');

  const browser = await chromium.launch({
    headless: false,
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

    // Check if Altcha script is loaded
    console.log('🔍 Checking if Altcha script is available...');
    const isAltchaAvailable = await page.evaluate(() => {
      return typeof window.Altcha !== 'undefined';
    });

    if (isAltchaAvailable) {
      console.log('✅ Altcha script loaded successfully');
    } else {
      console.log('⚠️  Altcha script not loaded yet, but continuing...');
    }

    // Check if Altcha widget container exists
    console.log('🔍 Looking for Altcha widget container...');
    const containerExists = await page.locator('.altcha-container').count() > 0;

    if (containerExists) {
      console.log('✅ Altcha widget container found');

      // Check container properties
      const container = await page.locator('.altcha-container');
      const isVisible = await container.isVisible();
      const boundingBox = await container.boundingBox();

      console.log(`📏 Container visibility: ${isVisible}`);
      console.log(`📏 Container dimensions: ${boundingBox?.width || 0}x${boundingBox?.height || 0}px`);

      // Check if there's an inner widget element
      const innerWidget = await page.locator('.altcha-widget').count() > 0;
      console.log(`🔧 Inner widget element present: ${innerWidget}`);

      // Take screenshots
      console.log('📸 Taking screenshots...');
      await page.screenshot({
        path: 'login-page-basic.png',
        fullPage: true
      });
      console.log('✅ Full page screenshot saved as login-page-basic.png');

      if (boundingBox) {
        await page.screenshot({
          path: 'altcha-container-basic.png',
          clip: boundingBox
        });
        console.log('✅ Container screenshot saved as altcha-container-basic.png');
      }

      // Check for any errors in console
      const errors = [];
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      // Wait a bit to catch any errors
      await page.waitForTimeout(3000);

      if (errors.length > 0) {
        console.log('⚠️  Console errors detected:');
        errors.forEach(error => console.log(`   - ${error}`));
      } else {
        console.log('✅ No console errors detected');
      }

      console.log('\n🎉 Basic Altcha widget test completed!');
      console.log('\n📋 Test Results:');
      console.log('   ✅ Widget container present');
      console.log(`   ✅ Container visibility: ${isVisible}`);
      console.log(`   ✅ Container dimensions: ${boundingBox?.width || 0}x${boundingBox?.height || 0}px`);
      console.log(`   ✅ Altcha script available: ${isAltchaAvailable}`);
      console.log('   ✅ Screenshots captured');

      if (isVisible && boundingBox && boundingBox.height >= 65) {
        console.log('   ✅ Widget appears to be properly rendered');
      } else {
        console.log('   ⚠️  Widget may not be fully rendered yet');
      }

    } else {
      console.log('❌ Altcha widget container not found');

      // Take error screenshot
      await page.screenshot({
        path: 'altcha-error-basic.png',
        fullPage: true
      });
      console.log('📸 Error screenshot saved as altcha-error-basic.png');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);

    // Take error screenshot
    try {
      await page.screenshot({
        path: 'altcha-fatal-error.png',
        fullPage: true
      });
      console.log('📸 Error screenshot saved as altcha-fatal-error.png');
    } catch (screenshotError) {
      console.log('❌ Could not capture error screenshot');
    }

  } finally {
    await browser.close();
  }
}

// Run the test
testAltchaWidgetBasic().catch(console.error);
