import React, { createContext, useContext, useState } from 'react';
import { platformColors } from '@/components/PlatformIcons';

type Platform = 'meta' | 'google' | 'tiktok' | 'linkedin';

interface PlatformContextType {
  selectedPlatform: Platform;
  setSelectedPlatform: (platform: Platform) => void;
  colors: typeof platformColors[Platform];
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('meta');

  const value: PlatformContextType = {
    selectedPlatform,
    setSelectedPlatform,
    colors: platformColors[selectedPlatform],
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatformContext debe ser usado dentro de PlatformProvider');
  }
  return context;
};
