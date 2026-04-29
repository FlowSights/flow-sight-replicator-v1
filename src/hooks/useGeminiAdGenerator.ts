import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export interface GeneratedAdCopy {
  type: 'Offer' | 'Emotional' | 'Urgency';
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  headline: string;
  description: string;
  cta: string;
  reasoning: string;
  score: number;
}

export interface GenerateAdsRequest {
  businessName: string;
  promote: string;
  location: string;
  idealCustomer: string;
  websiteUrl: string;
  budget: number;
}

export const useGeminiAdGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAds = async (request: GenerateAdsRequest): Promise<GeneratedAdCopy[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'generate-ads-with-gemini',
        {
          body: request,
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data?.ads || data.ads.length === 0) {
        throw new Error('No se generaron anuncios');
      }

      toast({
        title: '✨ Anuncios generados',
        description: `Se generaron ${data.ads.length} anuncios con IA. ¡Listos para tu estrategia!`,
      });

      return data.ads;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al generar los anuncios';
      setError(errorMessage);
      toast({
        title: 'Error al generar anuncios',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateAds, loading, error };
};
