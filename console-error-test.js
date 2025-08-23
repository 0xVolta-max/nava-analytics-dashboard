const { chromium } = require('playwright');

async function monitorConsoleErrors() {
  console.log('🔍 Monitoring console errors and page structure...');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    // Set up console monitoring before navigation
    const errors = [];
    const logs = [];

    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        errors.push(`Console Error: ${text}`);
      } else if (type === 'warning') {
        logs.push(`Console Warning: ${text}`);
      } else if (type === 'log') {
        logs.push(`Console Log: ${text}`);
      }
    });

    console.log('📄 Navigating to home page first...');
    await page.goto('http://localhost:8080/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Home page loaded successfully');

    // Check if React has mounted
    const hasRoot = await page.locator('#root').count() > 0;
    const rootText = await page.locator('#root').textContent();
    console.log(`🎯 Root element found: ${hasRoot}`);
    console.log(`🎯 Root content: "${rootText || 'EMPTY'}"`);

    // Now navigate to login page
    console.log('📄 Navigating to login page...');
    await page.goto('http://localhost:8080/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Login page loaded successfully');

    // Check login page content
    const loginRootText = await page.locator('#root').textContent();
    console.log(`🎯 Login page root content: "${loginRootText || 'EMPTY'}"`);

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(3000);

    // Check for specific elements that should be on login page
    const hasLoginForm = await page.locator('form').count() > 0;
    const hasLoginText = await page.locator('text=/Login/i').count() > 0;
    const hasAltchaContainer = await page.locator('.altcha-container').count() > 0;

    console.log(`🎯 Login page analysis:`);
    console.log(`   Has form: ${hasLoginForm}`);
    console.log(`   Has "Login" text: ${hasLoginText}`);
    console.log(`   Has Altcha container: ${hasAltchaContainer}`);

    // Take screenshot
    await page.screenshot({
      path: 'login-page-console-test.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved as login-page-console-test.png');

    // Report all captured errors and logs
    if (errors.length > 0) {
      console.log('\n❌ Errors detected:');
      errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('\n✅ No errors detected');
    }

    if (logs.length > 0) {
      console.log('\n📝 Console logs:');
      logs.slice(0, 10).forEach(log => console.log(`   - ${log}`)); // Show first 10 logs
      if (logs.length > 10) {
        console.log(`   ... and ${logs.length - 10} more logs`);
      }
    }

    // Check the current URL to see if redirect happened
    const currentUrl = page.url();
    console.log(`🔗 Final URL: ${currentUrl}`);

    if (currentUrl !== 'http://localhost:8080/login') {
      console.log('⚠️  Redirect detected - page may have redirected away from login');
    }

    console.log('\n🎉 Console monitoring completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
monitorConsoleErrors().catch(console.error);
