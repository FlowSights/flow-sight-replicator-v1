const url = 'https://jnqjwwezuwkhapmgixbf.supabase.co/functions/v1/google-ads-publish';

async function test() {
  try {
    console.log('--- Probando publicación en Google Ads ---');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ad: {
          headline: "Café de Especialidad",
          description: "El mejor café de Costa Rica en tu mesa.",
          websiteUrl: "https://flowsights.it"
        },
        budget: 5,
        campaignName: "Test Campaign " + Date.now(),
        customer_id: "582-466-8194",
        refresh_token: "MOCK_TOKEN" // Esto fallará pero nos dirá si la función llega a Google
      })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Respuesta del servidor:', JSON.stringify(data, null, 2));
    
  } catch (e) {
    console.error('Error de conexión:', e);
  }
}

test();
