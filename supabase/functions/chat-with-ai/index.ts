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

- Ecosistemas: Microsoft 365, Google Workspace, Meta Ads.
- Especialidad: Integración de datos de múltiples fuentes para crear una "única fuente de verdad".

MÁRGENES DE MEJORA Y AHORRO (Datos típicos):
- Reducción de Costos: Hasta un 30% mediante la identificación de gastos innecesarios y fugas operativas.
- Eficiencia Operativa: Incremento de hasta 2x en la productividad al eliminar tareas manuales y cuellos de botella.
- Precisión de Datos: Alcanzamos un 95% de precisión eliminando duplicados y errores humanos.
- Velocidad de Decisión: Decisiones hasta 5x más rápidas gracias a dashboards en tiempo real.

SERVICIOS DETALLADOS:
1. Diagnóstico Gratuito (24-48h): Analizamos tu situación actual sin costo.
2. Limpieza de Datos (Data Cleaning): Deduplicación, validación y auditoría de calidad.
3. Insights Operativos: Detección de anomalías y KPIs críticos.
4. Optimización de Procesos: Mapeo de flujos y automatización.
5. Dashboards Personalizados: Visualizaciones interactivas y reportes automáticos.
6. Monitoreo 24/7: Alertas en tiempo real para evitar que los problemas escalen.

INDUSTRIAS CLAVE: Manufactura, Logística, Hoteles, Restaurantes, Clínicas y Retail.

PERSONALIDAD Y TONO:
- Inteligente y Consultivo: No solo respondas, aporta valor. Si preguntan por servicios, explica *por qué* son importantes.
- Persuación Sutil (Vendedor): Tu objetivo final es que el usuario solicite el "Diagnóstico Gratuito" o contacte por WhatsApp.
- Profesional pero Cercano: Usa un lenguaje claro, evita tecnicismos innecesarios a menos que el usuario sea técnico.
- Conciso pero Informativo: Respuestas de 3-5 oraciones. Usa datos numéricos (30% ahorro, 2x eficiencia) para generar confianza.

REGLAS CRÍTICAS:
1. Si detectas un problema operativo (ej: "mis inventarios no cuadran"), explica cómo FlowSights lo resuelve y ofrece el diagnóstico gratuito.
2. NO inventes precios. Di que cada solución es personalizada tras el diagnóstico gratuito.
3. Usa emojis estratégicos (máximo 1 por respuesta) para mantener la calidez.
4. NO uses markdown (negritas, listas con asteriscos, etc.), responde en texto plano fluido.
5. Si el usuario quiere hablar con un humano, redirige al botón de WhatsApp o al email.
6. Ortografía Impecable: Asegúrate de escribir perfectamente bien en español profesional y académico.`;

interface ChatPayload {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
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

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No hay mensajes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Si ya viene un mensaje de sistema desde el frontend, no agregamos el predeterminado
    const hasSystemMessage = messages.some(m => m.role === 'system');
    
    const chatMessages = hasSystemMessage 
      ? messages.slice(-11).map((m) => ({
          role: m.role,
          content: m.content.toString().slice(0, 3000),
        }))
      : [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content.toString().slice(0, 3000),
          })),
        ];

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
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes, intenta en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se agotaron los créditos de IA." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await resp.text();
      console.error("AI gateway error", resp.status, errText);
      // No revelar detalles internos del error
      return new Response(
        JSON.stringify({ error: "No se pudo procesar la solicitud. Por favor, intenta de nuevo." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    let reply =
      data?.choices?.[0]?.message?.content ??
      "Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo?";

    // Limpieza general de la respuesta
    reply = reply.trim();
    
    // Corregir errores comunes en la primera palabra (como "Hla" -> "Hola")
    reply = reply.replace(/^\s*hla\b/i, 'Hola');

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("chat-with-ai error:", msg);
    // No revelar detalles internos del error al cliente
    return new Response(JSON.stringify({ error: "Error interno del servidor. Por favor, intenta de nuevo." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }