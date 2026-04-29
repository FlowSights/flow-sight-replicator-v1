/**
 * Generador de Campaign Kit Premium
 * Crea un documento de 15+ páginas con estrategia de marketing completa
 */

interface CampaignKitData {
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  websiteUrl: string;
  ads: Array<{
    headline: string;
    description: string;
    cta: string;
    platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
    type: string;
    score: number;
  }>;
}

/**
 * Genera el documento completo del Campaign Kit Premium
 */
export const generatePremiumCampaignKit = (data: CampaignKitData): string => {
  const date = new Date().toLocaleDateString('es-ES');

  return `
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                      CAMPAIGN KIT PREMIUM - ESTRATEGIA COMPLETA           ║
║                                                                            ║
║                        Generado por FlowSights Ads                        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

DOCUMENTO CONFIDENCIAL
Fecha: ${date}
Negocio: ${data.businessName}
Versión: 1.0

================================================================================
TABLA DE CONTENIDOS
================================================================================

1. RESUMEN EJECUTIVO
2. ANÁLISIS DE MERCADO Y COMPETENCIA
3. PERFIL DEL PÚBLICO OBJETIVO
4. ESTRATEGIA DE POSICIONAMIENTO
5. ARQUITECTURA DE CAMPAÑA
6. PSICOLOGÍA DEL CONSUMIDOR Y GANCHOS
7. ESTRATEGIA POR PLATAFORMA
8. COPYS OPTIMIZADOS Y VARIACIONES
9. PLAN DE ESCALADO
10. MÉTRICAS Y KPIs
11. CALENDARIO DE IMPLEMENTACIÓN
12. PRESUPUESTO Y PROYECCIONES
13. ANÁLISIS DE COMPETENCIA
14. RECOMENDACIONES DE TESTING
15. PRÓXIMOS PASOS Y OPTIMIZACIONES

================================================================================
PÁGINA 1: RESUMEN EJECUTIVO
================================================================================

NEGOCIO: ${data.businessName}
DESCRIPCIÓN: ${data.businessDescription}
PÚBLICO OBJETIVO: ${data.targetAudience}
SITIO WEB: ${data.websiteUrl}

OBJETIVO ESTRATÉGICO:
Posicionar a ${data.businessName} como líder en su categoría mediante una 
estrategia de publicidad digital integrada que combine captura de intención, 
retargeting y awareness en múltiples plataformas.

PLATAFORMAS RECOMENDADAS:
✓ Google Ads - Para capturar búsquedas de intención de compra
✓ Meta (Facebook/Instagram) - Para retargeting y brand awareness
✓ TikTok - Para alcance a audiencias más jóvenes y virales
✓ LinkedIn - Para targeting B2B y profesional

PRESUPUESTO RECOMENDADO:
Inicial: \$1,000 - \$2,000/mes para testing
Escalado: \$5,000 - \$10,000/mes después de optimización

PROYECCIÓN DE ROI:
Mes 1: 150-200% ROI
Mes 2: 250-350% ROI
Mes 3+: 400%+ ROI

================================================================================
PÁGINA 2: ANÁLISIS DE MERCADO Y COMPETENCIA
================================================================================

TAMAÑO DEL MERCADO:
El mercado de ${data.businessName} está en crecimiento. Existe una demanda 
clara de soluciones que aborden los puntos de dolor principales.

TENDENCIAS ACTUALES:
1. Aumento en búsquedas relacionadas con la categoría
2. Mayor disposición a pagar por soluciones premium
3. Preferencia por marcas con presencia en múltiples canales
4. Importancia creciente de las reseñas y social proof

OPORTUNIDADES:
- Mercado poco saturado en plataformas como TikTok
- Audiencia receptiva en LinkedIn para B2B
- Bajo costo por clic en comparación con competidores
- Alto potencial de viralidad en contenido creativo

AMENAZAS:
- Competencia creciente en Google Ads
- Cambios en algoritmos de plataformas
- Aumento de costos por clic
- Saturación de anuncios en feed

================================================================================
PÁGINA 3: PERFIL DEL PÚBLICO OBJETIVO
================================================================================

SEGMENTACIÓN PRIMARIA:

Segmento 1: DECISORES ACTIVOS
- Edad: 25-45 años
- Comportamiento: Búsqueda activa de soluciones
- Plataforma principal: Google Ads, LinkedIn
- Intención: Alta (listos para comprar)
- Presupuesto: Alto

Segmento 2: EXPLORADORES
- Edad: 18-35 años
- Comportamiento: Descubrimiento y awareness
- Plataforma principal: TikTok, Instagram
- Intención: Media (consideración)
- Presupuesto: Medio

Segmento 3: RETARGETING
- Edad: Todos
- Comportamiento: Visitantes previos
- Plataforma principal: Meta (Facebook/Instagram)
- Intención: Media-Alta (ya conocen la marca)
- Presupuesto: Bajo

PSICOGRAFÍA:
- Valores: Calidad, innovación, eficiencia
- Motivaciones: Resolver problemas, ahorrar tiempo
- Preocupaciones: Precio, confiabilidad, ROI
- Aspiraciones: Éxito, crecimiento, reconocimiento

================================================================================
PÁGINA 4: ESTRATEGIA DE POSICIONAMIENTO
================================================================================

PROPUESTA DE VALOR ÚNICA (UVP):
${data.businessName} ofrece [BENEFICIO PRINCIPAL] que permite a [PÚBLICO] 
lograr [RESULTADO] de manera [DIFERENCIADOR].

MENSAJES CLAVE:
1. Eficiencia: Ahorra tiempo y dinero
2. Confiabilidad: Probado y respaldado
3. Innovación: Tecnología de punta
4. Soporte: Acompañamiento personalizado

POSICIONAMIENTO EMOCIONAL:
- Seguridad: "Confía en nosotros"
- Aspiración: "Logra tus metas"
- Comunidad: "Únete a miles de usuarios"
- Urgencia: "No esperes más"

================================================================================
PÁGINA 5: ARQUITECTURA DE CAMPAÑA
================================================================================

FUNNEL DE CONVERSIÓN:

AWARENESS (Top of Funnel)
├─ Objetivo: Alcance y visibilidad
├─ Plataformas: TikTok, Instagram, Google Display
├─ Formato: Video, Carrusel, Display
└─ CPC Esperado: \$0.50 - \$1.50

CONSIDERATION (Middle of Funnel)
├─ Objetivo: Educación y comparación
├─ Plataformas: Google Ads, LinkedIn, Retargeting
├─ Formato: Search, Lead Form, Video
└─ CPC Esperado: \$2.00 - \$5.00

CONVERSION (Bottom of Funnel)
├─ Objetivo: Cierre de venta
├─ Plataformas: Google Ads, Meta
├─ Formato: Search, Retargeting, Lead Ads
└─ CPC Esperado: \$3.00 - \$8.00

RETENTION (Post-Venta)
├─ Objetivo: Retención y upsell
├─ Plataformas: Email, Meta
├─ Formato: Secuencias, Ofertas especiales
└─ Costo: Bajo (audiencia existente)

================================================================================
PÁGINA 6: PSICOLOGÍA DEL CONSUMIDOR Y GANCHOS
================================================================================

GANCHOS PSICOLÓGICOS APLICADOS:

1. ESCASEZ
   Copia: "Solo 5 espacios disponibles esta semana"
   Efecto: Crea urgencia y FOMO

2. PRUEBA SOCIAL
   Copia: "Más de 10,000 clientes satisfechos"
   Efecto: Genera confianza y credibilidad

3. AUTORIDAD
   Copia: "Certificado por [Autoridad]"
   Efecto: Posiciona como experto

4. RECIPROCIDAD
   Copia: "Descarga gratis nuestra guía de 15 páginas"
   Efecto: Genera obligación de retorno

5. CONSISTENCIA
   Copia: "Únete a miles que ya han transformado su negocio"
   Efecto: Impulsa a seguir a la mayoría

6. AVERSIÓN A LA PÉRDIDA
   Copia: "No pierdas esta oportunidad"
   Efecto: Motiva acción inmediata

================================================================================
PÁGINA 7: ESTRATEGIA POR PLATAFORMA
================================================================================

GOOGLE ADS - CAPTURA DE INTENCIÓN
Objetivo: Capturar búsquedas de alto intento
Presupuesto: 40% del total
Palabras clave: [PALABRAS CLAVE PRINCIPALES]
CPC Promedio: \$2.50 - \$5.00
Conversión esperada: 3-5%

META ADS - RETARGETING Y AWARENESS
Objetivo: Retargeting de visitantes + awareness
Presupuesto: 35% del total
Audiencias: Website visitors, Lookalike, Interest-based
CPM Promedio: \$5.00 - \$15.00
Conversión esperada: 1-2%

TIKTOK ADS - VIRALITY Y ALCANCE
Objetivo: Alcance viral a audiencias jóvenes
Presupuesto: 15% del total
Formato: Video nativo, trending sounds
CPM Promedio: \$2.00 - \$8.00
Conversión esperada: 0.5-1%

LINKEDIN ADS - TARGETING B2B
Objetivo: Targeting profesional y B2B
Presupuesto: 10% del total
Audiencias: Job titles, Industries, Seniority
CPM Promedio: \$15.00 - \$30.00
Conversión esperada: 2-4%

================================================================================
PÁGINA 8: COPYS OPTIMIZADOS Y VARIACIONES
================================================================================

VARIACIÓN 1: URGENCIA
Titular: "Últimas 48 horas - Descuento especial"
Descripción: "No esperes más. Acceso limitado. Oferta vence mañana."
CTA: "Aprovechar Ahora"

VARIACIÓN 2: BENEFICIO
Titular: "Aumenta tu ROI en 300%"
Descripción: "Descubre cómo miles de empresas han transformado sus resultados."
CTA: "Ver Cómo"

VARIACIÓN 3: CURIOSIDAD
Titular: "El secreto que usan los líderes"
Descripción: "Revelaremos la estrategia que cambió todo."
CTA: "Descubrir"

VARIACIÓN 4: SOCIAL PROOF
Titular: "10,000+ empresas confían en nosotros"
Descripción: "Únete a la comunidad de ganadores."
CTA: "Unirme Ahora"

================================================================================
PÁGINA 9: PLAN DE ESCALADO
================================================================================

FASE 1: TESTING (Semanas 1-2)
- Presupuesto: \$500 - \$1,000
- Objetivo: Identificar mejor performing ads
- Acciones: Probar 3-5 variaciones por plataforma
- Métrica: ROAS > 1.5x

FASE 2: OPTIMIZACIÓN (Semanas 3-4)
- Presupuesto: \$1,000 - \$2,000
- Objetivo: Escalar ganadores
- Acciones: Aumentar presupuesto 20-30% diarios
- Métrica: ROAS > 2.5x

FASE 3: ESCALADO (Semanas 5-8)
- Presupuesto: \$2,000 - \$5,000
- Objetivo: Maximizar volumen
- Acciones: Duplicar presupuesto cada 3-5 días
- Métrica: ROAS > 3x

FASE 4: OPTIMIZACIÓN AVANZADA (Semana 9+)
- Presupuesto: \$5,000 - \$10,000+
- Objetivo: Mantener ROAS mientras escalas
- Acciones: Nuevas audiencias, nuevos creatives
- Métrica: ROAS > 2.5x (sostenible)

================================================================================
PÁGINA 10: MÉTRICAS Y KPIs
================================================================================

MÉTRICAS PRINCIPALES:

1. ROAS (Return on Ad Spend)
   Fórmula: Ingresos / Gasto en Ads
   Objetivo: > 3x

2. CPA (Cost Per Acquisition)
   Fórmula: Gasto en Ads / Conversiones
   Objetivo: < \$50 (ajustar según margen)

3. CTR (Click Through Rate)
   Fórmula: Clicks / Impressions
   Objetivo: > 2%

4. Conversion Rate
   Fórmula: Conversiones / Clicks
   Objetivo: > 3%

5. LTV (Lifetime Value)
   Fórmula: Ingresos promedio por cliente
   Objetivo: > 10x CPA

DASHBOARD DE MONITOREO:
- Revisar diariamente: Spend, Conversions, ROAS
- Revisar semanalmente: Tendencias, Optimizaciones
- Revisar mensualmente: Análisis profundo, Estrategia

================================================================================
PÁGINA 11: CALENDARIO DE IMPLEMENTACIÓN
================================================================================

SEMANA 1:
- Lunes: Configurar campañas en Google Ads
- Martes: Configurar campañas en Meta
- Miércoles: Configurar campañas en TikTok
- Jueves: Configurar campañas en LinkedIn
- Viernes: Lanzamiento y monitoreo inicial

SEMANA 2:
- Análisis de datos y primeras optimizaciones
- Prueba de nuevas variaciones
- Escalado de ganadores

SEMANA 3-4:
- Optimización continua
- Testing de nuevas audiencias
- Análisis de competencia

SEMANA 5+:
- Escalado agresivo
- Nuevas estrategias
- Retención y upsell

================================================================================
PÁGINA 12: PRESUPUESTO Y PROYECCIONES
================================================================================

PRESUPUESTO INICIAL: \$2,000

Distribución:
- Google Ads: 40% (\$800)
- Meta: 35% (\$700)
- TikTok: 15% (\$300)
- LinkedIn: 10% (\$200)

PROYECCIONES DE RESULTADOS:

Mes 1:
- Inversión: \$2,000
- Conversiones esperadas: 40-60
- Ingresos esperados: \$3,000 - \$6,000
- ROI: 50-200%

Mes 2:
- Inversión: \$5,000
- Conversiones esperadas: 150-200
- Ingresos esperados: \$10,000 - \$20,000
- ROI: 100-300%

Mes 3:
- Inversión: \$10,000
- Conversiones esperadas: 400-600
- Ingresos esperados: \$30,000 - \$60,000
- ROI: 200-500%

================================================================================
PÁGINA 13: ANÁLISIS DE COMPETENCIA
================================================================================

COMPETIDORES PRINCIPALES:
1. [Competidor 1] - Fortalezas y debilidades
2. [Competidor 2] - Fortalezas y debilidades
3. [Competidor 3] - Fortalezas y debilidades

VENTAJAS COMPETITIVAS:
- Mejor precio
- Mejor calidad
- Mejor servicio
- Mejor posicionamiento

OPORTUNIDADES DE DIFERENCIACIÓN:
- Mensajes únicos
- Audiencias no saturadas
- Formatos innovadores
- Timing perfecto

================================================================================
PÁGINA 14: RECOMENDACIONES DE TESTING
================================================================================

A/B TESTING PLAN:

Test 1: HEADLINES
- Variación A: "Aumenta tu ROI en 300%"
- Variación B: "El secreto que usan los líderes"
- Métrica: CTR

Test 2: IMAGES/VIDEOS
- Variación A: Imagen de producto
- Variación B: Video de testimonio
- Métrica: Conversion Rate

Test 3: LANDING PAGES
- Variación A: Página corta (1 sección)
- Variación B: Página larga (5 secciones)
- Métrica: Conversion Rate

Test 4: AUDIENCIAS
- Variación A: Audiencia amplia
- Variación B: Audiencia segmentada
- Métrica: ROAS

================================================================================
PÁGINA 15: PRÓXIMOS PASOS Y OPTIMIZACIONES
================================================================================

ACCIONES INMEDIATAS:
1. Revisar este documento completamente
2. Personalizar copys y mensajes
3. Preparar creatividades
4. Configurar tracking y pixels
5. Lanzar campañas según calendario

OPTIMIZACIONES CONTINUAS:
- Monitoreo diario de métricas
- Pausar ads de bajo rendimiento
- Escalar ads de alto rendimiento
- Testing de nuevas variaciones
- Análisis de competencia

ESCALADO FUTURO:
- Nuevas plataformas (Pinterest, YouTube)
- Nuevas audiencias y segmentos
- Nuevos productos/servicios
- Automatización con IA
- Retención y lifetime value

SOPORTE Y RECURSOS:
- Dashboard personalizado: Acceso 24/7
- Reportes semanales: Análisis detallado
- Consultoría: Sesiones de optimización
- Comunidad: Acceso a grupo de usuarios

================================================================================
CONCLUSIÓN
================================================================================

Este Campaign Kit Premium contiene todo lo necesario para lanzar una campaña
de publicidad digital exitosa. Sigue el plan, monitorea las métricas y 
optimiza continuamente.

El éxito está en la ejecución. ¡Comienza hoy!

================================================================================
Documento generado por FlowSights Ads - ${date}
Versión: 1.0 | Confidencial
================================================================================
  `;
};

/**
 * Descarga el Campaign Kit Premium
 */
export const downloadPremiumCampaignKit = async (data: CampaignKitData) => {
  try {
    const content = generatePremiumCampaignKit(data);

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowSights-Campaign-Kit-Premium-${data.businessName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error descargando Campaign Kit Premium:', error);
    throw error;
  }
};
