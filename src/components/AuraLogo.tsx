import React from 'react';

interface AuraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showSubtitle?: boolean;
  lightMode?: boolean;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
  lightMode = false
}) => {
  const sizeClasses = {
    sm: {
      icon: 'w-7 h-7',
      title: 'text-lg',
      subtitle: 'text-[9px] tracking-[0.25em]'
    },
    md: {
      icon: 'w-9 h-9',
      title: 'text-2xl',
      subtitle: 'text-[10px] tracking-[0.3em]'
    },
    lg: {
      icon: 'w-12 h-12',
      title: 'text-3xl',
      subtitle: 'text-[11px] tracking-[0.35em]'
    },
    hero: {
      icon: 'w-16 h-16',
      title: 'text-4xl md:text-5xl',
      subtitle: 'text-[13px] tracking-[0.4em]'
    }
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Golden Aura Jewelry Emblem */}
      <div className={`relative ${sizeClasses.icon} flex items-center justify-center shrink-0`}>
        {/* Outer Radiant Aura Ring */}
        <div className="absolute inset-0 rounded-full border border-[#D4AF37] opacity-40 animate-pulse" />
        
        {/* Main Golden Medallion */}
        <div className="w-full h-full rounded-full gold-gradient p-[1.5px] shadow-sm">
          <div className="w-full h-full rounded-full bg-[#FAF9F6] flex items-center justify-center relative overflow-hidden">
            {/* Subtle internal gold shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/15 via-white/80 to-transparent" />
            
            {/* Diamond Sparkle & Aura Symbol */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-3/5 h-3/5 text-[#B88E1C] relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer delicate aura diamond */}
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="url(#goldGradient)"
                stroke="#997010"
                strokeWidth="0.5"
              />
              <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
              <circle cx="12" cy="12" r="1.2" fill="#D4AF37" />
              <defs>
                <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F5E6A3" />
                  <stop offset="0.5" stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#A47916" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span
          className={`font-serif-luxury font-bold tracking-[0.18em] leading-none ${sizeClasses.title} ${
            lightMode
              ? 'text-white'
              : 'text-[#1F1C18] group-hover:text-[#B88E1C] transition-colors'
          }`}
        >
          AURA
        </span>
        {showSubtitle && (
          <span
            className={`font-medium uppercase text-[#B88E1C] mt-1 ${sizeClasses.subtitle}`}
          >
            Semijóias • Alto Padrão
          </span>
        )}
      </div>
    </div>
  );
};
