const fs = require('fs');
fetch('https://jnqjwwezuwkhapmgixbf.supabase.co/functions/v1/chat-with-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'Hola' }] })
}).then(async r => {
  const txt = await r.text();
  fs.writeFileSync('error.log', r.status + '\n' + txt);
  console.log("Done");
}).catch(console.error);
