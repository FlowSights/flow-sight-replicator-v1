const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_SYSTEM_PROMPT = `Eres FlowBot, el asistente virtual oficial de FlowSights...
Responde en español de forma amigable. Ayuda a optimizar procesos y redirige a contacto si es necesario.`;

interface ChatPayload {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  images?: string[];
  systemPrompt?: string; // Nuevo parámetro opcional para sobrescribir el prompt
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_SECRET_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_SECRET_KEY is not configured");

    const body = (await req.json()) as Partial<ChatPayload>;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const images = Array.isArray(body.images) ? body.images : [];
    
    const finalSystemPrompt = body.systemPrompt || DEFAULT_SYSTEM_PROMPT;

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No hay mensajes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let contents = messages.slice(-10).map((m, index) => {
      const isLastMessage = index === messages.length - 1;
      const parts: any[] = [{ text: m.content.toString() }];

      if (isLastMessage && images.length > 0) {
        images.forEach(dataUrl => {
          const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
          if (match && match.length === 3) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        });
      }

      return {
        role: m.role === "assistant" ? "model" : "user",
        parts
      };
    });

    // Gemini requires the conversation to start with a user message
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const resp = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: finalSystemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          topP: 0.9,
        },
      }),
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      console.error("Gemini error:", resp.status, data);
      const errorDetails = data?.error?.message || JSON.stringify(data);
      return new Response(JSON.stringify({ reply: `🔥 Error de API de Google: ${errorDetails}` }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Edge function error:", msg);
    return new Response(JSON.stringify({ reply: `🚨 Error de Sistema: ${msg}` }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});