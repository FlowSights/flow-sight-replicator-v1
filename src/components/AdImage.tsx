import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';

interface AdImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80";

export const AdImage: React.FC<AdImageProps> = ({ src, alt = "Ad", className = "" }) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    console.log("[AdImage] Received src:", src ? (src.startsWith('data:') ? 'base64...' : src) : 'undefined');
    
    if (!src) {
      console.log("[AdImage] No src provided, using fallback");
      setCurrentSrc(DEFAULT_FALLBACK);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    console.error("[AdImage] Error loading image:", currentSrc);
    if (errorCount < 2) {
      console.log(`[AdImage] Retry attempt ${errorCount + 1}...`);
      setErrorCount(prev => prev + 1);
      // Force a small delay before retry
      setTimeout(() => {
        setCurrentSrc(`${src}${src?.includes('?') ? '&' : '?'}retry=${Date.now()}`);
      }, 500);
    } else {
      console.log("[AdImage] Max retries reached, using fallback");
      setCurrentSrc(DEFAULT_FALLBACK);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log("[AdImage] Image loaded successfully");
    setIsLoading(false);
  };

  return (
    <div className={`relative w-full min-h-[200px] bg-gray-100 dark:bg-gray-800 overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      )}
      
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageIcon className="w-12 h-12 opacity-20" />
        </div>
      )}
    </div>
  );
};
