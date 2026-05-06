import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, BookOpen, Maximize2, Sparkles, CheckCircle2, Loader2, Zap, Rocket, Check, ChevronDown, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PaymentModal } from '@/components/PaymentModal';
import { VisualGuideLightbox } from '@/components/VisualGuideLightbox';
import { GeneratedAd } from '@/types/ads';
import { MetaPreview, GoogleAdsPreview, TikTokPreview, LinkedInPreview } from './PlatformPreviewsNative';
import { metaApi, META_CONFIG } from '@/lib/meta-api';
import { toast } from 'sonner';

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
  meta: { bg: 'from-blue-600 to-blue-700', text: 'text-blue-600', accent: 'bg-blue-600', gradient: 'from-[#0668E1] to-[#0047AB]' },
  google: { bg: 'from-red-500 to-yellow-500', text: 'text-red-500', accent: 'bg-red-500', gradient: 'from-[#4285F4] via-[#EA4335] to-[#FBBC05]' },
  tiktok: { bg: 'from-gray-900 to-black', text: 'text-[#FE2C55]', accent: 'bg-[#FE2C55]', gradient: 'from-black via-[#121212] to-[#FE2C55]' },
  linkedin: { bg: 'from-blue-700 to-blue-800', text: 'text-blue-700', accent: 'bg-[#0077B5]', gradient: 'from-[#0077B5] to-[#004182]' },
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
  const [showPublishAssistant, setShowPublishAssistant] = useState(false);
  const [paymentAction, setPaymentAction] = useState<'download' | 'publish' | 'guide'>('download');
  const [isCopied, setIsCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);

  if (!isOpen) return null;

  const currentAd = ads?.[currentIndex];
  const colors = platformColors[platform];

  if (!currentAd || !colors) return null;

  const handleActionClick = async (action: 'download' | 'publish' | 'guide') => {
    if (!hasPaid) {
      setPaymentAction(action);
      setShowPaymentModal(true);
      return;
    }

    if (action === 'guide') {
      setShowGuideModal(true);
    } else if (action === 'publish') {
      // MODO HÍBRIDO TEMPORAL: Usar flujo manual con UI de IA mientras se verifica Meta
      // Para activar API real, descomentar el bloque siguiente y comentar la sección de "Copia Inteligente"
      
      /*
      const metaToken = META_CONFIG.accessToken;
      const adAccountId = META_CONFIG.adAccountId;

      // Si tenemos API de Meta configurada y es Meta, publicar directo
      if (platform === 'meta' && metaToken && adAccountId) {
        setIsPublishing(true);
        const publishToast = toast.loading('Publicando anuncio en Meta...');
        
        try {
          // 1. Subir Imagen a Meta
          const imageHash = await metaApi.uploadImage(metaToken, adAccountId, currentAd.imageUrl);
          
          // 2. Crear Ad Creative
          const creativeId = await metaApi.createAdCreative(metaToken, adAccountId, {
            name: currentAd.headline,
            imageHash: imageHash,
            headline: currentAd.headline,
            body: currentAd.description,
            link: currentAd.websiteUrl || 'https://flowsights.it',
            callToAction: currentAd.cta,
          });

          toast.success('¡Anuncio publicado como borrador en Meta!', { id: publishToast });
          setShowPublishAssistant(true);
        } catch (error: any) {
          console.error('Meta Publish Error:', error);
          toast.error(`Error al publicar: ${error.message}`, { id: publishToast });
        } finally {
          setIsPublishing(false);
        }
        return;
      }
      */

      // Copia Inteligente: Copiar descripción al portapapeles automáticamente
      try {
        await navigator.clipboard.writeText(currentAd.description);
        setIsCopied(true);
        setShowPublishAssistant(true); // Mostrar el asistente de pasos
        setTimeout(() => setIsCopied(false), 3000);
      } catch (err) {
        console.error('Error copying text:', err);
      }

      const platformUrls: Record<string, string> = {
        meta: 'https://business.facebook.com/latest/composer', // Más directo para subir contenido
        google: 'https://ads.google.com/aw/campaigns/new',
        tiktok: 'https://ads.tiktok.com/i18n/campaign/create',
        linkedin: 'https://www.linkedin.com/campaignmanager/accounts',
      };
      
      // Abrir en nueva pestaña
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
            className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white dark:bg-[#080808] rounded-[48px] shadow-[0_0_120px_rgba(0,0,0,0.8)] max-w-7xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Premium con Gradiente Dinámico */}
              <div className={`bg-gradient-to-r ${colors.gradient} p-8 lg:p-10 flex justify-between items-center relative overflow-hidden`}>
                <div className="absolute top-0 right-0 text-9xl opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                  <Sparkles size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1 bg-white/20 rounded-lg backdrop-blur-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Vista Previa Premium</span>
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{businessName}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-[24px] transition-all active:scale-90 backdrop-blur-xl border border-white/20 shadow-xl"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Contenido Principal */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#080808]">
                <div className="p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
                  
                  {/* Columna Izquierda: Mockup Optmizado */}
                  <div className="space-y-8">
                    <div className="relative group rounded-[40px] overflow-hidden bg-white/[0.02] p-8 md:p-12 border border-white/5 shadow-inner">
                      <motion.div
                        className="w-full origin-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {/* Mockups por Plataforma con componentes nativos */}
                        <div className={`mx-auto ${platform === 'tiktok' ? 'max-w-[340px]' : 'w-full'}`}>
                          {platform === 'meta' && (
                            <MetaPreview 
                              headline={currentAd.headline}
                              description={currentAd.description}
                              cta={currentAd.cta}
                              imageUrl={currentAd.imageUrl}
                              imageUrls={currentAd.imageUrls}
                              businessName={businessName}
                              websiteUrl={currentAd.websiteUrl}
                              platform="meta"
                            />
                          )}

                          {platform === 'google' && (
                            <GoogleAdsPreview 
                              headline={currentAd.headline}
                              description={currentAd.description}
                              cta={currentAd.cta}
                              imageUrl={currentAd.imageUrl}
                              platform="google"
                              businessName={businessName}
                              websiteUrl={currentAd.websiteUrl}
                            />
                          )}

                          {platform === 'tiktok' && (
                            <TikTokPreview 
                              headline={currentAd.headline}
                              description={currentAd.description}
                              cta={currentAd.cta}
                              imageUrl={currentAd.imageUrl}
                              platform="tiktok"
                              businessName={businessName}
                            />
                          )}

                          {platform === 'linkedin' && (
                            <LinkedInPreview 
                              headline={currentAd.headline}
                              description={currentAd.description}
                              cta={currentAd.cta}
                              imageUrl={currentAd.imageUrl}
                              imageUrls={currentAd.imageUrls}
                              platform="linkedin"
                              businessName={businessName}
                            />
                          )}
                        </div>

                      </motion.div>
                    </div>

                    {/* Navegación Variante */}
                    <div className="flex items-center justify-between gap-6 px-4">
                      <button
                        onClick={onPrevious}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90 group"
                      >
                        <ChevronLeft size={24} className="text-white group-hover:-translate-x-1 transition-transform" />
                      </button>
                      <div className="flex-1 py-4 bg-white/5 rounded-2xl border border-white/5 text-center backdrop-blur-md">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Estrategia Activa</p>
                        <p className="text-lg font-black text-white">Variante {currentIndex + 1} de {ads.length}</p>
                      </div>
                      <button
                        onClick={onNext}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90 group"
                      >
                        <ChevronRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Columna Derecha: Contenido y Acciones */}
                  <div className={`space-y-12 relative transition-all duration-500 ${!hasPaid ? 'blur-md pointer-events-none grayscale opacity-40 select-none' : ''}`}>
                     {!hasPaid && (
                       <div className="absolute inset-0 z-[70] flex items-center justify-center">
                         {/* Bloqueo de interacción */}
                       </div>
                     )}
                    <div className="space-y-10">
                      <div className="flex items-center gap-4">
                        <Badge className={`px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl ${colors.accent} text-white border-none`}>
                          {platform} Campaign
                        </Badge>
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                          <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-black text-yellow-500 tracking-wider">{currentAd.score}/100 SCORE</span>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block">Titular del Anuncio</label>
                          <p className="text-2xl font-black text-white tracking-tight leading-tight">{currentAd.headline}</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block">Descripción (Ad Copy)</label>
                          <p className="text-lg text-gray-400 font-medium leading-relaxed">{currentAd.description}</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block">Llamada a la Acción (CTA)</label>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 font-black text-white uppercase tracking-widest text-xs">
                            {currentAd.cta}
                          </div>
                        </div>

                        {/* BLOQUE 5: VARIACIÓN — Copy alternativo */}
                        {ads.length > 1 && (
                          <div className="pt-4">
                            <button 
                              onClick={() => setShowAlternative(!showAlternative)}
                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <ChevronDown className={`w-3 h-3 transition-transform ${showAlternative ? 'rotate-180' : ''}`} />
                              Ver versión alternativa del anuncio
                            </button>
                            
                            <AnimatePresence>
                              {showAlternative && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                    {ads.map((ad, idx) => idx !== currentIndex && (
                                      <div key={idx} className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Variante {idx + 1}</p>
                                        <p className="text-sm text-gray-400 leading-relaxed italic">"{ad.description}"</p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BLOQUE 3: Cómo usar este campaign kit */}
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Cómo usar este kit</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Copia el texto generado",
                          "Usa el contenido visual recomendado",
                          "Accede al Ads Manager",
                          "Publica tu campaña"
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-3 group">
                            <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                              <Check className="w-3 h-3 text-emerald-500 opacity-50 group-hover:opacity-100" />
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sistema de Botones Premium con Colores de Plataforma */}
                    <div className="space-y-4 pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleActionClick('guide')}
                          className="py-5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-black text-[11px] uppercase tracking-widest text-gray-300 hover:text-white transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-xl"
                        >
                          <BookOpen size={18} />
                          Guía Visual
                        </button>
                        <button
                          onClick={() => handleActionClick('download')}
                          className="py-5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-black text-[11px] uppercase tracking-widest text-gray-300 hover:text-white transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-xl"
                        >
                          <Download size={18} />
                          Descargar Kit
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleActionClick('publish')}
                        disabled={isPublishing}
                        className={`w-full py-7 px-8 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 relative overflow-hidden shadow-2xl group ${
                          hasPaid
                            ? `bg-gradient-to-r ${colors.gradient} text-white border border-white/20`
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                        } ${isPublishing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {hasPaid && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Publicando en Meta...</span>
                          </>
                        ) : platform === 'meta' && META_CONFIG.accessToken && META_CONFIG.adAccountId ? (
                          <>
                            <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                            <span>Publicar con IA en Meta</span>
                          </>
                        ) : isCopied ? (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-3 text-emerald-400"
                          >
                            <CheckCircle2 size={20} className="animate-bounce" />
                            <span>¡Copiado al Portapapeles!</span>
                          </motion.div>
                        ) : (
                           <>
                             <div className="flex flex-col items-center">
                               <div className="flex items-center gap-3 relative z-10">
                                 <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                                 <span>Lanzar mi campaña ahora</span>
                               </div>
                               <span className="text-[9px] font-bold text-white/50 tracking-widest mt-1 lowercase">Te tomará menos de 5 minutos</span>
                             </div>
                           </>
                        )}
                      </button>
                    </div>
                  </div>
                   
                   {!hasPaid && (
                     <div className="lg:absolute lg:top-1/2 lg:right-0 lg:-translate-y-1/2 lg:w-[45%] z-[80] p-8">
                       <motion.div 
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="bg-emerald-500 rounded-[40px] p-10 md:p-14 shadow-[0_20px_100px_-15px_rgba(16,185,129,0.7)] text-black text-center space-y-8 border border-white/30"
                       >
                         <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                           <Lock className="w-10 h-10 text-emerald-500" />
                         </div>
                         <div className="space-y-3">
                           <h3 className="text-4xl font-black tracking-tight leading-tight uppercase italic">Estrategia Bloqueada</h3>
                           <p className="font-bold text-black/80 text-xl leading-relaxed">
                             Desbloquea este anuncio para obtener el <span className="underline decoration-black/40">copy maestro</span> y los <span className="underline decoration-black/40">activos premium</span>.
                           </p>
                         </div>
                         <Button 
                           onClick={() => setShowPaymentModal(true)}
                           className="w-full py-9 text-2xl font-black bg-black hover:bg-black/90 text-emerald-500 rounded-[28px] shadow-2xl transition-all active:scale-[0.98] group flex items-center justify-center gap-4"
                         >
                           DESBLOQUEAR — $49.99
                           <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                         </Button>
                         <div className="flex items-center justify-center gap-3 opacity-60">
                           <ShieldCheck className="w-4 h-4" />
                           <span className="text-xs font-black uppercase tracking-widest">Pago Seguro por Stripe</span>
                         </div>
                       </motion.div>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales Relacionados */}
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

      {/* Asistente de Publicación Inteligente */}
      <AnimatePresence>
        {showPublishAssistant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-12 right-12 z-[200] max-w-sm w-full"
          >
            <div className="bg-white dark:bg-[#121212] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden backdrop-blur-xl">
              <div className={`p-6 bg-gradient-to-r ${colors.gradient} flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  <h4 className="text-white font-black text-sm uppercase tracking-widest">Asistente de Publicación</h4>
                </div>
                <button onClick={() => setShowPublishAssistant(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm dark:text-gray-300"><b>¡Copy listo!</b> El texto del anuncio ya está en tu portapapeles. Solo dale <b>Pegar (Ctrl+V)</b> en la plataforma.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm dark:text-gray-300">Sube la imagen o video que descargaste de <b>Flowsight</b>.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm dark:text-gray-300">Configura tu presupuesto y audiencia en {platform} y dale a <b>Publicar</b>.</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowPublishAssistant(false)}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-xl"
                >
                  Entendido, ¡gracias!
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
