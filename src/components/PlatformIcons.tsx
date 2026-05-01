import React from 'react';

interface PlatformIconProps {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24, className = '' }) => {
  if (platform === 'meta') {
    // Official Meta infinity loop — continuous figure-8 stroke
    return (
      <svg width={size} height={size} viewBox="0 0 38 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        <path
          d="M19 11 C19 11 16 4 10.5 4 C6 4 2 7.1 2 11 C2 14.9 6 18 10.5 18 C14 18 16.5 15.5 19 11 C21.5 6.5 24 4 27.5 4 C32 4 36 7.1 36 11 C36 14.9 32 18 27.5 18 C22 18 19 11 19 11 Z"
          stroke="url(#meta-grad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="meta-grad" x1="2" y1="11" x2="36" y2="11" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0064E0"/>
            <stop offset="0.4" stopColor="#0064E0"/>
            <stop offset="0.7" stopColor="#0073EE"/>
            <stop offset="1" stopColor="#0082FB"/>
          </linearGradient>
        </defs>
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
    // Official LinkedIn "in" mark — filled paths, no strokes
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        <rect width="24" height="24" rx="4" fill="#0A66C2"/>
        {/* Left bar */}
        <rect x="4" y="9" width="3.5" height="11" rx="0.5" fill="white"/>
        {/* Left dot */}
        <circle cx="5.75" cy="6" r="1.9" fill="white"/>
        {/* Right "n" shape — vertical bar */}
        <rect x="9.5" y="9" width="3.5" height="11" rx="0.5" fill="white"/>
        {/* Right "n" shape — curved arm filled */}
        <path d="M13 13.5C13 11.5 14 10.5 15.5 10.5C17 10.5 17.5 11.7 17.5 13.5V20H20.5V13C20.5 10 19 8.5 16.5 8.5C15 8.5 13.8 9.2 13 10.2V9H9.5V20H13V13.5Z" fill="white"/>
      </svg>
    );
  }
  if (platform === 'tiktok') {
    // Official TikTok musical note mark — clean paths, no deformation
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        {/* Shadow layers for the two-tone effect */}
        <path d="M22.5 5.5C22.5 5.5 23 9.5 27 11V15C27 15 24 14.7 22.5 13.5V19.5C22.5 24.2 18.7 28 14 28C9.3 28 5.5 24.2 5.5 19.5C5.5 14.8 9.3 11 14 11C14.5 11 15 11.1 15.5 11.2V15.4C15 15.2 14.5 15 14 15C11.5 15 9.5 17 9.5 19.5C9.5 22 11.5 24 14 24C16.5 24 18.5 22 18.5 19.5V4H22.5V5.5Z" fill="#FF004F"/>
        <path d="M21.5 4.5C21.5 4.5 22 8.5 26 10V14C26 14 23 13.7 21.5 12.5V18.5C21.5 23.2 17.7 27 13 27C8.3 27 4.5 23.2 4.5 18.5C4.5 13.8 8.3 10 13 10C13.5 10 14 10.1 14.5 10.2V14.4C14 14.2 13.5 14 13 14C10.5 14 8.5 16 8.5 18.5C8.5 21 10.5 23 13 23C15.5 23 17.5 21 17.5 18.5V3H21.5V4.5Z" fill="#00F2EA"/>
        {/* Main black fill on top */}
        <path d="M22 4C22 4 22.5 8 26.5 9.5V13.5C26.5 13.5 23.5 13.2 22 12V18C22 22.7 18.2 26.5 13.5 26.5C8.8 26.5 5 22.7 5 18C5 13.3 8.8 9.5 13.5 9.5C14 9.5 14.5 9.6 15 9.7V13.9C14.5 13.7 14 13.5 13.5 13.5C11 13.5 9 15.5 9 18C9 20.5 11 22.5 13.5 22.5C16 22.5 18 20.5 18 18V3.5H22V4Z" fill="#000000"/>
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
