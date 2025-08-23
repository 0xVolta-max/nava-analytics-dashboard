const { chromium } = require('playwright');

async function debugLoginPage() {
  console.log('🔍 Debugging login page structure...');

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

    // Check page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page title: ${title}`);
    console.log(`🔗 Current URL: ${url}`);

    // Check if page has any content
    const bodyText = await page.locator('body').textContent();
    console.log(`📝 Body text length: ${bodyText?.length || 0} characters`);

    // Check for common elements
    const hasCard = await page.locator('[class*="card"]').count() > 0;
    const hasForm = await page.locator('form').count() > 0;
    const hasInput = await page.locator('input').count() > 0;
    const hasButton = await page.locator('button').count() > 0;

    console.log(`🎯 Page elements found:`);
    console.log(`   Card component: ${hasCard}`);
    console.log(`   Form element: ${hasForm}`);
    console.log(`   Input elements: ${hasInput}`);
    console.log(`   Button elements: ${hasButton}`);

    // Check for specific text elements
    const hasLoginText = await page.locator('text=Login').count() > 0;
    const hasEmailText = await page.locator('text=Email').count() > 0;
    const hasPasswordText = await page.locator('text=Password').count() > 0;
    const hasBotProtectionText = await page.locator('text=Bot Protection').count() > 0;

    console.log(`🔤 Text elements found:`);
    console.log(`   "Login" text: ${hasLoginText}`);
    console.log(`   "Email" text: ${hasEmailText}`);
    console.log(`   "Password" text: ${hasPasswordText}`);
    console.log(`   "Bot Protection" text: ${hasBotProtectionText}`);

    // Check for any error messages or console errors
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`Console error: ${msg.text()}`);
      }
    });

    // Wait a bit to catch any errors
    await page.waitForTimeout(3000);

    if (errors.length > 0) {
      console.log('❌ Errors detected:');
      errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No errors detected');
    }

    // Take screenshot
    await page.screenshot({
      path: 'login-page-debug.png',
      fullPage: true
    });
    console.log('📸 Debug screenshot saved as login-page-debug.png');

    // Get the page HTML for inspection
    const html = await page.content();
    console.log(`📄 Page HTML length: ${html.length} characters`);

    // Check if the page has loaded the React app
    const hasRoot = await page.locator('#root').count() > 0;
    const rootContent = await page.locator('#root').textContent();

    console.log(`🎯 Root element found: ${hasRoot}`);
    console.log(`🎯 Root content length: ${rootContent?.length || 0} characters`);

    if (hasRoot && (!rootContent || rootContent.length < 10)) {
      console.log('⚠️  Root element exists but appears to be empty - React may not have mounted');
    }

    // Try to find any div elements with classes
    const allDivs = await page.locator('div').all();
    console.log(`📦 Total div elements found: ${allDivs.length}`);

    // Check for specific classes
    const altchaClasses = ['altcha-container', 'altcha-widget'];
    for (const className of altchaClasses) {
      const elements = await page.locator(`.${className}`).count();
      console.log(`🔍 Elements with class "${className}": ${elements}`);
    }

    console.log('\n🎉 Debug completed!');

  } catch (error) {
    console.error('❌ Debug failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the debug
debugLoginPage().catch(console.error);
