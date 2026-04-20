const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO_EMAIL = "contacto@flowsights.it.com";
const FROM_EMAIL = "FlowSights <contacto@flowsights.it.com>";

interface Finding {
  t: string;
  d: string;
}

interface DiagnosticPayload {
  name: string;
  email: string;
  health: number;
  riskPct: number;
  profileTitle: string;
  profileSub: string;
  monthlyLeak: number;
  yearlyLeak: number;
  findings: Finding[];
  answers: Array<{ question: string; answer: string }>;
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const body = (await req.json()) as Partial<DiagnosticPayload>;
    const name = (body.name ?? "").toString().trim().slice(0, 100);
    const email = (body.email ?? "").toString().trim().slice(0, 255);

    if (!name || !email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Datos inválidos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const health = Number(body.health ?? 0);
    const riskPct = Number(body.riskPct ?? 0);
    const monthlyLeak = Number(body.monthlyLeak ?? 0);
    const yearlyLeak = Number(body.yearlyLeak ?? 0);
    const profileTitle = (body.profileTitle ?? "").toString().slice(0, 200);
    const profileSub = (body.profileSub ?? "").toString().slice(0, 500);
    const findings = Array.isArray(body.findings) ? body.findings.slice(0, 10) : [];
    const answers = Array.isArray(body.answers) ? body.answers.slice(0, 20) : [];

    const findingsHtml = findings
      .map(
        (f) => `
          <li style="margin-bottom:10px">
            <strong>${escapeHtml(f.t || "")}</strong><br/>
            <span style="color:#475569">${escapeHtml(f.d || "")}</span>
          </li>`,
      )
      .join("");

    const answersHtml = answers
      .map(
        (a) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#475569;width:50%">${escapeHtml(a.question || "")}</td>
            <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">${escapeHtml(a.answer || "")}</td>
          </tr>`,
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;max-width:640px">
        <h2 style="margin:0 0 8px">Nuevo diagnóstico completado — FlowSights</h2>
        <p style="color:#64748b;margin:0 0 20px">Un visitante completó el análisis gratuito.</p>

        <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin-bottom:20px">
          <p style="margin:0 0 6px"><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0"><strong>Correo:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        </div>

        <h3 style="margin:0 0 8px">Resultado</h3>
        <div style="background:#eff6ff;padding:16px;border-radius:8px;margin-bottom:20px;border-left:4px solid #3b82f6">
          <p style="margin:0 0 6px"><strong>Perfil:</strong> ${escapeHtml(profileTitle)}</p>
          <p style="margin:0 0 12px;color:#475569">${escapeHtml(profileSub)}</p>
          <p style="margin:0"><strong>Salud operativa:</strong> ${health}% &nbsp;|&nbsp; <strong>Riesgo:</strong> ${riskPct}%</p>
          <p style="margin:6px 0 0"><strong>Fuga estimada:</strong> $${monthlyLeak.toLocaleString()}/mes (≈ $${yearlyLeak.toLocaleString()}/año)</p>
        </div>

        ${
          findingsHtml
            ? `<h3 style="margin:0 0 8px">Hallazgos clave</h3>
               <ul style="padding-left:20px;margin:0 0 20px">${findingsHtml}</ul>`
            : ""
        }

        ${
          answersHtml
            ? `<h3 style="margin:0 0 8px">Respuestas</h3>
               <table style="width:100%;border-collapse:collapse;font-size:14px">${answersHtml}</table>`
            : ""
        }
      </div>
    `;

    const resp = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Nuevo diagnóstico — ${name} (${profileTitle})`,
        html,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Resend error", resp.status, data);
      return new Response(
        JSON.stringify({ error: "No se pudo enviar el correo", details: data }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("send-diagnostic-email error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
