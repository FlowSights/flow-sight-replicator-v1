import React from 'react';
import { 
  Facebook, 
  Linkedin, 
  Search
} from 'lucide-react';

interface PlatformIconProps {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24, className = '' }) => {
  if (platform === 'meta') return <Facebook size={size} className={className} />;
  if (platform === 'google') return <Search size={size} className={className} />;
  if (platform === 'linkedin') return <Linkedin size={size} className={className} />;
  if (platform === 'tiktok') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.49v-3.45a6.47 6.47 0 0 0-5.79 9.86 6.48 6.48 0 0 0 10.86-5.75v-3.45a8.16 8.16 0 0 0 5.78 2.17z" />
      </svg>
    );
  }
  return null;
};

export const platformColors = {
  meta: {
    primary: '#1877F2',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
  },
  google: {
    primary: '#4285F4',
    gradient: 'from-red-500 via-yellow-500 to-blue-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-600 dark:text-red-400',
  },
  tiktok: {
    primary: '#000000',
    gradient: 'from-black to-pink-500',
    bg: 'bg-slate-50 dark:bg-slate-900/10',
    border: 'border-slate-200 dark:border-slate-800',
    text: 'text-slate-900 dark:text-slate-100',
  },
  linkedin: {
    primary: '#0A66C2',
    gradient: 'from-blue-600 to-blue-800',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
};

export const platformNames = {
  meta: 'Meta (Facebook/Instagram)',
  google: 'Google Ads',
  tiktok: 'TikTok Ads',
  linkedin: 'LinkedIn Ads',
};
