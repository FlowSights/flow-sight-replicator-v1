import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  BarChart3,
  FileText 
} from 'lucide-react';
import { Button } from './ui/button';

interface PremiumReadyToLaunchProps {
  businessName: string;
  onDownloadComplete: () => void;
  onDownloadAll: () => void;
  hasPaid: boolean;
}

export const PremiumReadyToLaunch: React.FC<PremiumReadyToLaunchProps> = ({
  businessName,
  onDownloadComplete,
  onDownloadAll,
  hasPaid,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      await onDownloadAll();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white dark:bg-[#050505] shadow-2xl shadow-black/5"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-[#050505]" />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-10 md:p-20 space-y-12 text-center">
        {/* Header */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em]">Campaña Optimizada</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-tight tracking-tight">
            Tu Estrategia Premium
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
              está Lista
            </span>
          </h2>

          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Todos tus materiales estratégicos han sido optimizados para generar resultados. 
            Descarga tu paquete maestro y comienza a escalar hoy mismo.
          </p>
        </div>

        {/* Features Grid - Refined */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: FileText, label: 'Estrategia de Marketing', desc: 'Dossier estratégico completo' },
            { icon: Zap, label: 'Material de Anuncios', desc: 'Optimizados por plataforma' },
            { icon: BarChart3, label: 'Proyecciones de Venta', desc: 'Análisis de rendimiento' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl group hover:border-emerald-500/30 transition-all shadow-sm"
            >
              <div className="mb-4 inline-flex p-3 rounded-2xl bg-white dark:bg-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-sm">
                <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-bold text-black dark:text-white text-lg mb-1 tracking-tight">{feature.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center pt-8 max-w-2xl mx-auto">
          {hasPaid && (
            <Button
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="h-20 px-10 rounded-[2rem] bg-emerald-600 dark:bg-emerald-500 text-white font-black text-xl gap-3 shadow-2xl transition-all hover:scale-105 disabled:opacity-50 hover:bg-emerald-700 dark:hover:bg-emerald-400"
            >
              {isDownloading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <Download className="w-6 h-6" />
                </motion.div>
              ) : (
                <Download className="w-6 h-6" />
              )}
              Descargar Todo
            </Button>
          )}

          <Button
            onClick={onDownloadComplete}
            variant="outline"
            className="h-20 px-10 rounded-[2rem] border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-black text-xl gap-3 backdrop-blur-xl transition-all"
          >
            {hasPaid ? 'Campaign Kit' : 'Obtener Acceso Premium'}
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-xs font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]"
        >
          FlowSight Ads Strategic Delivery
        </motion.p>
      </div>
    </motion.div>
  );
};
