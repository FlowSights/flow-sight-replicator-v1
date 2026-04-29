import React from 'react';
import { motion } from 'framer-motion';
import { PlatformIcon, platformNames, platformColors } from '@/components/PlatformIcons';

type Platform = 'meta' | 'google' | 'tiktok' | 'linkedin';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  showLabels?: boolean;
  compact?: boolean;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onSelectPlatform,
  showLabels = true,
  compact = false,
}) => {
  const platforms: Platform[] = ['meta', 'google', 'tiktok', 'linkedin'];

  return (
    <div className={`flex gap-${compact ? '2' : '4'} flex-wrap`}>
      {platforms.map((platform) => {
        const colors = platformColors[platform];
        const isSelected = selectedPlatform === platform;

        return (
          <motion.button
            key={platform}
            onClick={() => onSelectPlatform(platform)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group transition-all duration-300 ${
              compact ? 'p-2' : 'p-3 md:p-4'
            } rounded-xl ${
              isSelected
                ? `${colors.bg} border-2 ${colors.border} shadow-lg`
                : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Icono */}
            <div className={`flex items-center justify-center ${compact ? 'mb-0' : 'mb-2'}`}>
              <PlatformIcon
                platform={platform}
                size={compact ? 20 : 28}
                className={`${isSelected ? colors.text : 'text-gray-600 dark:text-gray-400'}`}
              />
            </div>

            {/* Etiqueta */}
            {showLabels && !compact && (
              <p
                className={`text-xs md:text-sm font-semibold text-center ${
                  isSelected ? colors.text : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {platformNames[platform]}
              </p>
            )}

            {/* Indicador de selección */}
            {isSelected && (
              <motion.div
                layoutId="platformIndicator"
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-10 pointer-events-none`}
              />
            )}

            {/* Efecto hover */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
          </motion.button>
        );
      })}
    </div>
  );
};
