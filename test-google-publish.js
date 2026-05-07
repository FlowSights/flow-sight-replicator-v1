const url = 'https://jnqjwwezuwkhapmgixbf.supabase.co/functions/v1/google-ads-publish';

async function test() {
  try {
    console.log('Testing Edge Function: google-ads-publish (OPTIONS)');
    const res = await fetch(url, {
      method: 'OPTIONS',
    });
    console.log('Status:', res.status);
    console.log('Headers:', [...res.headers.entries()]);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
