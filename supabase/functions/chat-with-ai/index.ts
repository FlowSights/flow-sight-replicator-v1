const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_SYSTEM_PROMPT = `Eres FlowBot, el asistente virtual oficial de FlowSights. Tu objetivo es ayudar a los usuarios con la plataforma.
INSTRUCCIÓN TÉCNICA OBLIGATORIA:
Debes ser extremadamente directo y conciso. Evita introducciones largas. Ve directo al grano en no más de 3 o 4 líneas a menos que sea estrictamente necesario explicar un concepto.
Responde en español de forma amigable. Ayuda a optimizar procesos y redirige a contacto de WhatsApp si es necesario.`;

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
    const body = (await req.json()) as Partial<ChatPayload>;
    const isChatbot = !body.systemPrompt;

    let GEMINI_API_KEY = isChatbot 
      ? Deno.env.get("GEMINI_KEY_CHATBOT") 
      : Deno.env.get("GEMINI_KEY_AGENT");

    // Fallback de seguridad por si alguna no está configurada aún
    if (!GEMINI_API_KEY) {
      GEMINI_API_KEY = Deno.env.get("GEMINI_SECRET_KEY");
    }

    if (!GEMINI_API_KEY) {
      throw new Error("No Gemini API Keys are configured in Supabase Secrets");
    }
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

    let reply = "";

    try {
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
        throw new Error(data?.error?.message || JSON.stringify(data));
      }

      reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch (geminiError) {
      console.error("Gemini attempt failed:", geminiError);
      console.log("Falling back to Groq...");
      
      try {
        const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
        if (!GROQ_API_KEY) {
          throw new Error(`Gemini falló y no hay llave de Groq para el respaldo. Error original: ${geminiError}`);
        }

        const chatMessages = messages.map((m) => ({
          role: m.role,
          content: m.content.toString()
        }));

        const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
        const groqResp = await fetch(groqUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: finalSystemPrompt },
              ...chatMessages
            ],
            temperature: 0.7,
            max_completion_tokens: 1000,
            top_p: 0.9,
          }),
        });
        
        const groqData = await groqResp.json();
        if (!groqResp.ok) {
          throw new Error(`Ambas APIs (Gemini y Groq) fallaron. Groq: ${JSON.stringify(groqData)}`);
        }
        
        reply = groqData?.choices?.[0]?.message?.content ?? "";
      } catch (fallbackError) {
        const msg = fallbackError instanceof Error ? fallbackError.message : "Unknown error";
        return new Response(JSON.stringify({ reply: `🚨 Lo siento, nuestros servidores de IA están saturados en este momento. Por favor, intenta en unos minutos.` }), { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
    }

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