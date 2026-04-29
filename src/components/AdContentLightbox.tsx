import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { AdImage } from './AdImage';

interface AdContentLightboxProps {
  isOpen: boolean;
  imageUrl?: string;
  headline: string;
  description: string;
  onClose: () => void;
}

export const AdContentLightbox: React.FC<AdContentLightboxProps> = ({
  isOpen,
  imageUrl,
  headline,
  description,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
              title="Cerrar"
            >
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>

            {/* Content */}
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Image - Main Focus */}
              {imageUrl && (
                <div className="relative w-full bg-gray-100 dark:bg-gray-800">
                  <AdImage src={imageUrl} alt={headline} className="w-full max-h-[60vh] object-cover" />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold">
                    <ZoomIn className="w-4 h-4" />
                    Vista Completa
                  </div>
                </div>
              )}

              {/* Text Content */}
              <div className="p-8 space-y-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                    {headline}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Haz clic fuera para cerrar • Presiona ESC
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
