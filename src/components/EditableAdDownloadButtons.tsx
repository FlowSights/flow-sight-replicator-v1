import React from 'react';
import { Download, Lock, FileText, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { platformColors, PlatformIcon } from '@/components/PlatformIcons';

type Platform = 'meta' | 'google' | 'tiktok' | 'linkedin';

interface EditableAdDownloadButtonsProps {
  platform: Platform;
  hasPaid: boolean;
  onDownloadKit: () => void;
  onDownloadGuide: () => void;
  onPublish: () => void;
  onPaymentRequired?: () => void;
}

export const EditableAdDownloadButtons: React.FC<EditableAdDownloadButtonsProps> = ({
  platform,
  hasPaid,
  onDownloadKit,
  onDownloadGuide,
  onPublish,
  onPaymentRequired,
}) => {
  const colors = platformColors[platform];

  const buttons = [
    {
      icon: FileText,
      label: 'Descargar Kit',
      description: 'PDF con tu anuncio optimizado',
      action: onDownloadKit,
      color: 'from-green-400 to-emerald-600',
      locked: !hasPaid,
    },
    {
      icon: Share2,
      label: 'Guía Visual',
      description: 'Pasos para publicar',
      action: onDownloadGuide,
      color: 'from-blue-400 to-blue-600',
      locked: !hasPaid,
    },
    {
      icon: Share2,
      label: 'Publicar Ahora',
      description: 'Ir a ' + platform.toUpperCase(),
      action: onPublish,
      color: colors.gradient,
      locked: !hasPaid,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            <Button
              onClick={() => {
                if (btn.locked && onPaymentRequired) {
                  onPaymentRequired();
                } else {
                  btn.action();
                }
              }}
              className={`relative bg-gradient-to-r ${btn.color} text-white hover:shadow-lg transition-all px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 overflow-hidden`}
            >
              <Icon size={16} />
              {btn.label}

              {/* Indicador de bloqueo */}
              {btn.locked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <Lock size={16} />
                </div>
              )}
            </Button>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {btn.description}
              {btn.locked && ' (Premium)'}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
