import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const platformColors: Record<string, { bg: string; text: string; accent: string }> = {
  meta: { bg: 'from-blue-600 to-blue-700', text: 'text-blue-600', accent: 'bg-blue-600' },
  google: { bg: 'from-red-500 to-yellow-500', text: 'text-red-500', accent: 'bg-red-500' },
  tiktok: { bg: 'from-black to-pink-600', text: 'text-black', accent: 'bg-black' },
  linkedin: { bg: 'from-blue-700 to-blue-800', text: 'text-blue-700', accent: 'bg-blue-700' },
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

  const currentAd = ads[currentIndex];
  const colors = platformColors[platform];

  if (!currentAd) return null;

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
        meta: 'https://ads.facebook.com/',
        google: 'https://ads.google.com/',
        tiktok: 'https://ads.tiktok.com/',
        linkedin: 'https://www.linkedin.com/campaignmanager/',
      };
      window.open(platformUrls[platform], '_blank');
    } else if (action === 'download') {
      // Trigger download
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con cierre */}
              <div className={`bg-gradient-to-r ${colors.bg} p-6 flex justify-between items-center sticky top-0 z-10`}>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{businessName}</h2>
                  <p className="text-white/80 text-sm">Previsualización de Anuncio</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Contenido Principal */}
              <div className="p-8">
                {/* Mockup Grande */}
                <div className="mb-8 flex justify-center">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 shadow-lg max-w-2xl w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                      {/* Simulación de anuncio según plataforma */}
                      {platform === 'meta' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-3 border-b">
                            <div className="w-10 h-10 bg-blue-600 rounded-full" />
                            <div>
                              <p className="font-bold text-sm">{businessName}</p>
                              <p className="text-xs text-gray-500">2 horas</p>
                            </div>
                          </div>
                          <p className="text-sm">{currentAd.description}</p>
                          <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Imagen del Anuncio</span>
                          </div>
                          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm">
                            {currentAd.cta}
                          </button>
                        </div>
                      )}

                      {platform === 'google' && (
                        <div className="space-y-2">
                          <div className="text-xs text-green-600 font-semibold">ads.google.com</div>
                          <h3 className="font-bold text-lg text-blue-600">{currentAd.headline}</h3>
                          <p className="text-sm text-gray-700">{currentAd.description}</p>
                          <div className="text-xs text-green-600">{businessName}</div>
                        </div>
                      )}

                      {platform === 'tiktok' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black rounded-full" />
                            <p className="font-bold text-sm">{businessName}</p>
                          </div>
                          <p className="text-sm">{currentAd.description}</p>
                          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Video/Imagen</span>
                          </div>
                          <div className="flex gap-4 text-xs">
                            <span>❤️ Me gusta</span>
                            <span>💬 Comentar</span>
                            <span>↗️ Compartir</span>
                          </div>
                        </div>
                      )}

                      {platform === 'linkedin' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-700 rounded-full" />
                            <div>
                              <p className="font-bold text-sm">{businessName}</p>
                              <p className="text-xs text-gray-500">Empresa</p>
                            </div>
                          </div>
                          <p className="text-sm">{currentAd.description}</p>
                          <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm">
                            {currentAd.cta}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información del Anuncio */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${colors.bg} text-white`}>
                    <p className="text-xs opacity-90">Tipo de Anuncio</p>
                    <p className="text-lg font-bold">{currentAd.type}</p>
                  </div>
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${colors.bg} text-white`}>
                    <p className="text-xs opacity-90">Puntuación</p>
                    <p className="text-lg font-bold">{currentAd.score}/100</p>
                  </div>
                </div>

                {/* Razonamiento */}
                <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">¿Por qué este anuncio?</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{currentAd.reasoning}</p>
                </div>

                {/* Navegación y Acciones */}
                <div className="flex flex-col gap-4">
                  {/* Navegación entre anuncios */}
                  {ads.length > 1 && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={onPrevious}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentIndex + 1} de {ads.length}
                      </p>
                      <button
                        onClick={onNext}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}

                  {/* Botones de Acción */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleActionClick('guide')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${
                        hasPaid
                          ? 'bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-slate-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 opacity-60'
                      }`}
                    >
                      <BookOpen size={18} />
                      <span className="hidden sm:inline">Guía</span>
                    </button>
                    <button
                      onClick={() => handleActionClick('publish')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${
                        hasPaid
                          ? `bg-gradient-to-r ${colors.bg} text-white hover:shadow-lg`
                          : `bg-gradient-to-r ${colors.bg} text-white opacity-60`
                      }`}
                    >
                      <Share2 size={18} />
                      <span className="hidden sm:inline">Publicar</span>
                    </button>
                    <button
                      onClick={() => handleActionClick('download')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${
                        hasPaid
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-green-600 text-white opacity-60'
                      }`}
                    >
                      <Download size={18} />
                      <span className="hidden sm:inline">Descargar</span>
                    </button>
                  </div>

                  {!hasPaid && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 py-2">
                      Desbloquea todas las funciones con acceso premium
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        businessName={businessName}
        action={paymentAction}
      />

      <VisualGuideLightbox
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        platform={platform}
      />
    </>
  );
};
