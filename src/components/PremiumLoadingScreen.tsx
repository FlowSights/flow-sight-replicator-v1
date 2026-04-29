import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Rocket } from 'lucide-react';

interface PremiumLoadingScreenProps {
  isVisible: boolean;
  progress: number;
}

export const PremiumLoadingScreen: React.FC<PremiumLoadingScreenProps> = ({ isVisible, progress }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Analizando tu modelo de negocio",
    "Generando ganchos psicológicos",
    "Optimizando para máxima conversión",
    "Estructurando tu Campaign Kit Premium",
    "Finalizando tu estrategia maestra"
  ];

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black overflow-hidden"
        >
          {/* Immersive Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px]"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[120px]"
            />
          </div>

          <div className="relative z-10 w-full max-w-xl px-8 text-center space-y-12">
            {/* Premium Icon Animation */}
            <div className="flex justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                <div className="relative h-24 w-24 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-xl">
                  <Sparkles className="w-12 h-12 text-emerald-500" />
                </div>
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <motion.h2 
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight"
              >
                {messages[messageIndex]}
              </motion.h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                Nuestra IA está diseñando una estrategia de alto nivel para tu negocio
              </p>
            </div>

            {/* Premium Progress Bar */}
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                <span>Optimizando</span>
                <span className="text-emerald-500">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: ShieldCheck, label: "Seguro" },
                { icon: Zap, label: "IA Optimizada" },
                { icon: Rocket, label: "Listo para Escalar" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]">
              FlowSight Strategic AI
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
