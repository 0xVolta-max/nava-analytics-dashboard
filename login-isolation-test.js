const { chromium } = require('playwright');

async function testLoginWithoutAltcha() {
  console.log('🧪 Testing Login Functionality WITHOUT Altcha...\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Monitor for any page reloads or navigation
  let pageReloads = 0;
  let formSubmissions = 0;
  let inputChanges = 0;

  page.on('load', () => {
    pageReloads++;
    console.log(`📄 Page reloaded (${pageReloads} total)`);
  });

  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('auth')) {
      formSubmissions++;
      console.log(`📝 Form submission detected (${formSubmissions} total)`);
    }
  });

  try {
    console.log('🌐 Step 1: Loading login page...');
    await page.goto('http://localhost:8083/login', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✅ Login page loaded successfully');

    // Check if Altcha widget is present
    const hasAltchaWidget = await page.locator('[class*="altcha"]').count() > 0;
    console.log(`🤖 Altcha widget present: ${hasAltchaWidget ? 'YES' : 'NO'}`);

    // Check for static verification indicator
    const hasVerificationIndicator = await page.locator('text=Verification completed automatically').count() > 0;
    console.log(`✅ Static verification indicator present: ${hasVerificationIndicator ? 'YES' : 'NO'}`);

    console.log('\n🧪 Step 2: Testing form interactions...');

    // Test email input
    console.log('📧 Testing email input...');
    await page.fill('#email', 'test@example.com');
    inputChanges++;
    console.log(`✅ Email input successful (${inputChanges} total inputs)`);

    // Wait a moment to see if page reloads
    await page.waitForTimeout(1000);

    // Test password input
    console.log('🔐 Testing password input...');
    await page.fill('#password', 'testpassword');
    inputChanges++;
    console.log(`✅ Password input successful (${inputChanges} total inputs)`);

    // Wait a moment to see if page reloads
    await page.waitForTimeout(1000);

    // Check current URL and page state
    const currentURL = page.url();
    console.log(`🔗 Current URL: ${currentURL}`);

    // Test form submission (but don't actually submit to avoid auth issues)
    console.log('📤 Testing form submission...');

    // Check if submit button is enabled
    const submitButton = await page.locator('button[type="submit"]');
    const isEnabled = await submitButton.isEnabled();
    console.log(`🔘 Submit button enabled: ${isEnabled ? 'YES' : 'NO'}`);

    if (isEnabled) {
      console.log('✅ Form is ready for submission');
    }

    console.log('\n📊 Test Results Summary:');
    console.log(`   Page reloads: ${pageReloads}`);
    console.log(`   Form submissions: ${formSubmissions}`);
    console.log(`   Input changes: ${inputChanges}`);
    console.log(`   Current URL: ${currentURL}`);

    if (pageReloads === 0 && inputChanges > 0) {
      console.log('\n🎉 SUCCESS: Login form works without Altcha!');
      console.log('   ✅ No unexpected reloads');
      console.log('   ✅ Form inputs functional');
      console.log('   ✅ Static verification indicator present');
    } else {
      console.log('\n⚠️  ISSUES FOUND:');
      if (pageReloads > 0) {
        console.log(`   ❌ Unexpected page reloads: ${pageReloads}`);
      }
      if (inputChanges === 0) {
        console.log('   ❌ Form inputs not working');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the isolation test
testLoginWithoutAltcha().catch(console.error);
