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
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

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

    const chatMessages = messages.map((m) => ({
      role: m.role,
      content: m.content.toString()
    }));

    const groqUrl = "https://api.groq.com/openai/v1/chat/completions";

    const resp = await fetch(groqUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: finalSystemPrompt },
          ...chatMessages
        ],
        temperature: 0.7,
        max_completion_tokens: 2000,
        top_p: 0.9,
      }),
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      console.error("Groq error:", resp.status, data);
      return new Response(JSON.stringify({ error: "AI Error", details: data }), { 
        status: 502, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const reply = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Edge function error:", msg);
    return new Response(JSON.stringify({ error: msg }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});