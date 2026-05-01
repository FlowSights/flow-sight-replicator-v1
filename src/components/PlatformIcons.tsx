import React from 'react';

interface PlatformIconProps {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24, className = '' }) => {
  if (platform === 'meta') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#0668E1"/>
        <path d="M16.5 12c0-2.485-2.015-4.5-4.5-4.5S7.5 9.515 7.5 12s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5z" fill="white"/>
        <path d="M13.5 12c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5z" fill="#0668E1"/>
      </svg>
    );
  }
  if (platform === 'google') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    );
  }
  if (platform === 'linkedin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.5 19V9h-3v10h3zM7 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM19 19v-5.5c0-2.71-1.44-4-3.42-4-1.61 0-2.32.88-2.72 1.5V9h-3v10h3v-5.38c0-1.42.27-2.79 2.03-2.79 1.74 0 1.76 1.63 1.76 2.88V19h3z" fill="#0077B5"/>
      </svg>
    );
  }
  if (platform === 'tiktok') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.41 7.14a4.34 4.34 0 0 1-2.48-.78v4.63a3.5 3.5 0 1 1-3.5-3.5 3.42 3.42 0 0 1 .84.1v2.1a1.41 1.41 0 1 0-.84 2.7 1.4 1.4 0 0 0 1.4-1.4V5.5h2.1a4.33 4.33 0 0 0 3.48 3.41z" fill="currentColor"/>
      </svg>
    );
  }
  return null;
};

export const platformThemes = {
  meta: {
    primary: '#0668E1',
    gradient: 'from-[#0668E1] to-[#004EAA]',
    glow: 'rgba(6, 104, 225, 0.15)',
    border: 'rgba(6, 104, 225, 0.3)',
    text: 'text-[#0668E1]',
    button: 'bg-[#0668E1] hover:bg-[#004EAA]',
  },
  google: {
    primary: '#4285F4',
    gradient: 'from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]',
    glow: 'rgba(66, 133, 244, 0.15)',
    border: 'rgba(66, 133, 244, 0.3)',
    text: 'text-[#4285F4]',
    button: 'bg-[#4285F4] hover:bg-[#3367D6]',
  },
  tiktok: {
    primary: '#000000',
    gradient: 'from-[#00F2EA] via-[#000000] to-[#FF0050]',
    glow: 'rgba(255, 0, 80, 0.2)',
    border: 'rgba(0, 242, 234, 0.4)',
    text: 'text-white',
    button: 'bg-black hover:bg-gray-900 border border-[#FF0050]/50',
  },
  linkedin: {
    primary: '#0077B5',
    gradient: 'from-[#0077B5] to-[#004182]',
    glow: 'rgba(0, 119, 181, 0.15)',
    border: 'rgba(0, 119, 181, 0.3)',
    text: 'text-[#0077B5]',
    button: 'bg-[#0077B5] hover:bg-[#004182]',
  },
};

export const platformNames = {
  meta: 'Meta Ads',
  google: 'Google Ads',
  tiktok: 'TikTok Ads',
  linkedin: 'LinkedIn Ads',
};
