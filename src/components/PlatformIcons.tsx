import React from 'react';
import { 
  Search
} from 'lucide-react';

interface PlatformIconProps {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24, className = '' }) => {
  if (platform === 'meta') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    );
  }
  if (platform === 'google') return <Search size={size} className={className} />;
  if (platform === 'linkedin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    );
  }
  if (platform === 'tiktok') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
      >
        <path d="M12.525.02c1.31-.032 2.612-.019 3.91-.019.03 1.53.523 3.059 1.442 4.305.924 1.256 2.223 2.185 3.7 2.656v3.867c-1.522-.034-3.003-.565-4.245-1.53a8.813 8.813 0 0 1-1.312-1.313V17.51c.017 3.6-2.978 6.511-6.583 6.49-3.597-.02-6.486-2.94-6.446-6.537.04-3.59 3.001-6.487 6.587-6.447.254.002.508.02.76.052v3.886c-.248-.053-.5-.076-.754-.076-1.432-.026-2.627 1.113-2.653 2.545-.026 1.433 1.114 2.627 2.546 2.653 1.433.026 2.627-1.113 2.653-2.545.002-.075.002-.15 0-.225V.02z" />
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
