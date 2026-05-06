const url = "https://jnqjwwezuwkhapmgixbf.supabase.co/functions/v1/chat-with-ai";

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: "Test" }] })
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(console.log)
.catch(console.error);
