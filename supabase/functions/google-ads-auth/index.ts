import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, code, redirect_uri } = await req.json();

    // ACTION: getAuthUrl
    if (action === 'getAuthUrl') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      if (!clientId) throw new Error('Missing GOOGLE_CLIENT_ID');
      
      const scopes = 'https://www.googleapis.com/auth/adwords';
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
      
      return new Response(JSON.stringify({ url }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ACTION: exchangeCode
    if (action === 'exchangeCode') {
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) throw new Error('Missing Google Credentials');

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri,
          grant_type: 'authorization_code'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description || 'Failed to exchange token');

      // We return the refresh token and access token back to the client
      // The client (React app) will save it into the user_integrations table
      return new Response(JSON.stringify({ 
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    throw new Error('Invalid action');

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Auth Error:", msg);
    return new Response(JSON.stringify({ error: msg }), { 
      status: 400, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
