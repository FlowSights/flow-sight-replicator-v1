import React, { useState } from 'react';
import { 
  Download, 
  BarChart3, 
  Zap, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Target, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Layout,
  Globe,
  DollarSign,
  ShieldCheck,
  Eye,
  BookOpen,
  ExternalLink,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { MetaPreview, GoogleAdsPreview, TikTokPreview, LinkedInPreview } from './PlatformPreviewsNative';
import { platformColors, PlatformIcon, platformNames } from './PlatformIcons';

interface Ad {
  headline: string;
  description: string;
  cta: string;
  platform: string;
  score: number;
  imageUrl?: string;
  type?: string;
  reasoning?: string;
  businessName?: string;
  websiteUrl?: string;
}

interface ClientDashboardProps {
  businessName: string;
  generatedAds: Ad[];
  budget: number;
  location: string;
  createdAt: Date;
  hasPaid: boolean;
  onDownloadKit: () => void;
  onDownloadGuide: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  businessName,
  generatedAds,
  budget,
  location,
  createdAt,
  hasPaid,
  onDownloadKit,
  onDownloadGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'analytics'>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<'meta' | 'google' | 'tiktok' | 'linkedin'>('meta');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const platformCount = {
    meta: generatedAds.filter((ad) => ad.platform === 'meta').length,
    google: generatedAds.filter((ad) => ad.platform === 'google').length,
    tiktok: generatedAds.filter((ad) => ad.platform === 'tiktok').length,
    linkedin: generatedAds.filter((ad) => ad.platform === 'linkedin').length,
  };

  const avgScore =
    generatedAds.length > 0
      ? Math.round(
          generatedAds.reduce((sum, ad) => sum + ad.score, 0) / generatedAds.length
        )
      : 0;

  // Agrupar anuncios por plataforma
  const adsByPlatform = generatedAds.reduce((acc, ad) => {
    if (!acc[ad.platform]) {
      acc[ad.platform] = [];
    }
    acc[ad.platform].push(ad);
    return acc;
  }, {} as Record<string, Ad[]>);

  const platformOrder: Array<'meta' | 'google' | 'tiktok' | 'linkedin'> = ['meta', 'google', 'tiktok', 'linkedin'];
  const platforms = platformOrder.filter(p => adsByPlatform[p]) as Array<'meta' | 'google' | 'tiktok' | 'linkedin'>;
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

  const colors = platformColors[selectedPlatform];

  return (
    <div className="space-y-10">
      {/* Premium Header Section - Glassmorphism optimized for Light/Dark */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-10 shadow-2xl shadow-black/5 backdrop-blur-3xl"
      >
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-[0.3em]">Campaña Optimizada</span>
            </div>
            <h1 className="text-5xl font-black text-black dark:text-white tracking-tight">{businessName}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Tu Campaign Kit está listo para generar resultados</p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { icon: Globe, label: location },
                { icon: DollarSign, label: `$${budget} USD` },
                { icon: Calendar, label: createdAt.toLocaleDateString('es-ES') },
                { icon: Layout, label: `${generatedAds.length} Anuncios` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <item.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[180px]">
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-widest mb-1">Calidad Global</p>
              <p className="text-5xl font-black text-black dark:text-white">{avgScore}<span className="text-2xl text-emerald-600/50 dark:text-emerald-500/50">/100</span></p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'assets', label: 'Mis Activos', icon: Download },
            { id: 'analytics', label: 'Rendimiento', icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 ${
                activeTab === id
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl'
                  : 'text-gray-600 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Resumen Tab - Mejorado con Grid Inspirado en la Referencia */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* KPIs Principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'PUNTUACIÓN DE CAMPAÑA', value: avgScore, suffix: '/100', icon: Sparkles, color: 'emerald' },
                  { label: 'CTR PROYECTADO', value: 4.2, suffix: '%', icon: TrendingUp, color: 'blue' },
                  { label: 'IMPRESIONES EST.', value: 38250, suffix: '', icon: Eye, color: 'purple' },
                  { label: 'FUERZA DEL COPY', value: 'Excelente', suffix: '', icon: Zap, color: 'amber' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-xl shadow-black/5 transition-all hover:border-emerald-500/30 backdrop-blur-xl"
                  >
                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-${stat.color}-500/5 blur-2xl transition-all group-hover:bg-${stat.color}-500/10`} />
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
                        <p className="text-4xl font-black text-black dark:text-white">
                          {stat.value}{stat.suffix}
                        </p>
                      </div>
                      <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selector de Plataformas y Preview - Diseño Mejorado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-[3rem] border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-12 shadow-2xl shadow-black/5 backdrop-blur-xl space-y-8"
              >
                {/* Selector de Plataformas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {platformOrder.map((platform) => {
                    const isSelected = selectedPlatform === platform;
                    const hasAds = !!adsByPlatform[platform];
                    
                    return (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: hasAds ? 1.05 : 1 }}
                        onClick={() => handlePlatformChange(platform)}
                        disabled={!hasAds}
                        className={`px-4 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border ${
                          isSelected
                            ? `bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]`
                            : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10'
                        } ${!hasAds ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <PlatformIcon platform={platform} size={18} className={isSelected ? 'text-white' : 'text-gray-400'} />
                        <span className="text-sm truncate">{platformNames[platform].split(' ')[0]}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Layout de Dos Columnas: Preview + Información */}
                {currentAd && (
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
                          {selectedPlatform === 'meta' && currentAd.imageUrl && <MetaPreview {...(currentAd as any)} />}
                          {selectedPlatform === 'google' && currentAd.imageUrl && <GoogleAdsPreview {...(currentAd as any)} />}
                          {selectedPlatform === 'tiktok' && currentAd.imageUrl && <TikTokPreview {...(currentAd as any)} />}
                          {selectedPlatform === 'linkedin' && currentAd.imageUrl && <LinkedInPreview {...(currentAd as any)} />}
                        </motion.div>
                      </AnimatePresence>

                      {currentAds.length > 1 && (
                        <div className="absolute inset-y-0 -inset-x-4 flex items-center justify-between pointer-events-none z-20">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={handlePrev}
                            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl text-gray-800 dark:text-white pointer-events-auto hover:scale-110 transition-all border border-black/5 dark:border-white/10"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </motion.button>
                          <button
                            onClick={() => setLightboxOpen(true)}
                            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl text-gray-800 dark:text-white pointer-events-auto hover:scale-110 transition-all border border-black/5 dark:border-white/10"
                            title="Ver en pantalla completa"
                          >
                            <Maximize2 className="w-5 h-5" />
                          </button>
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
                          <div className={`px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]`}>
                            Estrategia de {currentAd.type || 'Conversión'}
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                            <Sparkles className="w-4 h-4" />
                            {currentAd.score}/100
                          </div>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white leading-tight tracking-tight">
                          Diseñado para <span className={colors.text}>{platformNames[selectedPlatform]}</span>
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                          {currentAd.reasoning || "Este anuncio ha sido optimizado por nuestra tecnología para maximizar el impacto y las conversiones en esta plataforma específica."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                          onClick={onDownloadGuide}
                          variant="outline"
                          className="h-20 rounded-[1.5rem] border-black/10 dark:border-white/10 font-black text-lg gap-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                        >
                          <BookOpen className="w-5 h-5" /> Guía de Uso
                        </Button>
                        <Button
                          onClick={onDownloadKit}
                          className={`h-20 rounded-[1.5rem] bg-black dark:bg-white text-white dark:text-black font-black text-lg gap-3 shadow-2xl transition-all hover:scale-105`}
                        >
                          {!hasPaid ? <Lock className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                          Campaign Kit
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 rounded-[1.5rem] border-black/10 dark:border-white/10 text-black dark:text-white font-black text-lg gap-3 sm:col-span-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all"
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
                          <Button onClick={onDownloadKit} className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 px-8 shadow-lg shadow-emerald-500/20">
                            Desbloquear
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Hoja de Ruta para el Éxito */}
              <div className="rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-10 shadow-xl shadow-black/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Hoja de Ruta para el Éxito</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  {[
                    { step: '01', title: 'Descarga tu Kit', desc: 'Obtén tu Campaign Kit en formato PDF profesional.' },
                    { step: '02', title: 'Revisión Estratégica', desc: 'Analiza la guía para asegurar que tus anuncios conecten.' },
                    { step: '03', title: 'Lanzamiento', desc: 'Sube tus anuncios optimizados a cada plataforma.' },
                    { step: '04', title: 'Escalado', desc: 'Monitorea resultados y aumenta tu inversión según el retorno.' },
                  ].map((item, i) => (
                    <div key={i} className="relative group">
                      <span className="text-6xl font-black text-black/5 dark:text-white/5 absolute -top-8 -left-4 transition-all group-hover:text-emerald-500/10">{item.step}</span>
                      <div className="relative z-10 space-y-3">
                        <h4 className="text-lg font-bold text-black dark:text-white tracking-tight">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Mis Activos Tab */}
          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {[
                {
                  title: 'Campaign Kit Premium',
                  desc: 'Informe estratégico completo con análisis, copys y guías de publicación.',
                  icon: FileText,
                  action: onDownloadKit,
                  primary: true
                },
                {
                  title: 'Guía de Implementación',
                  desc: 'Instrucciones técnicas paso a paso para publicar en cada plataforma.',
                  icon: Target,
                  action: onDownloadGuide,
                  primary: false
                }
              ].map((asset, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-[2.5rem] border p-10 shadow-2xl transition-all duration-500 cursor-pointer ${
                    asset.primary 
                      ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500' 
                      : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-emerald-500/30'
                  }`}
                  onClick={asset.action}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className={`mb-8 inline-flex p-4 rounded-3xl ${asset.primary ? 'bg-white/20' : 'bg-black/5 dark:bg-white/10'}`}>
                        <asset.icon className={`w-8 h-8 ${asset.primary ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                      </div>
                      <h3 className={`text-3xl font-black mb-4 tracking-tight ${asset.primary ? 'text-white' : 'text-black dark:text-white'}`}>{asset.title}</h3>
                      <p className={`text-lg font-medium leading-relaxed mb-10 ${asset.primary ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                        {asset.desc}
                      </p>
                    </div>
                    <div className={`flex items-center gap-3 font-bold ${asset.primary ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      <span>Descargar Ahora</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Rendimiento Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="max-w-xl text-center space-y-8">
                <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">Análisis en Tiempo Real</h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    Una vez que tus anuncios estén activos, sincronizaremos tus métricas de rendimiento aquí mismo.
                  </p>
                </div>
                <div className="pt-6">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Sincronización API Disponible Próximamente
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
