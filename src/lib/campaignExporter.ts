interface CampaignData {
  id: string;
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  objective: string;
  toneOfVoice: string;
  targetAudience: string;
  product: string;
  adCopies: string[];
  generatedImages: string[];
  budgetRecommendation: {
    min: number;
    recommended: number;
    max: number;
  };
}

export const generateCampaignJSON = (campaign: CampaignData): string => {
  const campaignConfig = {
    campaignName: campaign.product,
    platform: campaign.platform,
    objective: campaign.objective,
    targetAudience: campaign.targetAudience,
    toneOfVoice: campaign.toneOfVoice,
    budget: {
      minimum: `$${campaign.budgetRecommendation.min}`,
      recommended: `$${campaign.budgetRecommendation.recommended}`,
      maximum: `$${campaign.budgetRecommendation.max}`,
    },
    adVariants: campaign.adCopies.map((copy, idx) => ({
      variantNumber: idx + 1,
      headline: copy.split('\n')[0] || copy.substring(0, 50),
      description: copy,
      imageIndex: idx,
      callToAction: 'Conocer más',
    })),
    platformSpecificInstructions: getPlatformInstructions(campaign.platform),
    generatedAt: new Date().toISOString(),
  };

  return JSON.stringify(campaignConfig, null, 2);
};

export const generatePlatformCSV = (campaign: CampaignData): string => {
  const headers = [
    'Variant',
    'Headline',
    'Description',
    'Call to Action',
    'Image File',
    'Platform',
    'Objective',
    'Target Audience',
    'Tone',
  ];

  const rows = campaign.adCopies.map((copy, idx) => [
    `Variant ${idx + 1}`,
    copy.split('\n')[0] || copy.substring(0, 50),
    copy,
    'Conocer más',
    `image_${idx + 1}.jpg`,
    campaign.platform.toUpperCase(),
    campaign.objective,
    campaign.targetAudience,
    campaign.toneOfVoice,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

export const generateInstructions = (platform: 'meta' | 'google' | 'tiktok' | 'linkedin'): string => {
  const instructions: Record<string, string> = {
    meta: `
# 🚀 Guía Premium de Lanzamiento: Meta Ads (Facebook & Instagram)

¡Felicidades! Tienes en tus manos una campaña diseñada por IA lista para captar la atención de tu audiencia ideal. Hemos eliminado la complejidad para que puedas lanzar tus anuncios en minutos.

## 🎯 Paso 1: Tu Centro de Control
Ingresa a tu cuenta publicitaria haciendo clic en este enlace directo:
👉 https://adsmanager.facebook.com/adsmanager/manage/campaigns

Una vez dentro, busca el botón verde que dice **"+ Crear"**. ¡Aquí empieza la magia!

## ⚙️ Paso 2: El Propósito de tu Campaña
Meta te preguntará qué deseas lograr. Para esta campaña, te sugerimos elegir **"Tráfico"** (si quieres visitas a tu web) o **"Ventas/Clientes Potenciales"** (si buscas conversiones directas).
*Tip Pro: Deja que Meta optimice el presupuesto automáticamente activando la opción "Presupuesto de la campaña Advantage+".*

## 👥 Paso 3: Conectando con tu Audiencia
En la sección de "Conjunto de anuncios", define a quién quieres llegar:
- **Ubicación:** Ingresa la zona geográfica que definimos en tu estrategia.
- **Edades y Género:** Ajusta según tu cliente ideal.
- **Ubicaciones (Placements):** Te recomendamos usar "Ubicaciones Advantage+" para que la IA de Meta muestre tu anuncio donde sea más barato y efectivo (Facebook, Instagram, Stories, Reels).

## 🎨 Paso 4: Dando Vida a tu Anuncio
Llegamos a la parte divertida. En la sección de "Anuncio":
1. Sube la imagen que hemos preparado para ti.
2. Copia y pega el **Texto Principal (Copy)** y el **Título (Headline)** exactamente como te los entregamos. ¡Están optimizados para persuadir!
3. Elige un botón de llamada a la acción (CTA) que invite a hacer clic, como "Más información" o "Comprar ahora".
4. Ingresa el enlace de tu página web.

## 🚀 Paso 5: ¡Al Aire!
Revisa cómo se ve tu anuncio en la vista previa a la derecha. Si todo luce increíble, presiona el botón verde **"Publicar"** en la esquina inferior derecha.

¡Listo! Tu campaña está en revisión y pronto empezará a generar resultados.
    `,
    google: `
# 🚀 Guía Premium de Lanzamiento: Google Ads

¡Excelente! Tienes una campaña de búsqueda estructurada para capturar a las personas exactamente en el momento en que buscan lo que ofreces. Sigue estos sencillos pasos para activarla.

## 🎯 Paso 1: Tu Centro de Control
Ingresa a tu cuenta de Google Ads haciendo clic en este enlace directo:
👉 https://ads.google.com/aw/campaigns/new

Haz clic en **"Nueva campaña"**.

## ⚙️ Paso 2: El Propósito de tu Campaña
Google te preguntará tu objetivo. Selecciona **"Ventas"**, **"Clientes potenciales"** o **"Tráfico del sitio web"** según lo que necesites.
Luego, elige el tipo de campaña **"Búsqueda"** (Search). Esto asegura que aparezcas en los resultados de texto de Google.

## 💰 Paso 3: Inversión Inteligente
Define tu presupuesto diario. Te sugerimos comenzar con la inversión recomendada en este documento.
En la sección de "Pujas" (Bidding), concéntrate en **"Clics"** para maximizar el tráfico inicial.

## 🔑 Paso 4: Las Palabras Clave
Google te pedirá que ingreses palabras clave. Piensa en cómo tu cliente ideal buscaría tu producto o servicio en Google. Ingresa de 5 a 10 frases muy específicas (ej. "comprar zapatos deportivos online" en lugar de solo "zapatos").

## 📝 Paso 5: Dando Vida a tu Anuncio
Copia y pega los **Títulos (Headlines)** y **Descripciones** que hemos generado para ti.
*Tip Pro: Google rotará estos textos automáticamente para encontrar la combinación que genere más clics. ¡Asegúrate de llenar todos los espacios posibles!*

## 🚀 Paso 6: ¡Al Aire!
Revisa el resumen de tu campaña. Si Google te da sugerencias, puedes aplicarlas o ignorarlas por ahora. Haz clic en **"Publicar campaña"**.

¡Listo! Estás a punto de aparecer en el buscador más grande del mundo.
    `,
    tiktok: `
# 🚀 Guía Premium de Lanzamiento: TikTok Ads

¡Prepárate para viralizarte! Tienes una campaña diseñada para capturar la atención rápida y dinámica de la audiencia de TikTok. Sigue estos pasos para lanzar tu anuncio.

## 🎯 Paso 1: Tu Centro de Control
Ingresa a tu administrador de anuncios haciendo clic en este enlace directo:
👉 https://ads.tiktok.com/i18n/dashboard

Haz clic en el botón rosa **"Crear"** en la pestaña de Campañas.

## ⚙️ Paso 2: El Propósito de tu Campaña
Selecciona tu objetivo publicitario. Para empezar rápido y generar visitas, elige **"Tráfico"**. Si tienes el píxel de TikTok instalado y buscas ventas, elige **"Conversiones"**.

## 👥 Paso 3: Conectando con tu Audiencia
En la configuración del grupo de anuncios:
- Define la ubicación, edad y género de tu cliente ideal.
- *Tip Pro:* En TikTok, a menudo es mejor dejar la segmentación por intereses un poco amplia y dejar que el algoritmo encuentre a tu audiencia basándose en quién interactúa con tu anuncio.

## 🎨 Paso 4: Dando Vida a tu Anuncio
1. Sube el contenido visual que hemos preparado. En TikTok, el formato vertical (9:16) es el rey.
2. Copia y pega el **Texto del anuncio** que te proporcionamos. Mantenlo breve y directo al punto.
3. Selecciona un botón de llamada a la acción (CTA) dinámico.

## 🚀 Paso 5: ¡Al Aire!
Revisa la vista previa de tu anuncio simulando la pantalla de un móvil. Si tiene el "look and feel" nativo de TikTok, presiona **"Enviar"**.

¡Listo! Tu campaña está lista para conquistar el feed "Para Ti".
    `,
    linkedin: `
# 🚀 Guía Premium de Lanzamiento: LinkedIn Ads

¡Excelente elección! Tienes una campaña B2B estructurada para conectar con profesionales y tomadores de decisiones. Sigue estos pasos para activar tu estrategia en la red profesional más grande.

## 🎯 Paso 1: Tu Centro de Control
Ingresa a tu administrador de campañas haciendo clic en este enlace directo:
👉 https://www.linkedin.com/campaignmanager/accounts

Selecciona tu cuenta publicitaria y haz clic en **"Crear" -> "Campaña"**.

## ⚙️ Paso 2: El Propósito de tu Campaña
LinkedIn te pedirá que elijas un objetivo. Selecciona **"Visitas al sitio web"** o **"Generación de contactos"** (Lead Gen) dependiendo de tu estrategia.

## 👔 Paso 3: Segmentación Profesional
Aquí es donde LinkedIn brilla. Define a tu audiencia usando filtros profesionales:
- Cargos o funciones laborales (ej. "Director de Marketing", "CEO").
- Sectores de la empresa (ej. "Tecnología", "Salud").
- Tamaño de la empresa.
*Tip Pro: Mantén tu audiencia entre 50,000 y 300,000 personas para un equilibrio ideal entre especificidad y alcance.*

## 🎨 Paso 4: Dando Vida a tu Anuncio
Selecciona el formato **"Anuncio con una sola imagen"**.
1. Sube la imagen profesional que hemos preparado.
2. Copia y pega el **Texto introductorio** y el **Titular** que te entregamos.
3. Añade la URL de destino de tu sitio web.
4. Elige un botón de llamada a la acción (CTA) adecuado, como "Más información" o "Descargar".

## 🚀 Paso 5: ¡Al Aire!
Revisa todos los detalles de tu campaña, confirma tu presupuesto diario y haz clic en **"Lanzar campaña"**.

¡Listo! Tu mensaje está en camino a los profesionales correctos.
    `,
  };

  return instructions[platform] || 'Instrucciones no disponibles';
};

const getPlatformInstructions = (platform: 'meta' | 'google' | 'tiktok' | 'linkedin'): string => {
  const instructionsMap: Record<string, string> = {
    meta: 'Usa Meta Ads Manager. Carga las imágenes y copia el texto en los campos correspondientes.',
    google: 'Usa Google Ads. Crea anuncios de búsqueda con el texto proporcionado.',
    tiktok: 'Usa TikTok Ads Manager. Carga el video/imagen y el texto del anuncio.',
    linkedin: 'Usa LinkedIn Campaign Manager. Carga la imagen y el contenido del anuncio.',
  };

  return instructionsMap[platform] || 'Instrucciones no disponibles';
};

export const downloadCampaignPackage = async (campaign: CampaignData) => {
  // Crear objeto con todos los archivos
  const campaignJSON = generateCampaignJSON(campaign);
  const campaignCSV = generatePlatformCSV(campaign);
  const instructions = generateInstructions(campaign.platform);

  // Crear un blob con el contenido
  const content = `
================================================================================
🌟 CAMPAIGN KIT PREMIUM: ${campaign.product.toUpperCase()} 🌟
================================================================================

¡Hola! Aquí tienes tu estrategia publicitaria lista para lanzar. 
Hemos diseñado este kit para que sea increíblemente fácil de usar.

📊 RESUMEN ESTRATÉGICO
--------------------------------------------------------------------------------
Plataforma Elegida: ${campaign.platform.toUpperCase()}
Objetivo Principal: ${campaign.objective}
Tu Cliente Ideal: ${campaign.targetAudience}
Inversión Sugerida: $${campaign.budgetRecommendation.recommended} USD / día

--------------------------------------------------------------------------------
📖 TU GUÍA PASO A PASO
--------------------------------------------------------------------------------
${instructions}

--------------------------------------------------------------------------------
💡 MEJORES PRÁCTICAS PARA EL ÉXITO
--------------------------------------------------------------------------------
1. La Paciencia Paga: Deja que tu campaña corra al menos 3-5 días sin hacer cambios. El algoritmo necesita tiempo para aprender.
2. Revisa los Comentarios: Interactúa con las personas que comentan en tus anuncios. ¡Es servicio al cliente en tiempo real!
3. Mide lo que Importa: Concéntrate en el costo por resultado (CPA) más que en los "Me gusta" o "Compartir".

--------------------------------------------------------------------------------
⚙️ DATOS TÉCNICOS (Para copiar y pegar)
--------------------------------------------------------------------------------
A continuación encontrarás los datos estructurados de tu campaña. 
Solo necesitas copiar y pegar estos textos en la plataforma.

[FORMATO JSON]
${campaignJSON}

[FORMATO CSV]
${campaignCSV}

================================================================================
Generado con ❤️ por Flowsight Ads - ${new Date().toLocaleDateString()}
================================================================================
  `;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flowsight-campaign-${campaign.id}.txt`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const openPlatformEditor = (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => {
  const urls: Record<string, string> = {
    meta: 'https://adsmanager.facebook.com/adsmanager/manage/campaigns',
    google: 'https://ads.google.com/aw/campaigns/new',
    tiktok: 'https://ads.tiktok.com/i18n/dashboard',
    linkedin: 'https://www.linkedin.com/campaignmanager/accounts',
  };

  window.open(urls[platform], '_blank');
};
