import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';

import defaultMockup from '@/assets/default-ad-mockup.png';

interface PromoImageProps {
  src?: string;
  alt?: string;
  className?: string;
  platform?: 'meta' | 'tiktok' | 'linkedin' | 'google';
  type?: 'image' | 'video';
}
 
const getPlaceholderSVG = (alt: string): string => {
  return defaultMockup;
};
 
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 500;
 
export const PromoImage: React.FC<PromoImageProps> = ({ 
  src, 
  alt = "Ad", 
  className = "",
  platform,
  type: initialType
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [assetType, setAssetType] = useState<'image' | 'video'>(initialType || 'image');
  const retryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 
  useEffect(() => {
    // Reset state when src changes
    retryCount.current = 0;
    setHasError(false);
    
    if (!src || src === null || src === '') {
      setCurrentSrc(defaultMockup);
      setAssetType('image');
      setIsLoading(false);
      return;
    }

    // Infer type from src if not provided
    if (!initialType) {
      if (src.startsWith('data:video/') || src.match(/\.(mp4|webm|ogg|mov)$/i)) {
        setAssetType('video');
      } else {
        setAssetType('image');
      }
    } else {
      setAssetType(initialType);
    }

    setIsLoading(true);
    setCurrentSrc(src);

    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [src, alt, initialType]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    if (src && src.startsWith('data:')) {
      setIsLoading(false);
      setHasError(false);
      return;
    }

    if (retryCount.current < MAX_RETRIES && src) {
      retryCount.current += 1;
      retryTimer.current = setTimeout(() => {
        const retryUrl = `${src}${src.includes('?') ? '&' : '?'}_t=${Date.now()}`;
        setCurrentSrc(retryUrl);
      }, RETRY_DELAY_MS);
    } else {
      setHasError(true);
      setCurrentSrc(getPlaceholderSVG(alt));
      setAssetType('image');
      setIsLoading(false);
    }
  };

  // Platform specific AI Margins (Aspect Ratios)
  const getPlatformStyles = () => {
    switch (platform) {
      case 'tiktok':
        return 'aspect-[9/16]';
      case 'meta':
        return 'aspect-[4/5] md:aspect-square'; // Feed style
      case 'linkedin':
        return 'aspect-video md:aspect-square';
      case 'google':
        return 'aspect-[1.91/1]';
      default:
        return '';
    }
  };

  return (
    <div className={`relative w-full overflow-hidden bg-black/5 dark:bg-white/5 ${getPlatformStyles()} ${className}`}>
      {/* Skeleton loader while image is loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10 animate-pulse">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      )}

      {assetType === 'video' ? (
        <video
          key={currentSrc}
          src={currentSrc}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Only show icon placeholder if truly nothing loaded */}
      {!isLoading && hasError && !currentSrc.startsWith('data:') && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          <ImageIcon className="w-12 h-12 opacity-20" />
        </div>
      )}
    </div>
  );
};
