import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AppleLoaderProps {
  onComplete?: () => void;
}

export const AppleLoader: React.FC<AppleLoaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),   // Aparece el logo
      setTimeout(() => setStep(2), 2000),  // Aparece el texto
      setTimeout(() => setStep(3), 3500),  // Desaparece todo
    ];

    const finalTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <AnimatePresence>
          {step >= 1 && step < 3 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.8 }
              }}
              className="relative mb-8"
            >
              <div className="relative p-6 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <Sparkles className="w-12 h-12 text-white" />
                <motion.div 
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-[2.5rem] blur-2xl -z-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Animation */}
        <AnimatePresence>
          {step >= 2 && step < 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-black font-display tracking-tighter text-white mb-2">
                Flowsight <span className="text-emerald-500">Ads</span>
              </h2>
              <p className="text-emerald-500/60 text-sm font-bold uppercase tracking-[0.3em] ml-1">
                Inteligencia Artificial
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar (Apple Style) */}
        <div className="absolute bottom-[-100px] w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
          />
        </div>
      </div>

      {/* Background Ambient Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"
      />
    </motion.div>
  );
};
