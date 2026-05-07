const url = 'https://jnqjwwezuwkhapmgixbf.supabase.co/functions/v1/google-ads-auth';

async function test() {
  try {
    console.log('Testing Edge Function: google-ads-auth (getAuthUrl)');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'getAuthUrl',
        redirect_uri: 'http://localhost:5173/flowsight-ads/dashboard'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
