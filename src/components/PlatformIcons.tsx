import React from 'react';

interface PlatformIconProps {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24, className = '' }) => {
  if (platform === 'meta') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#0668E1"/>
        <path d="M16.5 12c0-2.485-2.015-4.5-4.5-4.5S7.5 9.515 7.5 12s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5z" fill="white"/>
        <path d="M13.5 12c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5z" fill="#0668E1"/>
      </svg>
    );
  }
  if (platform === 'google') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    );
  }
  if (platform === 'linkedin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#0077B5"/>
        <path d="M7 9.5v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="6.5" r="1" fill="white"/>
        <path d="M11 9.5v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 13c0-2 1-3.5 3-3.5s3 1.5 3 3.5v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (platform === 'tiktok') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.7a2.4 2.4 0 1 1-2.4-2.4c.34 0 .67.03 1 .09V9.83a6.8 6.8 0 0 0-1-.08A6.9 6.9 0 0 0 5.6 19.9a6.9 6.9 0 0 0 10.86-5.1v-5.12a8.8 8.8 0 0 0 5.54 1.94v-3.72a4.84 4.84 0 0 1-1.41-.21z" fill="#000000"/>
      </svg>
    );
  }
  return null;
};

export const platformThemes = {
  meta: {
    primary: '#0668E1',
    secondary: '#E7165F',
    gradient: 'from-[#0668E1] via-[#0668E1] to-[#E7165F]',
    glow: 'rgba(6, 104, 225, 0.2)',
    glowSecondary: 'rgba(231, 22, 95, 0.15)',
    border: 'rgba(6, 104, 225, 0.25)',
    text: 'text-[#0668E1]',
    button: 'bg-[#0668E1] hover:bg-[#004EAA] shadow-lg shadow-[#0668E1]/20',
    grid: 'rgba(6, 104, 225, 0.05)',
    bgGradient: 'radial-gradient(circle at 60% 40%, rgba(6, 104, 225, 0.15) 0%, transparent 50%)',
  },
  google: {
    primary: '#4285F4',
    secondary: '#EA4335',
    gradient: 'from-[#4285F4] via-[#FBBC05] to-[#EA4335]',
    glow: 'rgba(66, 133, 244, 0.2)',
    glowSecondary: 'rgba(234, 67, 53, 0.15)',
    border: 'rgba(66, 133, 244, 0.25)',
    text: 'text-[#4285F4]',
    button: 'bg-[#4285F4] hover:bg-[#3367D6] shadow-lg shadow-[#4285F4]/20',
    grid: 'rgba(66, 133, 244, 0.05)',
    bgGradient: 'radial-gradient(circle at 70% 30%, rgba(66, 133, 244, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(234, 67, 53, 0.08) 0%, transparent 50%)',
  },
  tiktok: {
    primary: '#00F2EA',
    secondary: '#FF0050',
    gradient: 'from-[#00F2EA] via-[#000000] to-[#FF0050]',
    glow: 'rgba(0, 242, 234, 0.25)',
    glowSecondary: 'rgba(255, 0, 80, 0.2)',
    border: 'rgba(0, 242, 234, 0.35)',
    text: 'text-[#00F2EA]',
    button: 'bg-black hover:bg-gray-900 border border-[#FF0050]/40 shadow-lg shadow-[#FF0050]/15',
    grid: 'rgba(0, 242, 234, 0.08)',
    bgGradient: 'radial-gradient(circle at 80% 20%, rgba(0, 242, 234, 0.15) 0%, transparent 45%), radial-gradient(circle at 10% 70%, rgba(255, 0, 80, 0.12) 0%, transparent 50%)',
  },
  linkedin: {
    primary: '#0077B5',
    secondary: '#0A66C2',
    gradient: 'from-[#0077B5] via-[#0077B5] to-[#004182]',
    glow: 'rgba(0, 119, 181, 0.2)',
    glowSecondary: 'rgba(0, 65, 130, 0.15)',
    border: 'rgba(0, 119, 181, 0.25)',
    text: 'text-[#0077B5]',
    button: 'bg-[#0077B5] hover:bg-[#004182] shadow-lg shadow-[#0077B5]/20',
    grid: 'rgba(0, 119, 181, 0.05)',
    bgGradient: 'radial-gradient(circle at 50% 50%, rgba(0, 119, 181, 0.15) 0%, transparent 55%)',
  },
};

export const platformNames = {
  meta: 'Meta Ads',
  google: 'Google Ads',
  tiktok: 'TikTok Ads',
  linkedin: 'LinkedIn Ads',
};

export const PlatformGridOverlay = ({ platform }: { platform: 'meta' | 'google' | 'tiktok' | 'linkedin' }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" preserveAspectRatio="none">
    <defs>
      <pattern id={`grid-${platform}`} width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#grid-${platform})`} />
  </svg>
);
