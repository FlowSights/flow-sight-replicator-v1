import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, BookOpen, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PaymentModal } from '@/components/PaymentModal';
import { VisualGuideLightbox } from '@/components/VisualGuideLightbox';
import { GeneratedAd } from '@/types/ads';

interface MockupLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  ads: GeneratedAd[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  businessName: string;
  hasPaid: boolean;
  onPaymentRequired: () => void;
}

const platformColors: Record<string, { bg: string; text: string; accent: string; gradient: string }> = {
  meta: { bg: 'from-blue-600 to-blue-700', text: 'text-blue-600', accent: 'bg-blue-600', gradient: 'from-blue-500 to-blue-600' },
  google: { bg: 'from-red-500 to-yellow-500', text: 'text-red-500', accent: 'bg-red-500', gradient: 'from-red-500 via-yellow-500 to-blue-500' },
  tiktok: { bg: 'from-gray-900 to-black', text: 'text-black', accent: 'bg-black', gradient: 'from-black via-gray-900 to-pink-500' },
  linkedin: { bg: 'from-blue-700 to-blue-800', text: 'text-blue-700', accent: 'bg-blue-700', gradient: 'from-blue-600 to-blue-800' },
};

export const MockupLightbox: React.FC<MockupLightboxProps> = ({
  isOpen,
  onClose,
  ads,
  currentIndex,
  onPrevious,
  onNext,
  platform,
  businessName,
  hasPaid,
  onPaymentRequired,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [paymentAction, setPaymentAction] = useState<'download' | 'publish' | 'guide'>('download');

  if (!isOpen) return null;

  const currentAd = ads?.[currentIndex];
  const colors = platformColors[platform];

  if (!currentAd || !colors) return null;

  const handleActionClick = (action: 'download' | 'publish' | 'guide') => {
    if (!hasPaid) {
      setPaymentAction(action);
      setShowPaymentModal(true);
      return;
    }

    if (action === 'guide') {
      setShowGuideModal(true);
    } else if (action === 'publish') {
      const platformUrls: Record<string, string> = {
        meta: 'https://adsmanager.facebook.com/adsmanager/manage/campaigns',
        google: 'https://ads.google.com/aw/campaigns/new',
        tiktok: 'https://ads.tiktok.com/i18n/dashboard',
        linkedin: 'https://www.linkedin.com/campaignmanager/accounts',
      };
      window.open(platformUrls[platform], '_blank');
    } else if (action === 'download') {
      onPaymentRequired();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#0A0A0A] rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Premium */}
              <div className={`bg-gradient-to-r ${colors.gradient} p-8 flex justify-between items-center relative overflow-hidden`}>
                <div className="absolute top-0 right-0 text-9xl opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-white/80" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Vista Previa Premium</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{businessName}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all active:scale-95 backdrop-blur-md border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Contenido Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  
                  {/* Columna Izquierda: Mockup con Hover Scale */}
                  <div className="space-y-6">
                    <div className="relative group cursor-zoom-in rounded-[32px] overflow-hidden bg-gray-50 dark:bg-white/[0.03] p-8 border border-gray-100 dark:border-white/5">
                      <motion.div
                        className="w-full origin-center"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        {/* El Mockup Real */}
                        <div className={`bg-white dark:bg-[#111] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 mx-auto ${platform === 'tiktok' ? 'max-w-[320px]' : 'w-full'}`}>
                          {/* Simulación de anuncio */}
                          {platform === 'meta' && (
                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">F</div>
                                <div>
                                  <p className="font-bold text-sm dark:text-white">{businessName}</p>
                                  <p className="text-[10px] text-gray-500">Publicidad</p>
                                </div>
                              </div>
                              <p className="text-xs dark:text-gray-300 leading-relaxed">{currentAd.description}</p>
                              <div className="aspect-[1.91/1] bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                                <img src={currentAd.imageUrl} alt="Ad" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t dark:border-white/5">
                                <div className="flex-1">
                                  <p className="text-[10px] font-bold dark:text-white uppercase truncate">{currentAd.headline}</p>
                                  <p className="text-[9px] text-gray-500 truncate">{currentAd.websiteUrl}</p>
                                </div>
                                <button className="bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider dark:text-white">{currentAd.cta}</button>
                              </div>
                            </div>
                          )}

                          {platform === 'google' && (
                            <div className="p-6 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Patrocinado</span>
                                <span className="text-[10px] text-gray-400">• {currentAd.websiteUrl}</span>
                              </div>
                              <h3 className="text-xl font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{currentAd.headline}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{currentAd.description}</p>
                            </div>
                          )}

                          {platform === 'tiktok' && (
                            <div className="relative aspect-[9/16] bg-black text-white">
                              <img src={currentAd.imageUrl} alt="TikTok" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                              <div className="absolute bottom-0 left-0 p-4 w-full space-y-3">
                                <p className="font-bold text-sm">@{businessName.toLowerCase().replace(/\s/g, '')}</p>
                                <p className="text-xs line-clamp-3">{currentAd.description}</p>
                                <div className="bg-pink-500 py-3 rounded-lg text-center font-black text-xs uppercase tracking-widest">{currentAd.cta}</div>
                              </div>
                              <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-500" />
                                <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 bg-white/20 rounded-full" /><span className="text-[10px]">24.5K</span></div>
                                <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 bg-white/20 rounded-full" /><span className="text-[10px]">1,203</span></div>
                                <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 bg-white/20 rounded-full" /><span className="text-[10px]">856</span></div>
                              </div>
                            </div>
                          )}

                          {platform === 'linkedin' && (
                            <div className="p-5 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-700 rounded flex items-center justify-center text-white font-bold">in</div>
                                <div>
                                  <p className="font-bold text-sm dark:text-white">{businessName}</p>
                                  <p className="text-[10px] text-gray-500">Promocionado</p>
                                </div>
                              </div>
                              <p className="text-xs dark:text-gray-300 leading-relaxed">{currentAd.description}</p>
                              <div className="aspect-[1.91/1] bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border dark:border-white/5">
                                <img src={currentAd.imageUrl} alt="Ad" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-bold dark:text-white">{currentAd.headline}</p>
                                <button className="border-2 border-blue-700 text-blue-700 dark:text-blue-400 dark:border-blue-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors">{currentAd.cta}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Maximize2 size={16} />
                      </div>
                    </div>

                    {/* Navegación */}
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={onPrevious}
                        className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all"
                      >
                        <ChevronLeft size={20} className="dark:text-white" />
                      </button>
                      <div className="flex-1 text-center">
                        <p className="text-sm font-black dark:text-gray-400">Variante {currentIndex + 1} de {ads.length}</p>
                      </div>
                      <button
                        onClick={onNext}
                        className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all"
                      >
                        <ChevronRight size={20} className="dark:text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Columna Derecha: Contenido */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-black dark:text-white mb-4">Detalles del Anuncio</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Titular</label>
                          <p className="text-lg font-bold dark:text-white mt-1">{currentAd.headline}</p>
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Descripción</label>
                          <p className="text-sm dark:text-gray-300 mt-1 leading-relaxed">{currentAd.description}</p>
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">CTA</label>
                          <p className="text-sm font-bold dark:text-white mt-1">{currentAd.cta}</p>
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Score</label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500" style={{ width: `${currentAd.score}%` }} />
                            </div>
                            <span className="text-sm font-black dark:text-white">{currentAd.score}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleActionClick('guide')}
                        className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 font-black text-sm uppercase tracking-wider dark:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <BookOpen size={16} />
                        Guía Visual
                      </button>
                      <button
                        onClick={() => handleActionClick('download')}
                        className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 font-black text-sm uppercase tracking-wider dark:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Descargar Kit
                      </button>
                      <button
                        onClick={() => handleActionClick('publish')}
                        className={`w-full py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          hasPaid
                            ? `bg-gradient-to-r ${colors.gradient} text-white border border-white/20`
                            : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 dark:text-white'
                        }`}
                      >
                        <Share2 size={16} />
                        Publicar en {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          action={paymentAction}
        />
      )}
      {showGuideModal && (
        <VisualGuideLightbox
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          platform={platform}
        />
      )}
    </>
  );
};
