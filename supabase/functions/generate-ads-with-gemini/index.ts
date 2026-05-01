import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configurar CORS restrictivo
const ALLOWED_ORIGINS = [
  "https://flowsights.it.com",
  "https://www.flowsights.it.com",
  "http://localhost:5173",
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
};

interface GenerateAdsRequest {
  businessName: string;
  promote: string;
  location: string;
  idealCustomer: string;
  websiteUrl: string;
  budget: number;
}

interface GeneratedAdCopy {
  type: "Offer" | "Emotional" | "Urgency";
  platform: "google" | "meta" | "tiktok" | "linkedin";
  headline: string;
  description: string;
  cta: string;
  reasoning: string;
  score: number;
}

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const systemPrompt = `Eres un Director Creativo de una agencia de publicidad de élite con 15 años de experiencia. Tu tarea es generar copys de anuncios persuasivos, optimizados para cada plataforma digital.

IMPORTANTE:
- Genera copys que CONVIERTAN, no que solo llamen la atención.
- Cada copy debe ser único, relevante y específico para el negocio.
- Considera la psicología del consumidor y los patrones de compra.
- Adapta el tono y la estructura para cada plataforma.
- Proporciona un análisis breve de por qué cada copy funcionará.

ESTRUCTURA DE RESPUESTA (JSON):
{
  "ads": [
    {
      "type": "Offer|Emotional|Urgency",
      "platform": "google|meta|tiktok|linkedin",
      "headline": "Máximo 30 caracteres",
      "description": "Máximo 90 caracteres",
      "cta": "Call to Action (máximo 20 caracteres)",
      "reasoning": "Explicación breve de por qué este copy funcionará",
      "score": 85-99
    }
  ]
}

PLATAFORMAS Y LÍMITES:
- Google Ads: Headlines cortos (30 chars), descripciones directas (90 chars)
- Meta (Facebook/Instagram): Textos emocionales, CTAs claros
- TikTok: Tono casual, urgencia, llamadas a la acción dinámicas
- LinkedIn: Profesional, enfocado en beneficios B2B`;

async function generateAdsWithGemini(request: GenerateAdsRequest): Promise<GeneratedAdCopy[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada");
  }

  const userPrompt = `
Genera 12 copys de anuncios (3 por plataforma: Google, Meta, TikTok, LinkedIn) para el siguiente negocio:

INFORMACIÓN DEL NEGOCIO:
- Nombre: ${request.businessName}
- Qué promueve: ${request.promote}
- Ubicación: ${request.location}
- Cliente ideal: ${request.idealCustomer}
- Sitio web: ${request.websiteUrl}
- Presupuesto diario: $${request.budget}

REQUISITOS:
1. Genera 3 tipos de copys por plataforma:
   - Offer (enfocado en descuentos/beneficios)
   - Emotional (conecta emocionalmente)
   - Urgency (crea sentido de urgencia)

2. Cada copy debe:
   - Ser específico para ${request.businessName}
   - Dirigirse a ${request.idealCustomer}
   - Mencionar ${request.promote}
   - Ser optimizado para su plataforma

3. Proporciona un score de 85-99 basado en:
   - Relevancia para el negocio
   - Potencial de conversión
   - Adaptación a la plataforma

Responde SOLO con JSON válido, sin explicaciones adicionales.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: systemPrompt,
          }],
        },
        contents: [{
          parts: [{
            text: userPrompt,
          }],
        }],
        generation_config: {
          temperature: 0.7,
          max_output_tokens: 4000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content received from Gemini");
    }

    // Parsear la respuesta JSON de Gemini
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    return parsedResponse.ads || [];
  } catch (error) {
    console.error("Error generating ads with Gemini:", error);
    throw error;
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método no permitido" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Partial<GenerateAdsRequest>;

    // Validar campos requeridos
    if (!body.businessName || !body.promote || !body.location || !body.idealCustomer) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const request: GenerateAdsRequest = {
      businessName: body.businessName || "",
      promote: body.promote || "",
      location: body.location || "",
      idealCustomer: body.idealCustomer || "",
      websiteUrl: body.websiteUrl || "",
      budget: body.budget || 100,
    };

    const ads = await generateAdsWithGemini(request);

    return new Response(JSON.stringify({ ads }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("generate-ads-with-gemini error:", msg);

    return new Response(
      JSON.stringify({ error: "No se pudo generar los anuncios. Por favor, intenta de nuevo." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
