/**
 * Exportador de Assets para Campañas
 * Genera archivos específicos por plataforma
 */

interface AssetExportData {
  businessName: string;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  ads: Array<{
    headline: string;
    description: string;
    cta: string;
    imageUrl: string;
    type: string;
  }>;
  websiteUrl: string;
}

/**
 * Genera un archivo CSV de importación para Google Ads
 */
export const generateGoogleAdsCSV = (data: AssetExportData): string => {
  const headers = [
    'Campaign Name',
    'Ad Group Name',
    'Headline 1',
    'Headline 2',
    'Headline 3',
    'Description Line 1',
    'Description Line 2',
    'Final URL',
    'Display URL',
  ];

  const rows = data.ads.map((ad, idx) => [
    `${data.businessName} - ${ad.type}`,
    `Ad Group ${idx + 1}`,
    ad.headline,
    ad.headline.substring(0, 20),
    ad.cta,
    ad.description,
    ad.description.substring(0, 30),
    data.websiteUrl,
    new URL(data.websiteUrl).hostname,
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  return csv;
};

/**
 * Genera un archivo JSON de importación para Meta Ads
 */
export const generateMetaAdsJSON = (data: AssetExportData): string => {
  const campaigns = data.ads.map((ad, idx) => ({
    name: `${data.businessName} - ${ad.type} - Variant ${idx + 1}`,
    objective: 'LINK_CLICKS',
    adsets: [
      {
        name: `AdSet ${idx + 1}`,
        bid_amount: 500,
        daily_budget: 50000,
        targeting: {
          geo_locations: [{ country: 'US' }],
          age_min: 18,
          age_max: 65,
        },
        ads: [
          {
            name: `Ad ${idx + 1}`,
            adset_spec: {
              creative: {
                title: ad.headline,
                body: ad.description,
                call_to_action_type: 'LEARN_MORE',
                image_url: ad.imageUrl,
              },
            },
          },
        ],
      },
    ],
  }));

  return JSON.stringify({ campaigns }, null, 2);
};

/**
 * Genera un archivo de instrucciones de importación específico por plataforma
 */
export const generateImportInstructions = (platform: string): string => {
  const instructions: Record<string, string> = {
    google: `
# Importar Campaña en Google Ads

## Pasos:
1. Ve a https://ads.google.com/aw/campaigns
2. Haz clic en "Herramientas" → "Importar"
3. Selecciona "Google Ads Editor" o "CSV"
4. Carga el archivo "google-ads-import.csv"
5. Revisa y publica

## Notas:
- Asegúrate de tener una campaña activa
- Verifica los URLs de destino
- Revisa los límites de presupuesto
    `,
    meta: `
# Importar Campaña en Meta Ads

## Pasos:
1. Ve a https://adsmanager.facebook.com
2. Haz clic en "Crear" → "Importar campaña"
3. Carga el archivo "meta-ads-import.json"
4. Revisa los detalles de la campaña
5. Ajusta presupuesto y audiencia
6. Publica

## Notas:
- Necesitas tener un píxel de Meta instalado
- Verifica que el URL de destino sea correcto
- Prueba con un presupuesto pequeño primero
    `,
    tiktok: `
# Importar Campaña en TikTok Ads

## Pasos:
1. Ve a https://ads.tiktok.com/i18n/dashboard
2. Haz clic en "Crear campaña"
3. Sube manualmente los assets del ZIP
4. Copia los textos del archivo "ad-copy.txt"
5. Configura audiencia y presupuesto
6. Publica

## Notas:
- TikTok no soporta importación masiva aún
- Usa el formato vertical (9:16) para imágenes
- Mantén los textos breves y directos
    `,
    linkedin: `
# Importar Campaña en LinkedIn Ads

## Pasos:
1. Ve a https://www.linkedin.com/campaignmanager
2. Haz clic en "Crear campaña"
3. Sube manualmente los assets del ZIP
4. Copia los textos del archivo "ad-copy.txt"
5. Configura audiencia profesional
6. Publica

## Notas:
- LinkedIn requiere carga manual de assets
- Usa imágenes profesionales
- Enfócate en beneficios B2B
    `,
  };

  return instructions[platform] || 'Instrucciones no disponibles';
};

/**
 * Genera un archivo de texto con todos los copys de la plataforma
 */
export const generateAdCopyText = (data: AssetExportData): string => {
  let text = `
================================================================================
                    COPYS DE ANUNCIOS - ${data.businessName.toUpperCase()}
                              ${data.platform.toUpperCase()}
================================================================================

Generado: ${new Date().toLocaleDateString('es-ES')}
Negocio: ${data.businessName}
Sitio Web: ${data.websiteUrl}
Plataforma: ${data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}

================================================================================
  `;

  data.ads.forEach((ad, idx) => {
    text += `

ANUNCIO ${idx + 1} - ${ad.type.toUpperCase()}
────────────────────────────────────────────────────────────────────────────

Titular:
${ad.headline}

Descripción:
${ad.description}

Botón de Acción:
${ad.cta}

Imagen: Incluida en el ZIP (image_${idx + 1}.jpg)

────────────────────────────────────────────────────────────────────────────
  `;
  });

  text += `

================================================================================
INSTRUCCIONES DE IMPORTACIÓN
================================================================================

${generateImportInstructions(data.platform)}

================================================================================
Generado por FlowSights Ads - ${new Date().getFullYear()}
================================================================================
  `;

  return text;
};

/**
 * Descarga los assets específicos de la plataforma seleccionada
 * Cada plataforma recibe solo sus propios archivos
 */
export const downloadAssetsPackage = async (data: AssetExportData) => {
  try {
    let content = '';
    let filename = '';

    // Generar contenido específico según la plataforma
    if (data.platform === 'google') {
      const googleCSV = generateGoogleAdsCSV(data);
      const adCopyText = generateAdCopyText(data);
      content = `
================================================================================
                    FLOWSIGHTS ADS - GOOGLE ADS PACKAGE
================================================================================

NEGOCIO: ${data.businessName}
PLATAFORMA: Google Ads
FECHA: ${new Date().toLocaleDateString('es-ES')}

================================================================================
ARCHIVO: GOOGLE ADS IMPORT (CSV)
================================================================================

${googleCSV}

================================================================================
AD COPY (TEXTO)
================================================================================

${adCopyText}

================================================================================
Descargado desde FlowSights Ads - ${new Date().toLocaleDateString('es-ES')}
================================================================================
      `;
      filename = `FlowSights-Google-Ads-${data.businessName}-${new Date().toISOString().split('T')[0]}.txt`;
    } else if (data.platform === 'meta') {
      const metaJSON = generateMetaAdsJSON(data);
      const adCopyText = generateAdCopyText(data);
      content = `
================================================================================
                    FLOWSIGHTS ADS - META ADS PACKAGE
================================================================================

NEGOCIO: ${data.businessName}
PLATAFORMA: Meta (Facebook/Instagram)
FECHA: ${new Date().toLocaleDateString('es-ES')}

================================================================================
ARCHIVO: META ADS IMPORT (JSON)
================================================================================

${metaJSON}

================================================================================
AD COPY (TEXTO)
================================================================================

${adCopyText}

================================================================================
Descargado desde FlowSights Ads - ${new Date().toLocaleDateString('es-ES')}
================================================================================
      `;
      filename = `FlowSights-Meta-Ads-${data.businessName}-${new Date().toISOString().split('T')[0]}.txt`;
    } else if (data.platform === 'tiktok') {
      const adCopyText = generateAdCopyText(data);
      content = `
================================================================================
                    FLOWSIGHTS ADS - TIKTOK ADS PACKAGE
================================================================================

NEGOCIO: ${data.businessName}
PLATAFORMA: TikTok Ads
FECHA: ${new Date().toLocaleDateString('es-ES')}

================================================================================
AD COPY (TEXTO)
================================================================================

${adCopyText}

================================================================================
Descargado desde FlowSights Ads - ${new Date().toLocaleDateString('es-ES')}
================================================================================
      `;
      filename = `FlowSights-TikTok-Ads-${data.businessName}-${new Date().toISOString().split('T')[0]}.txt`;
    } else if (data.platform === 'linkedin') {
      const adCopyText = generateAdCopyText(data);
      content = `
================================================================================
                    FLOWSIGHTS ADS - LINKEDIN ADS PACKAGE
================================================================================

NEGOCIO: ${data.businessName}
PLATAFORMA: LinkedIn Ads
FECHA: ${new Date().toLocaleDateString('es-ES')}

================================================================================
AD COPY (TEXTO)
================================================================================

${adCopyText}

================================================================================
Descargado desde FlowSights Ads - ${new Date().toLocaleDateString('es-ES')}
================================================================================
      `;
      filename = `FlowSights-LinkedIn-Ads-${data.businessName}-${new Date().toISOString().split('T')[0]}.txt`;
    }

    // Descargar como archivo de texto
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error descargando assets:', error);
    throw error;
  }
};
