import { Crown, Flame, Sprout, Zap } from 'lucide-react';
import type { MasteryLevel } from '../types/study';

interface MasteryIconProps {
  level: MasteryLevel | -1;
  size?: number;
  className?: string;
}

export function MasteryIcon({ level, size = 14, className = '' }: MasteryIconProps) {
  switch (level) {
    case 3:
      return <Crown size={size} className={`text-[#f2d480] ${className}`} aria-hidden="true" />;
    case 2:
      return <Flame size={size} className={`text-[#c9a227] ${className}`} aria-hidden="true" />;
    case 1:
      return <Zap size={size} className={`text-[#d6be70] ${className}`} aria-hidden="true" />;
    case 0:
      return <Sprout size={size} className={`text-[#7a9459] ${className}`} aria-hidden="true" />;
    default:
      return (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full bg-[#5a5145] ${className}`}
          aria-hidden="true"
        />
      );
  }
}
