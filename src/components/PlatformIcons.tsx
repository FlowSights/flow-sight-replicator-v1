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
  switch (platform) {
    case 'meta':
      return <Facebook size={size} className={className} />;
    case 'google':
      return <Search size={size} className={className} />;
    case 'linkedin':
      return <Linkedin size={size} className={className} />;
    case 'tiktok':
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.86 2.89 2.89 0 0 1 5.1-1.86v-3.33a6.15 6.15 0 0 0-3.72 1.23V9.4a9.04 9.04 0 0 0 5.81 2.02v-3.73a2.89 2.89 0 0 1 .37-5.21v-.01z" />
        </svg>
      );
    default:
      return null;
  }
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
