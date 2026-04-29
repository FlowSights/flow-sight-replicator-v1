/**
 * Exportador Maestro de Assets
 * Genera un paquete completo con todos los kits de plataformas
 */

interface AdData {
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  type: string;
}

interface MasterExportData {
  businessName: string;
  websiteUrl: string;
  ads: Record<'google' | 'meta' | 'tiktok' | 'linkedin', AdData[]>;
}

/**
 * Genera CSV para Google Ads
 */
const generateGoogleCSV = (businessName: string, ads: AdData[]): string => {
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

  const rows = ads.map((ad, idx) => [
    `${businessName} - ${ad.type}`,
    `Ad Group ${idx + 1}`,
    ad.headline,
    ad.headline.substring(0, 20),
    ad.cta,
    ad.description,
    ad.description.substring(0, 30),
    '',
    '',
  ]);

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
};

/**
 * Genera JSON para Meta Ads
 */
const generateMetaJSON = (businessName: string, ads: AdData[]): string => {
  const campaigns = ads.map((ad, idx) => ({
    name: `${businessName} - ${ad.type} - Variant ${idx + 1}`,
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
 * Genera contenido de copys para una plataforma
 */
const generatePlatformCopys = (
  platform: string,
  businessName: string,
  ads: AdData[]
): string => {
  let content = `
================================================================================
                    COPYS DE ANUNCIOS - ${businessName.toUpperCase()}
                              ${platform.toUpperCase()}
================================================================================

Generado: ${new Date().toLocaleDateString('es-ES')}
Negocio: ${businessName}
Plataforma: ${platform}

================================================================================
  `;

  ads.forEach((ad, idx) => {
    content += `

ANUNCIO ${idx + 1} - ${ad.type.toUpperCase()}
────────────────────────────────────────────────────────────────────────────

Titular:
${ad.headline}

Descripción:
${ad.description}

Botón de Acción:
${ad.cta}

────────────────────────────────────────────────────────────────────────────
  `;
  });

  return content;
};

/**
 * Genera instrucciones de implementación
 */
const generateImplementationGuide = (): string => {
  return `
================================================================================
                    GUÍA DE IMPLEMENTACIÓN COMPLETA
================================================================================

CONTENIDO DEL PAQUETE:
├── Google Ads/
│   ├── google-ads-import.csv
│   └── google-copys.txt
├── Meta Ads/
│   ├── meta-ads-import.json
│   └── meta-copys.txt
├── TikTok Ads/
│   └── tiktok-copys.txt
├── LinkedIn Ads/
│   └── linkedin-copys.txt
└── ESTRATEGIA_COMPLETA.txt

================================================================================
PASO 1: GOOGLE ADS
================================================================================

1. Ve a https://ads.google.com/aw/campaigns
2. Haz clic en "Herramientas" → "Importar"
3. Selecciona "Google Ads Editor" o "CSV"
4. Carga el archivo "google-ads-import.csv"
5. Revisa y publica

Notas:
- Asegúrate de tener una campaña activa
- Verifica los URLs de destino
- Revisa los límites de presupuesto

================================================================================
PASO 2: META ADS (FACEBOOK/INSTAGRAM)
================================================================================

1. Ve a https://adsmanager.facebook.com
2. Haz clic en "Crear" → "Importar campaña"
3. Carga el archivo "meta-ads-import.json"
4. Revisa los detalles de la campaña
5. Ajusta presupuesto y audiencia
6. Publica

Notas:
- Necesitas tener un píxel de Meta instalado
- Verifica que el URL de destino sea correcto
- Prueba con un presupuesto pequeño primero

================================================================================
PASO 3: TIKTOK ADS
================================================================================

1. Ve a https://ads.tiktok.com/i18n/dashboard
2. Haz clic en "Crear campaña"
3. Sube manualmente los assets del ZIP
4. Copia los textos del archivo "tiktok-copys.txt"
5. Configura audiencia y presupuesto
6. Publica

Notas:
- TikTok no soporta importación masiva aún
- Usa el formato vertical (9:16) para imágenes
- Mantén los textos breves y directos

================================================================================
PASO 4: LINKEDIN ADS
================================================================================

1. Ve a https://www.linkedin.com/campaignmanager
2. Haz clic en "Crear campaña"
3. Sube manualmente los assets del ZIP
4. Copia los textos del archivo "linkedin-copys.txt"
5. Configura audiencia profesional
6. Publica

Notas:
- LinkedIn requiere carga manual de assets
- Usa imágenes profesionales
- Enfócate en beneficios B2B

================================================================================
PRÓXIMOS PASOS
================================================================================

1. Monitorea el rendimiento de cada plataforma
2. Ajusta presupuestos según ROI
3. Prueba variaciones de copys
4. Escala lo que funciona
5. Optimiza continuamente

Para soporte adicional, consulta tu Dashboard Personalizado.

================================================================================
Generado por FlowSights Ads - ${new Date().getFullYear()}
================================================================================
  `;
};

/**
 * Descarga todos los kits en un archivo maestro
 */
export const downloadMasterPackage = async (data: MasterExportData) => {
  try {
    let masterContent = `
================================================================================
                    FLOWSIGHTS ADS - PAQUETE MAESTRO COMPLETO
================================================================================

NEGOCIO: ${data.businessName}
FECHA: ${new Date().toLocaleDateString('es-ES')}
SITIO WEB: ${data.websiteUrl}

Este paquete contiene todos los activos y estrategias para lanzar campañas
en Google Ads, Meta, TikTok y LinkedIn.

================================================================================
ÍNDICE
================================================================================

1. GOOGLE ADS - Importación y Copys
2. META ADS - Importación y Copys
3. TIKTOK ADS - Copys y Estrategia
4. LINKEDIN ADS - Copys y Estrategia
5. GUÍA DE IMPLEMENTACIÓN COMPLETA

================================================================================
SECCIÓN 1: GOOGLE ADS
================================================================================

${generatePlatformCopys('Google Ads', data.businessName, data.ads.google || [])}

CSV PARA IMPORTACIÓN:
${generateGoogleCSV(data.businessName, data.ads.google || [])}

================================================================================
SECCIÓN 2: META ADS
================================================================================

${generatePlatformCopys('Meta (Facebook/Instagram)', data.businessName, data.ads.meta || [])}

JSON PARA IMPORTACIÓN:
${generateMetaJSON(data.businessName, data.ads.meta || [])}

================================================================================
SECCIÓN 3: TIKTOK ADS
================================================================================

${generatePlatformCopys('TikTok', data.businessName, data.ads.tiktok || [])}

================================================================================
SECCIÓN 4: LINKEDIN ADS
================================================================================

${generatePlatformCopys('LinkedIn', data.businessName, data.ads.linkedin || [])}

================================================================================
GUÍA DE IMPLEMENTACIÓN
================================================================================

${generateImplementationGuide()}

================================================================================
ANÁLISIS ESTRATÉGICO
================================================================================

PLATAFORMAS INCLUIDAS:
✓ Google Ads - Captura de intención de búsqueda
✓ Meta (Facebook/Instagram) - Retargeting y awareness
✓ TikTok - Alcance a audiencias jóvenes
✓ LinkedIn - Targeting B2B profesional

PRÓXIMOS PASOS:
1. Revisa cada sección según la plataforma
2. Personaliza URLs y tracking
3. Implementa siguiendo la guía paso a paso
4. Monitorea métricas en tiempo real
5. Optimiza según resultados

================================================================================
SOPORTE Y RECURSOS
================================================================================

Dashboard: Accede a tu dashboard personalizado para métricas en tiempo real
Documentación: Consulta la guía completa de cada plataforma
Soporte: Contacta a nuestro equipo para asistencia

================================================================================
Descargado desde FlowSights Ads - ${new Date().toLocaleDateString('es-ES')}
================================================================================
    `;

    // Descargar como archivo de texto
    const blob = new Blob([masterContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowSights-Master-Package-${data.businessName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error descargando paquete maestro:', error);
    throw error;
  }
};
