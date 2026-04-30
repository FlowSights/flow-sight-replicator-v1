import React, { useState, useEffect } from 'react';
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
  Zap,
  Maximize2,
} from 'lucide-react';
import { Button } from './ui/button';
import { MetaPreview, GoogleAdsPreview, TikTokPreview, LinkedInPreview } from './PlatformPreviewsNative';
import { platformColors, PlatformIcon, platformNames } from './PlatformIcons';
import { AdContentLightbox } from './AdContentLightbox';

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
  selectedPlatform?: 'meta' | 'google' | 'tiktok' | 'linkedin';
  onPlatformChange?: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => void;
  onViewGuide: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => void;
  onDownloadPDF: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => void;
  onPublish: (platform: 'meta' | 'google' | 'tiktok' | 'linkedin', url: string) => void;
  onCheckout: () => void;
}

// Estilos dinámicos por plataforma
const platformThemes = {
  meta: {
    borderColor: 'border-blue-500/40',
    bgGradient: 'from-slate-900 via-blue-900/30 to-slate-900',
    shadowColor: 'shadow-blue-500/20',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    buttonShadow: 'shadow-blue-500/30',
    badgeBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    textAccent: 'text-blue-400',
    selectorBg: 'bg-slate-800 dark:bg-slate-700/50 border-slate-700 dark:border-slate-600',
    selectorActiveBg: 'bg-blue-600 border-blue-500 shadow-blue-500/40',
  },
  google: {
    borderColor: 'border-orange-500/40',
    bgGradient: 'from-slate-900 via-orange-900/30 to-slate-900',
    shadowColor: 'shadow-orange-500/20',
    buttonBg: 'bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700',
    buttonShadow: 'shadow-orange-500/30',
    badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
    textAccent: 'text-orange-400',
    selectorBg: 'bg-slate-800 dark:bg-slate-700/50 border-slate-700 dark:border-slate-600',
    selectorActiveBg: 'bg-gradient-to-r from-orange-500 to-blue-600 border-orange-500 shadow-orange-500/40',
  },
  tiktok: {
    borderColor: 'border-pink-500/40',
    bgGradient: 'from-slate-900 via-pink-900/20 to-slate-900',
    shadowColor: 'shadow-pink-500/20',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
    buttonShadow: 'shadow-pink-500/30',
    badgeBg: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
    textAccent: 'text-pink-400',
    selectorBg: 'bg-slate-800 dark:bg-slate-700/50 border-slate-700 dark:border-slate-600',
    selectorActiveBg: 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-500 shadow-pink-500/40',
  },
  linkedin: {
    borderColor: 'border-indigo-500/40',
    bgGradient: 'from-slate-900 via-indigo-900/30 to-slate-900',
    shadowColor: 'shadow-indigo-500/20',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    buttonShadow: 'shadow-indigo-500/30',
    badgeBg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
    textAccent: 'text-indigo-400',
    selectorBg: 'bg-slate-800 dark:bg-slate-700/50 border-slate-700 dark:border-slate-600',
    selectorActiveBg: 'bg-indigo-600 border-indigo-500 shadow-indigo-500/40',
  },
};

export const AdsResultsShowcase: React.FC<AdsResultsShowcaseProps> = ({
  ads,
  businessName,
  hasPaid,
  selectedPlatform: externalSelectedPlatform,
  onPlatformChange,
  onViewGuide,
  onDownloadPDF,
  onPublish,
  onCheckout,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [internalSelectedPlatform, setInternalSelectedPlatform] = useState<'meta' | 'google' | 'tiktok' | 'linkedin'>('meta');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const selectedPlatform = externalSelectedPlatform || internalSelectedPlatform;
  
  useEffect(() => {
    if (externalSelectedPlatform) {
      setInternalSelectedPlatform(externalSelectedPlatform);
      setCurrentIndex(0);
    }
  }, [externalSelectedPlatform]);

  const adsByPlatform = ads.reduce((acc, ad) => {
    if (!acc[ad.platform]) {
      acc[ad.platform] = [];
    }
    acc[ad.platform].push(ad);
    return acc;
  }, {} as Record<string, GeneratedAd[]>);

  const platformOrder: Array<'meta' | 'google' | 'tiktok' | 'linkedin'> = ['meta', 'google', 'tiktok', 'linkedin'];
  const platforms = platformOrder.filter(p => adsByPlatform[p]) as Array<'meta' | 'google' | 'tiktok' | 'linkedin'>;
  const currentAds = adsByPlatform[selectedPlatform] || [];
  const currentAd = currentAds[currentIndex] || currentAds[0];
  const theme = platformThemes[selectedPlatform];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentAds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentAds.length) % currentAds.length);
  };

  const handlePlatformChange = (platform: 'meta' | 'google' | 'tiktok' | 'linkedin') => {
    setInternalSelectedPlatform(platform);
    setCurrentIndex(0);
    if (onPlatformChange) {
      onPlatformChange(platform);
    }
  };

  if (!currentAd) {
    return null;
  }

  const colors = platformColors[selectedPlatform];

  return (
    <>
      <motion.div
        key={selectedPlatform}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`space-y-8 p-8 md:p-12 rounded-[3rem] border-2 ${theme.borderColor} bg-gradient-to-br ${theme.bgGradient} shadow-2xl ${theme.shadowColor} backdrop-blur-xl`}
      >
        {/* Selector de Plataformas - Optimización de alineación y orden */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {platformOrder.map((platform) => {
            const isSelected = selectedPlatform === platform;
            const hasAds = !!adsByPlatform[platform];
            const platformTheme = platformThemes[platform];
            
            return (
              <motion.button
                key={platform}
                whileHover={{ scale: hasAds ? 1.05 : 1 }}
                onClick={() => handlePlatformChange(platform)}
                disabled={!hasAds}
                className={`px-6 py-6 rounded-[1.5rem] font-bold transition-all flex flex-col items-center justify-center gap-3 border-2 ${
                  isSelected
                    ? platformTheme.selectorActiveBg
                    : platformTheme.selectorBg
                } ${!hasAds ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  <PlatformIcon platform={platform} size={32} className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold truncate">{platformNames[platform].split(' ')[0]}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Mockup Visual */}
          <div className="relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedPlatform}-${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10 flex justify-center"
              >
                {selectedPlatform === 'meta' && <MetaPreview {...currentAd} />}
                {selectedPlatform === 'google' && <GoogleAdsPreview {...currentAd} />}
                {selectedPlatform === 'tiktok' && <TikTokPreview {...currentAd} />}
                {selectedPlatform === 'linkedin' && <LinkedInPreview {...currentAd} />}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 z-20 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl text-gray-800 dark:text-white hover:scale-110 transition-all hover:bg-emerald-500 hover:text-white border border-black/5 dark:border-white/10"
              title="Ver en pantalla completa"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {currentAds.length > 1 && (
              <div className="absolute inset-y-0 -inset-x-4 flex items-center justify-between pointer-events-none z-20">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handlePrev}
                  className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl text-gray-800 dark:text-white pointer-events-auto hover:scale-110 transition-all border border-black/5 dark:border-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleNext}
                  className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl text-gray-800 dark:text-white pointer-events-auto hover:scale-110 transition-all border border-black/5 dark:border-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Información y Acciones */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-full ${theme.badgeBg} text-[10px] font-black uppercase tracking-[0.2em]`}>
                  Estrategia de {currentAd.type}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-sm">
                  <Sparkles className="w-4 h-4" />
                  {currentAd.score}/100
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Diseñado para <span className={theme.textAccent}>{platformNames[selectedPlatform]}</span>
              </h3>
              <p className="text-lg text-gray-300 font-medium leading-relaxed">
                {currentAd.reasoning || "Este anuncio ha sido optimizado por nuestra tecnología para maximizar el impacto y las conversiones en esta plataforma específica."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => onViewGuide(selectedPlatform)}
                variant="outline"
                className="h-20 rounded-[1.5rem] border-slate-600 dark:border-slate-500 font-black text-lg gap-3 bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-all"
              >
                <BookOpen className="w-5 h-5" /> Guía de Uso
              </Button>
              <Button
                onClick={() => onDownloadPDF(selectedPlatform)}
                className={`h-20 rounded-[1.5rem] ${theme.buttonBg} text-white font-black text-lg gap-3 shadow-2xl ${theme.buttonShadow} transition-all`}
              >
                {!hasPaid ? <Lock className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                Campaign Kit
              </Button>
              <Button
                onClick={() => onPublish(selectedPlatform, currentAd.platformUrl)}
                variant="outline"
                className="h-20 rounded-[1.5rem] border-slate-600 dark:border-slate-500 text-white font-black text-lg gap-3 sm:col-span-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 transition-all"
              >
                <ExternalLink className="w-5 h-5" /> Publicar Anuncio
              </Button>
            </div>

            {!hasPaid && (
              <div className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                  <Zap className="w-8 h-8 fill-white" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-black text-xl text-black dark:text-white tracking-tight">Obtén tu AI Kit Completo</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Desbloquea todos los activos y guías estratégicas hoy.</p>
                </div>
                <Button onClick={onCheckout} className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 px-8 shadow-lg shadow-emerald-500/20">
                  Desbloquear
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AdContentLightbox
        isOpen={lightboxOpen}
        imageUrl={currentAd?.imageUrl}
        headline={currentAd?.headline || ''}
        description={currentAd?.description || ''}
        platform={selectedPlatform}
        cta={currentAd?.cta || 'Más información'}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};
