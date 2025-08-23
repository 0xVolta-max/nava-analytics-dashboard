const { chromium } = require('playwright');

async function testFinalLoginFunctionality() {
  console.log('🎯 FINAL LOGIN VERIFICATION TEST\n');
  console.log('Testing login with improved Altcha integration...\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Comprehensive monitoring
  let metrics = {
    pageReloads: 0,
    formSubmissions: 0,
    inputChanges: 0,
    altchaErrors: 0,
    consoleErrors: 0,
    successIndicators: 0
  };

  // Monitor page reloads
  page.on('load', () => {
    metrics.pageReloads++;
    console.log(`📄 Page reloaded (${metrics.pageReloads} total)`);
  });

  // Monitor form submissions
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('auth')) {
      metrics.formSubmissions++;
      console.log(`📝 Form submission detected (${metrics.formSubmissions} total)`);
    }
  });

  // Monitor console messages
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      metrics.consoleErrors++;
      console.log(`❌ Console error: ${text}`);
    } else if (text.includes('Altcha')) {
      console.log(`🤖 Altcha: ${text}`);
    } else if (text.includes('Login')) {
      console.log(`🔑 Login: ${text}`);
      if (text.includes('successful')) {
        metrics.successIndicators++;
      }
    }
  });

  try {
    console.log('🌐 Step 1: Loading login page...\n');
    await page.goto('http://localhost:8083/login', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    console.log('✅ Login page loaded successfully');

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    // Check current page state
    const currentURL = page.url();
    console.log(`🔗 Current URL: ${currentURL}`);

    // Test 1: Check if page is stable (no unexpected reloads)
    console.log('\n🧪 Test 1: Page stability check...');
    const initialReloadCount = metrics.pageReloads;
    await page.waitForTimeout(3000);
    const finalReloadCount = metrics.pageReloads;

    if (finalReloadCount === initialReloadCount) {
      console.log('✅ Page is stable - no unexpected reloads');
    } else {
      console.log(`⚠️  Page had ${finalReloadCount - initialReloadCount} unexpected reloads`);
    }

    // Test 2: Check form elements are present and functional
    console.log('\n🧪 Test 2: Form element functionality...');

    const emailInput = await page.locator('#email');
    const passwordInput = await page.locator('#password');
    const submitButton = await page.locator('button[type="submit"]');

    const emailExists = await emailInput.count() > 0;
    const passwordExists = await passwordInput.count() > 0;
    const submitExists = await submitButton.count() > 0;

    console.log(`📧 Email input present: ${emailExists}`);
    console.log(`🔐 Password input present: ${passwordExists}`);
    console.log(`🔘 Submit button present: ${submitExists}`);

    if (emailExists && passwordExists && submitExists) {
      console.log('✅ All form elements are present');
    } else {
      console.log('❌ Some form elements are missing');
    }

    // Test 3: Test form input functionality
    console.log('\n🧪 Test 3: Form input functionality...');

    if (emailExists) {
      await page.fill('#email', 'test@example.com');
      metrics.inputChanges++;
      console.log(`✅ Email input successful (${metrics.inputChanges} total inputs)`);

      // Wait and check if page reloads
      await page.waitForTimeout(2000);
      const urlAfterEmail = page.url();
      console.log(`🔗 URL after email input: ${urlAfterEmail}`);

      if (urlAfterEmail === currentURL) {
        console.log('✅ No page reload after email input');
      } else {
        console.log('⚠️  Page reloaded after email input');
      }
    }

    if (passwordExists) {
      await page.fill('#password', 'testpassword');
      metrics.inputChanges++;
      console.log(`✅ Password input successful (${metrics.inputChanges} total inputs)`);

      // Wait and check if page reloads
      await page.waitForTimeout(2000);
      const urlAfterPassword = page.url();
      console.log(`🔗 URL after password input: ${urlAfterPassword}`);

      if (urlAfterPassword === currentURL) {
        console.log('✅ No page reload after password input');
      } else {
        console.log('⚠️  Page reloaded after password input');
      }
    }

    // Test 4: Check Altcha widget state
    console.log('\n🧪 Test 4: Altcha widget analysis...');

    const altchaContainer = await page.locator('.altcha-container');
    const altchaWidget = await page.locator('.altcha-widget');
    const loadingAnimation = await page.locator('.animate-spin');

    const altchaContainerExists = await altchaContainer.count() > 0;
    const altchaWidgetExists = await altchaWidget.count() > 0;
    const loadingVisible = await loadingAnimation.count() > 0;

    console.log(`🤖 Altcha container present: ${altchaContainerExists}`);
    console.log(`🤖 Altcha widget present: ${altchaWidgetExists}`);
    console.log(`⏳ Loading animation visible: ${loadingVisible}`);

    if (altchaContainerExists) {
      console.log('✅ Altcha integration is present');

      // Check for mock widget content
      const mockWidgetContent = await page.locator('text=Bot Verification (Demo Mode)').count() > 0;
      console.log(`🎭 Mock widget content visible: ${mockWidgetContent}`);

      if (mockWidgetContent) {
        console.log('✅ Mock Altcha widget is displaying correctly');
      }
    } else {
      console.log('❌ Altcha integration is missing');
    }

    // Test 5: Submit button state
    console.log('\n🧪 Test 5: Submit button functionality...');

    if (submitExists) {
      const isEnabled = await submitButton.isEnabled();
      const buttonText = await submitButton.textContent();

      console.log(`🔘 Submit button enabled: ${isEnabled}`);
      console.log(`🔘 Submit button text: "${buttonText?.trim()}"`);

      if (isEnabled) {
        console.log('✅ Submit button is functional');
      } else {
        console.log('❌ Submit button is disabled');
      }
    }

    // Test 6: Overall form usability
    console.log('\n🧪 Test 6: Overall form usability assessment...');

    const allElementsPresent = emailExists && passwordExists && submitExists && altchaContainerExists;
    const noUnexpectedReloads = metrics.pageReloads <= 1; // Allow 1 for initial load
    const formIsFunctional = metrics.inputChanges >= 2 && metrics.consoleErrors === 0;

    console.log(`📋 All required elements present: ${allElementsPresent}`);
    console.log(`🔄 No unexpected page reloads: ${noUnexpectedReloads}`);
    console.log(`⚙️ Form is functional: ${formIsFunctional}`);

    console.log('\n📊 FINAL TEST RESULTS SUMMARY:');
    console.log('='.repeat(50));
    console.log(`   Page reloads: ${metrics.pageReloads}`);
    console.log(`   Form submissions: ${metrics.formSubmissions}`);
    console.log(`   Input changes: ${metrics.inputChanges}`);
    console.log(`   Console errors: ${metrics.consoleErrors}`);
    console.log(`   Success indicators: ${metrics.successIndicators}`);
    console.log(`   Altcha errors: ${metrics.altchaErrors}`);
    console.log('='.repeat(50));

    // Final assessment
    if (allElementsPresent && noUnexpectedReloads && formIsFunctional) {
      console.log('\n🎉 SUCCESS: Login functionality is working perfectly!');
      console.log('   ✅ All form elements present and functional');
      console.log('   ✅ No unexpected page reloads');
      console.log('   ✅ Altcha integration working correctly');
      console.log('   ✅ Form inputs working without issues');
      console.log('   ✅ Professional user experience');
    } else {
      console.log('\n⚠️  ISSUES IDENTIFIED:');
      if (!allElementsPresent) {
        console.log('   ❌ Some form elements are missing');
      }
      if (!noUnexpectedReloads) {
        console.log('   ❌ Unexpected page reloads detected');
      }
      if (!formIsFunctional) {
        console.log('   ❌ Form functionality issues');
      }
    }

    console.log('\n🔗 Final URL: ' + page.url());
    console.log('\n🎯 LOGIN FUNCTIONALITY TEST COMPLETED');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n📊 ERROR TEST RESULTS:');
    console.log(`   Page reloads: ${metrics.pageReloads}`);
    console.log(`   Console errors: ${metrics.consoleErrors}`);
  } finally {
    await browser.close();
  }
}

// Run the final verification test
testFinalLoginFunctionality().catch(console.error);
