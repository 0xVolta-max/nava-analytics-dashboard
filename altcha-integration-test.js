#!/usr/bin/env node

/**
 * Simple test script for Altcha integration
 * Tests the complete flow: CSRF token -> Challenge -> Verification
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5173'; // Adjust if needed

async function testAltchaIntegration() {
  console.log('🧪 Testing Altcha Integration...\n');

  try {
    // Step 1: Get CSRF token
    console.log('1. Getting CSRF token...');
    const csrfResponse = await fetch(`${BASE_URL}/api/csrf-token`);
    const csrfData = await csrfResponse.json();

    if (!csrfData.success) {
      throw new Error('Failed to get CSRF token');
    }

    console.log('✅ CSRF token received:', csrfData.token.substring(0, 16) + '...');

    // Step 2: Get Altcha challenge
    console.log('\n2. Getting Altcha challenge...');
    const challengeResponse = await fetch(`${BASE_URL}/api/altcha-challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfData.token
      },
      body: JSON.stringify({ action: 'login' })
    });

    const challengeData = await challengeResponse.json();

    if (!challengeData.success) {
      throw new Error('Failed to get challenge: ' + challengeData.error);
    }

    console.log('✅ Challenge received');
    console.log('   Challenge:', challengeData.challenge.substring(0, 16) + '...');
    console.log('   Salt:', challengeData.salt.substring(0, 16) + '...');
    console.log('   Signature:', challengeData.signature.substring(0, 16) + '...');

    // Step 3: Verify the challenge (simulate what the widget would send)
    console.log('\n3. Verifying challenge...');

    // Create payload that matches what the widget would send
    const payload = JSON.stringify({
      challenge: challengeData.challenge,
      salt: challengeData.salt,
      signature: challengeData.signature,
      algorithm: challengeData.algorithm,
      action: 'login'
    });

    const verifyResponse = await fetch(`${BASE_URL}/api/verify-altcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfData.token
      },
      body: JSON.stringify({ payload })
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      console.log('✅ Verification successful!');
    } else {
      console.log('❌ Verification failed:', verifyData.error);
    }

    console.log('\n🎉 Altcha integration test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your development server is running on', BASE_URL);
    }
  }
}

// Run the test
testAltchaIntegration();
