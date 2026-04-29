import { supabase } from '@/lib/supabaseClient';
import { GeneratedAdCopy } from '@/hooks/useGeminiAdGenerator';

export interface GeneratedAd {
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  type: 'Offer' | 'Emotional' | 'Urgency';
  score: number;
  platformUrl: string;
  businessName?: string;
  websiteUrl?: string;
  reasoning?: string;
}

/**
 * Integración de Gemini AI con el Dashboard
 * Convierte las respuestas de Gemini en GeneratedAd para las previsualizaciones
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
  },
  onStepUpdate?: (step: number) => void
): Promise<GeneratedAd[]> => {
  try {
    // Paso 1: Llamar a Gemini
    onStepUpdate?.(0);
    await new Promise((resolve) => setTimeout(resolve, 500));

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

    if (error || !data?.ads) {
      throw new Error('No se pudo generar los anuncios con IA');
    }

    // Paso 2: Procesar respuesta de Gemini
    onStepUpdate?.(1);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const geminiAds: GeneratedAdCopy[] = data.ads;

    // Paso 3: Mapear a GeneratedAd con URLs de plataforma
    onStepUpdate?.(2);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const platformUrls: Record<string, string> = {
      google: `https://ads.google.com/aw/campaigns/new?keyword=${encodeURIComponent(config.promote)}`,
      meta: config.websiteUrl
        ? `https://adsmanager.facebook.com/adsmanager/manage/campaigns`
        : `https://adsmanager.facebook.com/adsmanager/manage/campaigns`,
      tiktok: `https://ads.tiktok.com/i18n/dashboard`,
      linkedin: `https://www.linkedin.com/campaignmanager/accounts`,
    };

    const generatedAds: GeneratedAd[] = geminiAds.map((ad) => ({
      headline: ad.headline,
      description: ad.description,
      cta: ad.cta,
      imageUrl: config.userImage || 'https://picsum.photos/seed/business/1200/630',
      platform: ad.platform,
      type: ad.type,
      score: ad.score,
      platformUrl: platformUrls[ad.platform],
      businessName: config.businessName,
      websiteUrl: config.websiteUrl,
      reasoning: ad.reasoning,
    }));

    // Paso 4: Finalizar
    onStepUpdate?.(3);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return generatedAds;
  } catch (error) {
    console.error('Error en generateAdsWithGeminiIntegration:', error);
    throw error;
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
