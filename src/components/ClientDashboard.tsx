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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ad {
  headline: string;
  description: string;
  cta: string;
  platform: string;
  score: number;
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
          {/* Resumen Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {/* Platform Distribution Cards */}
              {[
                { label: 'Meta Ads', value: platformCount.meta || 1, color: 'blue' },
                { label: 'Google Ads', value: platformCount.google || 1, color: 'red' },
                { label: 'TikTok Ads', value: platformCount.tiktok || 1, color: 'slate' },
                { label: 'LinkedIn Ads', value: platformCount.linkedin || 1, color: 'indigo' },
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-xl shadow-black/5 transition-all hover:border-emerald-500/30">
                  <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl transition-all group-hover:bg-emerald-500/10`} />
                  <p className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-4xl font-black text-black dark:text-white">{stat.value}</p>
                  <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Optimizado</span>
                  </div>
                </div>
              ))}

              {/* Next Steps Bento Box */}
              <div className="md:col-span-4 rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-10 shadow-xl shadow-black/5">
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
                <div 
                  key={i} 
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
                </div>
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
