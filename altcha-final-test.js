const { chromium } = require('playwright');

async function testAltchaWidgetFunctionality() {
  console.log('🎯 Testing Altcha widget functionality...');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    // Monitor console for errors
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    console.log('📄 Navigating to login page...');
    await page.goto('http://localhost:8080/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded successfully');

    // Wait for React to mount
    await page.waitForSelector('#root');
    console.log('✅ React app mounted');

    // Check if Altcha container exists
    console.log('🔍 Checking for Altcha container...');
    const altchaContainer = await page.locator('.altcha-container');
    await altchaContainer.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Altcha container is visible');

    // Get container dimensions
    const containerBox = await altchaContainer.boundingBox();
    console.log(`📏 Container dimensions: ${containerBox?.width}x${containerBox?.height}px`);

    // Check if container has minimum height (65px as set in component)
    if (containerBox && containerBox.height >= 65) {
      console.log('✅ Container has proper minimum height');
    } else {
      console.log('⚠️  Container height seems smaller than expected');
    }

    // Look for the inner altcha-widget element
    const altchaWidget = await page.locator('.altcha-widget');
    const widgetExists = await altchaWidget.count() > 0;

    if (widgetExists) {
      console.log('✅ Altcha widget element found');

      const widgetBox = await altchaWidget.boundingBox();
      console.log(`📏 Widget dimensions: ${widgetBox?.width}x${widgetBox?.height}px`);

      // Check if widget has content (should have Altcha UI elements)
      const widgetContent = await altchaWidget.textContent();
      console.log(`📝 Widget content length: ${widgetContent?.length || 0} characters`);

      if (widgetContent && widgetContent.length > 0) {
        console.log('✅ Widget appears to have content');
      } else {
        console.log('⚠️  Widget appears to be empty');
      }

    } else {
      console.log('❌ Altcha widget element not found');

      // Check container HTML to see what's inside
      const containerHTML = await altchaContainer.innerHTML();
      console.log(`📄 Container HTML: ${containerHTML.substring(0, 200)}...`);
    }

    // Check if Altcha script is loaded
    const altchaAvailable = await page.evaluate(() => {
      return typeof window.Altcha !== 'undefined';
    });

    if (altchaAvailable) {
      console.log('✅ Altcha script is loaded and available');
    } else {
      console.log('⚠️  Altcha script is not available');
    }

    // Take screenshots
    console.log('📸 Taking screenshots...');

    // Screenshot of the entire login form
    await page.screenshot({
      path: 'login-form-full.png',
      fullPage: true
    });
    console.log('✅ Full login form screenshot saved');

    // Screenshot focused on Altcha area
    if (containerBox) {
      await page.screenshot({
        path: 'altcha-widget-area.png',
        clip: {
          x: containerBox.x - 10,
          y: containerBox.y - 10,
          width: containerBox.width + 20,
          height: containerBox.height + 20
        }
      });
      console.log('✅ Altcha widget area screenshot saved');
    }

    // Wait a bit to see if widget initializes
    console.log('⏳ Waiting for widget to initialize...');
    await page.waitForTimeout(3000);

    // Check for any initialization indicators
    const hasInitializedContent = await page.evaluate(() => {
      const widget = document.querySelector('.altcha-widget');
      if (widget) {
        return widget.innerHTML.length > 50; // Altcha widgets typically have substantial HTML
      }
      return false;
    });

    if (hasInitializedContent) {
      console.log('✅ Altcha widget appears to be initialized');
    } else {
      console.log('⚠️  Altcha widget may not be fully initialized');
    }

    // Report any errors
    if (errors.length > 0) {
      console.log('\n❌ JavaScript errors detected:');
      errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('\n✅ No JavaScript errors detected');
    }

    console.log('\n🎉 Altcha widget functionality test completed!');

    // Summary
    console.log('\n📋 Test Summary:');
    console.log(`   ✅ Altcha container visible: ${await altchaContainer.isVisible()}`);
    console.log(`   ✅ Container proper size: ${containerBox && containerBox.height >= 65 ? 'Yes' : 'No'}`);
    console.log(`   ✅ Widget element found: ${widgetExists}`);
    console.log(`   ✅ Altcha script available: ${altchaAvailable}`);
    console.log(`   ✅ Widget initialized: ${hasInitializedContent}`);
    console.log(`   ✅ Screenshots captured: Yes`);
    console.log(`   ✅ JavaScript errors: ${errors.length === 0 ? 'None' : errors.length + ' found'}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);

    // Take error screenshot
    try {
      await page.screenshot({
        path: 'altcha-test-error.png',
        fullPage: true
      });
      console.log('📸 Error screenshot saved as altcha-test-error.png');
    } catch (screenshotError) {
      console.log('❌ Could not capture error screenshot');
    }

  } finally {
    await browser.close();
  }
}

// Run the test
testAltchaWidgetFunctionality().catch(console.error);
