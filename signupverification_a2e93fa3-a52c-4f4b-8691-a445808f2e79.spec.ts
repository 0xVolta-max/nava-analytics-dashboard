
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('SignupVerification_2025-08-25', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:8081/signup');

    // Fill input field
    await page.fill('#email', 'playwright-test-001@example.com');

    // Fill input field
    await page.fill('#password', 'TestPassword123!');

    // Click element
    await page.click('button[type='submit']');
});