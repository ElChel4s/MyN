import React from 'react';
import { Flower2 } from 'lucide-react';

interface WashiTapeProps {
  color?: 'purple' | 'teal' | 'mint' | 'floral';
  rotate?: string;
  className?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  color = 'purple',
  rotate = '-3deg',
  className = ''
}) => {
  const styles = {
    purple: 'bg-purple-200/85 border-y border-dashed border-purple-400/80 text-purple-800',
    teal: 'bg-teal-200/85 border-y border-dashed border-teal-400/80 text-teal-900',
    mint: 'bg-cyan-200/85 border-y border-dashed border-cyan-400/80 text-cyan-900',
    floral: 'bg-gradient-to-r from-purple-200/90 via-teal-200/90 to-cyan-200/90 border-y border-dashed border-purple-400/70 text-purple-900'
  };

  return (
    <div
      style={{
        transform: `rotate(${rotate})`,
        clipPath: 'polygon(3% 0%, 97% 2%, 100% 25%, 96% 52%, 100% 78%, 97% 100%, 2% 98%, 0% 73%, 4% 48%, 0% 22%)'
      }}
      className={`h-6 sm:h-7 w-24 sm:w-28 shadow-sm backdrop-blur-[1px] flex items-center justify-around px-2 select-none pointer-events-none ${styles[color]} ${className}`}
    >
      <Flower2 className="w-3 h-3 opacity-70" />
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
      <Flower2 className="w-3 h-3 opacity-70" />
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
      <Flower2 className="w-3 h-3 opacity-70" />
    </div>
  );
};
