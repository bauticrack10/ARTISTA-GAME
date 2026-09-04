import React from 'react';
import {
  Mic,
  Crown,
  Flame,
  Disc3,
  Sparkles,
  Zap,
  Music2,
  Radio,
  Headphones,
  Star,
  Trophy,
  User,
  Activity,
  Waves,
  LucideIcon
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  mic: Mic,
  crown: Crown,
  flame: Flame,
  disc: Disc3,
  sparkles: Sparkles,
  zap: Zap,
  music: Music2,
  radio: Radio,
  headphones: Headphones,
  star: Star,
  trophy: Trophy,
  waves: Waves,
  activity: Activity,
  user: User,
  gem: Sparkles,
  sun: Star,
  moon: Sparkles,
  shield: Trophy
};

export interface ArtistAvatarProps {
  name?: string;
  avatarColor?: string;
  avatarIcon?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  rounded?: 'rounded-[4px]' | 'rounded-[6px]' | 'rounded-[8px]' | 'rounded-[12px]' | 'rounded-[14px]' | 'rounded-[16px]' | 'rounded-full';
  showInitialsFallback?: boolean;
}

export const ArtistAvatar: React.FC<ArtistAvatarProps> = ({
  name = 'Artista',
  avatarColor = 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]',
  avatarIcon,
  size = 'md',
  className = '',
  rounded = 'rounded-[12px]',
  showInitialsFallback = true
}) => {
  const IconComponent = avatarIcon ? ICON_MAP[avatarIcon] : null;

  const sizeClasses: Record<string, string> = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl',
    '2xl': 'w-32 h-32 text-3xl',
    custom: ''
  };

  const iconSizeClasses: Record<string, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
    custom: 'w-1/2 h-1/2'
  };

  const resolvedSizeClass = sizeClasses[size] || sizeClasses.md;
  const resolvedIconSizeClass = iconSizeClasses[size] || iconSizeClasses.md;
  const initials = (name || 'A').trim().substring(0, 2).toUpperCase();

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-gradient-to-tr ${avatarColor} ${rounded} flex items-center justify-center text-white font-extrabold select-none transition-all ${resolvedSizeClass} ${className}`}
      style={{
        boxShadow: 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.15) 0px 2px 4px 0px'
      }}
    >
      {IconComponent ? (
        <IconComponent className={`${resolvedIconSizeClass} drop-shadow-md text-white`} />
      ) : showInitialsFallback ? (
        <span className="drop-shadow-sm font-black tracking-tight">{initials}</span>
      ) : (
        <User className={`${resolvedIconSizeClass} drop-shadow-md text-white`} />
      )}
    </div>
  );
};
