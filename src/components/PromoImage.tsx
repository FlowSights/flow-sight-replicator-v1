import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';

interface PromoImageProps {
  src?: string;
  alt?: string;
  className?: string;
  platform?: 'meta' | 'tiktok' | 'linkedin' | 'google';
  type?: 'image' | 'video';
}

const getPlaceholderSVG = (alt: string): string => {
  const colors: Record<string, { bg: string; accent: string }> = {
    google: { bg: '#f8f9fa', accent: '#4285F4' },
    meta: { bg: '#f0f2f5', accent: '#0668E1' },
    tiktok: { bg: '#000000', accent: '#00F2EA' },
    linkedin: { bg: '#f3f6f8', accent: '#0077B5' },
  };
  const key = Object.keys(colors).find(k => alt?.toLowerCase().includes(k)) || 'google';
  const c = colors[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${c.bg}"/>
    <rect x="0" y="0" width="1200" height="8" fill="${c.accent}"/>
    <text x="600" y="290" font-family="system-ui,sans-serif" font-size="48" font-weight="bold" fill="${c.accent}" text-anchor="middle" dominant-baseline="middle">📸</text>
    <text x="600" y="360" font-family="system-ui,sans-serif" font-size="24" fill="#666" text-anchor="middle">Agrega tu imagen o video aquí</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
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
      setCurrentSrc(getPlaceholderSVG(alt));
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
