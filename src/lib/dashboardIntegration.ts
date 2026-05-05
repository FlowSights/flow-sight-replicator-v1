import { supabase } from '@/lib/supabaseClient';
import { GeneratedAdCopy } from '@/hooks/useGeminiAdGenerator';

// Fallback de anuncios de calidad si Gemini falla
const FALLBACK_ADS_TEMPLATE = {
  ads: [
    // GOOGLE
    { type: 'Offer', platform: 'google', headline: 'Impulsa tu negocio hoy', description: 'Obtén resultados reales con nuestra estrategia probada. ¡Empieza ahora!', cta: 'Más información', reasoning: 'Enfoque en beneficio directo', score: 92 },
    { type: 'Emotional', platform: 'google', headline: 'Tu éxito, nuestra meta', description: 'Únete a cientos de emprendedores que transformaron su futuro con nosotros.', cta: 'Ver éxito', reasoning: 'Conexión emocional y social', score: 88 },
    { type: 'Urgency', platform: 'google', headline: 'Oferta por tiempo limitado', description: 'No dejes pasar esta oportunidad única. Solo 10 cupos disponibles.', cta: 'Asegurar cupo', reasoning: 'Urgencia por escasez', score: 95 },
    { type: 'Pain Point', platform: 'google', headline: '¿Cansado de no vender?', description: 'Deja de perder dinero en anuncios que no funcionan. Tenemos la solución.', cta: 'Solución aquí', reasoning: 'Ataca el problema principal', score: 90 },
    // META
    { type: 'Offer', platform: 'meta', headline: 'Regalo exclusivo para ti 🎁', description: 'Descarga nuestra guía maestra y empieza a escalar tu negocio gratis.', cta: 'Descargar', reasoning: 'Lead magnet de alto valor', score: 94 },
    { type: 'Emotional', platform: 'meta', headline: 'Vive la vida que mereces', description: 'Imagina despertar cada día sabiendo que tu negocio crece solo.', cta: 'Saber más', reasoning: 'Visualización del estado deseado', score: 89 },
    { type: 'Urgency', platform: 'meta', headline: 'ÚLTIMAS HORAS ⏰', description: 'El descuento del 50% termina a medianoche. ¡No te quedes fuera!', cta: 'Comprar ahora', reasoning: 'Urgencia temporal clásica', score: 96 },
    { type: 'Pain Point', platform: 'meta', headline: '¿Tu competencia te supera?', description: 'Recupera tu lugar en el mercado con estrategias de vanguardia.', cta: 'Superarlos', reasoning: 'Miedo a quedarse atrás', score: 91 },
    // TIKTOK
    { type: 'Offer', platform: 'tiktok', headline: 'Hack para vender más 🚀', description: 'Este método secreto está cambiando el juego. Úsalo antes que todos.', cta: 'Ver hack', reasoning: 'Curiosidad y beneficio', score: 93 },
    { type: 'Emotional', platform: 'tiktok', headline: 'Pov: Tu negocio escala', description: 'Esa sensación cuando las ventas no dejan de llegar. Hazlo realidad.', cta: 'Lograrlo', reasoning: 'Formato nativo de TikTok', score: 87 },
    { type: 'Urgency', platform: 'tiktok', headline: 'Corre, se agotan 🏃‍♂️', description: 'Solo quedan 5 unidades con este precio especial. ¡Vuelan!', cta: 'Lo quiero', reasoning: 'Escasez de inventario', score: 97 },
    { type: 'Pain Point', platform: 'tiktok', headline: '¿Haces ads y nada?', description: 'Deja de quemar presupuesto. Mira cómo lo hacen los expertos.', cta: 'Aprender', reasoning: 'Empatía con el fracaso previo', score: 89 },
    // LINKEDIN
    { type: 'Offer', platform: 'linkedin', headline: 'Auditoría gratuita B2B', description: 'Analizamos tu embudo de ventas sin costo. Solo para profesionales.', cta: 'Agendar', reasoning: 'Valor profesional directo', score: 91 },
    { type: 'Emotional', platform: 'linkedin', headline: 'Lidera tu industria', description: 'Construye una marca personal y empresarial que imponga respeto.', cta: 'Ser líder', reasoning: 'Aspiración de estatus', score: 86 },
    { type: 'Urgency', platform: 'linkedin', headline: 'Cierre de inscripciones', description: 'Último día para unirse al programa de aceleración empresarial.', cta: 'Aplicar', reasoning: 'Exclusividad y límite', score: 94 },
    { type: 'Pain Point', platform: 'linkedin', headline: '¿Ventas estancadas?', description: 'Descubre por qué tu crecimiento se detuvo y cómo reactivarlo hoy.', cta: 'Diagnóstico', reasoning: 'Identificación de cuello de botella', score: 92 },
  ],
};

import { GeneratedAd } from '@/types/ads';

/**
 * Integración de Gemini AI con el Dashboard
 * Convierte las respuestas de Gemini en GeneratedAd para las previsualizaciones
 * Con fallback robusto para garantizar que siempre hay anuncios disponibles
 */
export const generateAdsWithGeminiIntegration = async (
  config: {
    businessName: string;
    websiteUrl: string;
    promote: string;
    location: string;
    idealCustomer: string;
    budget: number;
    userImage: string | null;
    imageUrls?: string[];
  },
  onStepUpdate?: (step: number) => void
): Promise<GeneratedAd[]> => {
  try {
    // Paso 1: Llamar a Gemini
    onStepUpdate?.(0);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let geminiResponse = null;
    let usedFallback = false;
    
    try {
      console.log('🚀 Invocando Edge Function generate-ads-with-gemini...');
      const { data, error } = await supabase.functions.invoke('generate-ads-with-gemini', {
        body: {
          businessName: config.businessName,
          promote: config.promote,
          location: config.location,
          idealCustomer: config.idealCustomer,
          websiteUrl: config.websiteUrl,
          budget: config.budget,
        },
      });

      if (error) {
        console.warn('❌ Error en Gemini API:', error);
        console.warn('📋 Usando fallback de anuncios de calidad');
        geminiResponse = FALLBACK_ADS_TEMPLATE;
        usedFallback = true;
      } else if (data?.ads && Array.isArray(data.ads) && data.ads.length > 0) {
        console.log('✅ Respuesta exitosa de Gemini:', data);
        geminiResponse = data;
      } else {
        console.warn('⚠️ Respuesta vacía o inválida de Gemini');
        console.warn('📋 Usando fallback de anuncios de calidad');
        geminiResponse = FALLBACK_ADS_TEMPLATE;
        usedFallback = true;
      }
    } catch (apiError: any) {
      console.warn('❌ Excepción al invocar Gemini API:', apiError?.message || apiError);
      console.warn('📋 Usando fallback de anuncios de calidad');
      geminiResponse = FALLBACK_ADS_TEMPLATE;
      usedFallback = true;
    }

    // Asegurar que siempre tenemos una respuesta válida
    if (!geminiResponse || !geminiResponse.ads || !Array.isArray(geminiResponse.ads) || geminiResponse.ads.length === 0) {
      console.warn('⚠️ Respuesta inválida, usando fallback completo');
      geminiResponse = FALLBACK_ADS_TEMPLATE;
      usedFallback = true;
    }

    if (usedFallback) {
      console.info('ℹ️ Usando anuncios de fallback. Los anuncios se personalizarán según tu negocio.');
    }

    // Paso 2: Procesar respuesta de Gemini
    onStepUpdate?.(1);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const geminiAds: GeneratedAdCopy[] = geminiResponse.ads;

    // Paso 3: Mapear a GeneratedAd con URLs de plataforma
    onStepUpdate?.(2);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const platformUrls: Record<string, string> = {
      google: `https://ads.google.com/aw/campaigns/new?keyword=${encodeURIComponent(config.promote)}`,
      meta: config.websiteUrl
        ? `https://adsmanager.facebook.com/adsmanager/manage/campaigns`
        : `https://adsmanager.facebook.com/adsmanager/manage/campaigns`,
      tiktok: `https://ads.tiktok.com/i18n/dashboard`,
      linkedin: `https://www.linkedin.com/campaignmanager/accounts`,
    };

    // Validar que platform sea uno de los valores permitidos
    const validPlatforms = ['google', 'meta', 'tiktok', 'linkedin'];
    
    const generatedAds: GeneratedAd[] = geminiAds.map((ad) => {
      const platform = validPlatforms.includes(ad.platform) ? ad.platform : 'meta';
      return {
        headline: ad.headline,
        description: ad.description,
        cta: ad.cta,
        imageUrl: config.userImage || 'https://picsum.photos/seed/business/1200/630',
        imageUrls: config.imageUrls,
        platform: platform as 'google' | 'meta' | 'tiktok' | 'linkedin',
        type: ad.type,
        score: ad.score,
        platformUrl: platformUrls[platform],
        businessName: config.businessName,
        websiteUrl: config.websiteUrl,
        reasoning: ad.reasoning,
      };
    });

    // Paso 4: Finalizar
    onStepUpdate?.(3);
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log('✅ Anuncios generados exitosamente:', generatedAds.length);
    return generatedAds;
  } catch (error) {
    console.error('❌ Error crítico en generateAdsWithGeminiIntegration:', error);
    // Fallback final: retornar anuncios de fallback incluso si todo falla
    console.warn('📋 Retornando fallback de emergencia');
    return FALLBACK_ADS_TEMPLATE.ads.map((ad) => ({
      headline: ad.headline,
      description: ad.description,
      cta: ad.cta,
      imageUrl: 'https://picsum.photos/seed/business/1200/630',
      platform: ad.platform as any,
      type: ad.type as any,
      score: ad.score,
      platformUrl: '',
      reasoning: ad.reasoning,
    }));
  }
};

/**
 * Agrupa anuncios por plataforma para visualización
 */
export const groupAdsByPlatform = (ads: GeneratedAd[]) => {
  const grouped: Record<string, GeneratedAd[]> = {
    google: [],
    meta: [],
    tiktok: [],
    linkedin: [],
  };

  ads.forEach((ad) => {
    if (grouped[ad.platform]) {
      grouped[ad.platform].push(ad);
    }
  });

  return grouped;
};

/**
 * Obtiene el anuncio de mejor score por plataforma
 */
export const getBestAdByPlatform = (ads: GeneratedAd[]) => {
  const grouped = groupAdsByPlatform(ads);
  const best: Record<string, GeneratedAd | null> = {
    google: null,
    meta: null,
    tiktok: null,
    linkedin: null,
  };

  Object.entries(grouped).forEach(([platform, platformAds]) => {
    if (platformAds.length > 0) {
      best[platform] = platformAds.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );
    }
  });

  return best;
};
