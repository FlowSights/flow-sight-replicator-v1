
// Configurar CORS restrictivo - solo permitir el dominio de producción
const ALLOWED_ORIGINS = [
  "https://flowsights.it.com",
  "https://www.flowsights.it.com",
  "http://localhost:5173", // Para desarrollo local
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
};

const SYSTEM_PROMPT = `Eres un Experto Estratega de Marketing Senior y Consultor de Crecimiento.
Ecosistemas: Microsoft 365, Google Workspace, Meta Ads.
Especialidad: Integración de datos de múltiples fuentes para crear una "única fuente de verdad".

MÁRGENES DE MEJORA Y AHORRO (Datos típicos):
- Reducción de Costos: Hasta un 30% mediante la identificación de gastos innecesarios y fugas operativas.
- Eficiencia Operativa: Incremento de hasta 2x en la productividad al eliminar tareas manuales y cuellos de botella.
- Precisión de Datos: Alcanzamos un 95% de precisión eliminando duplicados y errores humanos.
- Velocidad de Decisión: Decisiones hasta 5x más rápidas gracias a dashboards en tiempo real.

PERSONALIDAD Y TONO:
- Inteligente y Consultivo: No solo respondas, aporta valor.
- Profesional pero Cercano: Usa un lenguaje claro.
- Conciso pero Informativo: Respuestas de 3-5 oraciones.
- Ortografía Impecable: Asegúrate de escribir perfectamente bien en español profesional.`;

interface ChatPayload {
  messages: Array<{ role: "user" | "assistant" | "system"; content: any }>;
  images?: string[];
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = (await req.json()) as Partial<ChatPayload>;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const images = Array.isArray(body.images) ? body.images : [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No hay mensajes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatMessages = messages.map((m, index) => {
      const isLastUserMessage = m.role === 'user' && index === messages.length - 1;
      
      if (isLastUserMessage && images.length > 0) {
        return {
          role: m.role,
          content: [
            { type: "text", text: m.content.toString() },
            ...images.map(img => ({
              type: "image_url",
              image_url: { url: img }
            }))
          ]
        };
      }
      
      return {
        role: m.role,
        content: m.content.toString()
      };
    });

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp",
        messages: chatMessages,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: "AI Error", details: errText }), { 
        status: resp.status, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const data = await resp.json();
    let reply = data?.choices?.[0]?.message?.content ?? "";

    // Limpieza profunda
    reply = reply.replace(/<update_ads>[\s\S]*?<\/update_ads>/g, "").trim();
    reply = reply.replace(/^\s*hla\b/i, 'Hola');

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});