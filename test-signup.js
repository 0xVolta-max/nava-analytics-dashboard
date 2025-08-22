// Simple test script to verify signup functionality
// Run with: node test-signup.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://supabase.safy.pro';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE3NTI4Mzk2ODgsImV4cCI6MTc4NDM3NTY4OH0.BPvgo9tvevryWTMPyMtMGT3Tdl8Da55DOKCZodq-FQQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'testpassword123';

  console.log('Testing signup with:', { email: testEmail, password: testPassword });

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    if (error) {
      console.error('Signup failed:', error.message);
      return false;
    }

    console.log('Signup successful!');
    console.log('User data:', data.user);
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the test
testSignup().then(success => {
  console.log('\nTest result:', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
});
