import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
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
      className="relative w-full overflow-hidden rounded-3xl"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Glass Effect Border */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-xl" />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">Listo para Lanzar</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Tu Estrategia Premium
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              está Completa
            </span>
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl">
            Todos tus entregables están listos. Descarga tu paquete completo y comienza a generar resultados hoy mismo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📄', label: 'Estrategia de Marketing', desc: '15 páginas' },
            { icon: '🎨', label: 'Creatividades Optimizadas', desc: 'Todas las plataformas' },
            { icon: '📊', label: 'Dashboard Personalizado', desc: 'Métricas en tiempo real' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="font-bold text-white text-sm">{feature.label}</p>
              <p className="text-xs text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          {hasPaid && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-black text-lg gap-3 shadow-2xl shadow-emerald-500/50 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Download className="w-5 h-5" />
                    </motion.div>
                    Descargando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Descargar Todo
                  </>
                )}
              </Button>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={hasPaid ? 'flex-1' : 'w-full'}
          >
            <Button
              onClick={onDownloadComplete}
              variant="outline"
              className="w-full h-16 rounded-2xl border-2 border-white/20 hover:border-white/40 text-white font-black text-lg gap-3 bg-white/5 hover:bg-white/10 transition-all"
            >
              <Zap className="w-5 h-5" />
              {hasPaid ? 'Ver Estrategia Completa' : 'Obtener Acceso'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm text-gray-400 text-center"
        >
          Incluye estrategia de marketing, creatividades optimizadas y dashboard personalizado
        </motion.p>
      </div>
    </motion.div>
  );
};
