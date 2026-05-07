const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Failed to refresh token');
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { ad, budget, campaignName, customer_id, refresh_token } = await req.json();
    
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');

    if (!clientId || !clientSecret || !developerToken) {
      throw new Error('Missing Google Ads configuration in Supabase Secrets');
    }

    // 1. Get a fresh Access Token
    const accessToken = await getAccessToken(clientId, clientSecret, refresh_token);
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'Content-Type': 'application/json'
    };

    const baseUrl = `https://googleads.googleapis.com/v17/customers/${customer_id.replace(/-/g, '')}`;

    // --- STEP 1: CREATE CAMPAIGN BUDGET ---
    const budgetOp = {
      mutateOperations: [{
        campaignBudgetOperation: {
          create: {
            name: `${campaignName} Budget - ${Date.now()}`,
            amountMicros: (budget || 10) * 1_000_000,
            deliveryMethod: 'STANDARD'
          }
        }
      }]
    };
    
    const budgetRes = await fetch(`${baseUrl}/googleAds:mutate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(budgetOp)
    });
    const budgetData = await budgetRes.json();
    if (!budgetRes.ok) throw new Error(`Budget Error: ${JSON.stringify(budgetData)}`);
    const budgetResourceName = budgetData.mutateOperationResponses[0].campaignBudgetResult.resourceName;

    // --- STEP 2: CREATE CAMPAIGN ---
    const campaignOp = {
      mutateOperations: [{
        campaignOperation: {
          create: {
            name: campaignName,
            advertisingChannelType: 'SEARCH',
            status: 'PAUSED', // Start as paused for safety
            campaignBudget: budgetResourceName,
            targetSpend: { } // Maximize clicks
          }
        }
      }]
    };

    const campaignRes = await fetch(`${baseUrl}/googleAds:mutate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(campaignOp)
    });
    const campaignData = await campaignRes.json();
    if (!campaignRes.ok) throw new Error(`Campaign Error: ${JSON.stringify(campaignData)}`);
    const campaignResourceName = campaignData.mutateOperationResponses[0].campaignResult.resourceName;

    // --- STEP 3: CREATE AD GROUP ---
    const adGroupOp = {
      mutateOperations: [{
        adGroupOperation: {
          create: {
            name: 'FlowSights Ad Group',
            campaign: campaignResourceName,
            status: 'ENABLED',
            type: 'SEARCH_STANDARD'
          }
        }
      }]
    };

    const adGroupRes = await fetch(`${baseUrl}/googleAds:mutate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(adGroupOp)
    });
    const adGroupData = await adGroupRes.json();
    if (!adGroupRes.ok) throw new Error(`AdGroup Error: ${JSON.stringify(adGroupData)}`);
    const adGroupResourceName = adGroupData.mutateOperationResponses[0].adGroupResult.resourceName;

    // --- STEP 4: CREATE AD (RESPONSIVE SEARCH AD) ---
    const adOp = {
      mutateOperations: [{
        adGroupAdOperation: {
          create: {
            adGroup: adGroupResourceName,
            status: 'ENABLED',
            ad: {
              responsiveSearchAd: {
                headlines: [{ text: ad.headline.substring(0, 30) }],
                descriptions: [{ text: ad.description.substring(0, 90) }]
              },
              finalUrls: [ad.websiteUrl || 'https://flowsights.it']
            }
          }
        }
      }]
    };

    const finalRes = await fetch(`${baseUrl}/googleAds:mutate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(adOp)
    });
    const finalData = await finalRes.json();
    if (!finalRes.ok) throw new Error(`Ad Error: ${JSON.stringify(finalData)}`);

    return new Response(JSON.stringify({ 
      success: true, 
      campaign_id: campaignResourceName,
      message: "Campaña creada exitosamente en Google Ads (Pausada para revisión)" 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Publish Error:", msg);
    return new Response(JSON.stringify({ error: msg }), { 
      status: 400, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
