import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  BookOpen,
  FileText,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from './ui/button';
import { MetaPreview, GoogleAdsPreview, TikTokPreview, LinkedInPreview } from './PlatformPreviewsNative';

interface GeneratedAd {
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

interface AdsResultsShowcaseProps {
  ads: GeneratedAd[];
  businessName: string;
  hasPaid: boolean;
  onViewGuide: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => void;
  onDownloadPDF: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => void;
  onPublish: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin', url: string) => void;
  onCheckout: () => void;
}

const platformConfig: Record<string, { name: string; color: string; icon: string }> = {
  meta: { name: 'Meta Ads', color: 'from-blue-600 to-blue-400', icon: '📱' },
  google: { name: 'Google Ads', color: 'from-red-500 to-yellow-500', icon: '🔍' },
  tiktok: { name: 'TikTok Ads', color: 'from-gray-900 to-black', icon: '🎵' },
  linkedin: { name: 'LinkedIn Ads', color: 'from-blue-700 to-blue-500', icon: '💼' },
};

export const AdsResultsShowcase: React.FC<AdsResultsShowcaseProps> = ({
  ads,
  businessName,
  hasPaid,
  onViewGuide,
  onDownloadPDF,
  onPublish,
  onCheckout,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'meta' | 'google' | 'tiktok' | 'linkedin'>('meta');

  // Agrupar anuncios por plataforma
  const adsByPlatform = ads.reduce((acc, ad) => {
    if (!acc[ad.platform]) {
      acc[ad.platform] = [];
    }
    acc[ad.platform].push(ad);
    return acc;
  }, {} as Record<string, GeneratedAd[]>);

  const platforms = Object.keys(adsByPlatform) as Array<'meta' | 'google' | 'tiktok' | 'linkedin'>;
  const currentAds = adsByPlatform[selectedPlatform] || [];
  const currentAd = currentAds[currentIndex] || currentAds[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentAds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentAds.length) % currentAds.length);
  };

  const handlePlatformChange = (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => {
    setSelectedPlatform(platform);
    setCurrentIndex(0);
  };

  if (!currentAd) {
    return null;
  }

  const config = platformConfig[selectedPlatform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Selector de Plataformas */}
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformChange(platform)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              selectedPlatform === platform
                ? `bg-gradient-to-r ${config.color} text-white shadow-lg shadow-emerald-500/30`
                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {platformConfig[platform].icon} {platformConfig[platform].name}
          </button>
        ))}
      </div>

      {/* Mockup Principal */}
      <motion.div
        key={`${selectedPlatform}-${currentIndex}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative"
      >
        <div className="flex justify-center">
          {selectedPlatform === 'meta' && (
            <MetaPreview
              headline={currentAd.headline}
              description={currentAd.description}
              cta={currentAd.cta}
              imageUrl={currentAd.imageUrl}
              businessName={businessName}
              websiteUrl={currentAd.websiteUrl}
            />
          )}
          {selectedPlatform === 'google' && (
            <GoogleAdsPreview
              headline={currentAd.headline}
              description={currentAd.description}
              cta={currentAd.cta}
              imageUrl={currentAd.imageUrl}
              businessName={businessName}
              websiteUrl={currentAd.websiteUrl}
            />
          )}
          {selectedPlatform === 'tiktok' && (
            <TikTokPreview
              headline={currentAd.headline}
              description={currentAd.description}
              cta={currentAd.cta}
              imageUrl={currentAd.imageUrl}
              businessName={businessName}
            />
          )}
          {selectedPlatform === 'linkedin' && (
            <LinkedInPreview
              headline={currentAd.headline}
              description={currentAd.description}
              cta={currentAd.cta}
              imageUrl={currentAd.imageUrl}
              businessName={businessName}
            />
          )}
        </div>

        {/* Navegación de Anuncios */}
        {currentAds.length > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentIndex + 1} de {currentAds.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Información del Anuncio */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
              currentAd.type === 'Offer' ? 'from-emerald-500 to-teal-500' :
              currentAd.type === 'Emotional' ? 'from-purple-500 to-pink-500' :
              'from-red-500 to-orange-500'
            }`}>
              {currentAd.type === 'Offer' ? 'OFERTA' : currentAd.type === 'Emotional' ? 'EMOCIONAL' : 'URGENCIA'}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Puntuación: <span className="text-emerald-500 font-bold">{currentAd.score}/100</span>
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {currentAd.reasoning || 'Optimizado para máxima conversión'}
        </p>
      </motion.div>

      {/* Botones de Acción */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Botón Guía Visual */}
        <Button
          onClick={() => onViewGuide(selectedPlatform)}
          variant="outline"
          className="h-12 gap-2 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/5 text-gray-900 dark:text-white font-bold"
        >
          <Eye className="w-4 h-4" />
          Guía Visual
        </Button>

        {/* Botón Publicar */}
        <Button
          onClick={() => {
            if (hasPaid) {
              onPublish(selectedPlatform, currentAd.platformUrl);
            } else {
              onCheckout();
            }
          }}
          className="h-12 gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30"
        >
          {!hasPaid && <Lock className="w-4 h-4" />}
          <ExternalLink className="w-4 h-4" />
          {hasPaid ? 'Publicar Ahora' : 'Publicar (Pago)'}
        </Button>

        {/* Botón Descargar PDF */}
        <Button
          onClick={() => {
            if (hasPaid) {
              onDownloadPDF(selectedPlatform);
            } else {
              onCheckout();
            }
          }}
          variant="outline"
          className="h-12 gap-2 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/5 text-gray-900 dark:text-white font-bold"
        >
          {!hasPaid && <Lock className="w-4 h-4" />}
          <FileText className="w-4 h-4" />
          {hasPaid ? 'Descargar Kit' : 'Kit (Pago)'}
        </Button>
      </motion.div>

      {/* Mensaje de Bloqueo */}
      {!hasPaid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3"
        >
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">
              Acceso Premium Requerido
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              Realiza el checkout para acceder a todas las funciones: publicar directamente, descargar kits premium y guías visuales.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
