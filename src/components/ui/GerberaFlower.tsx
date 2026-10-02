import React from 'react';

interface GerberaFlowerProps {
  size?: number;
  variant?: 'purple' | 'teal' | 'aqua' | 'lavender' | 'mixed';
  className?: string;
  spin?: boolean;
  withStem?: boolean;
  onClick?: () => void;
}

export const GerberaFlower: React.FC<GerberaFlowerProps> = ({
  size = 56,
  variant = 'purple',
  className = '',
  spin = false,
  withStem = false,
  onClick
}) => {
  const palettes = {
    purple: {
      outer: '#9333EA',
      mid: '#A855F7',
      inner: '#D8B4FE',
      stroke: '#581C87',
      centerOuter: '#0D9488',
      centerInner: '#FDE047'
    },
    teal: {
      outer: '#0D9488',
      mid: '#14B8A6',
      inner: '#5EEAD4',
      stroke: '#115E59',
      centerOuter: '#7C3AED',
      centerInner: '#FEF08A'
    },
    aqua: {
      outer: '#0284C7',
      mid: '#06B6D4',
      inner: '#67E8F9',
      stroke: '#164E63',
      centerOuter: '#9333EA',
      centerInner: '#FDE047'
    },
    lavender: {
      outer: '#7C3AED',
      mid: '#C084FC',
      inner: '#EDE9FE',
      stroke: '#4C1D95',
      centerOuter: '#14B8A6',
      centerInner: '#FACC15'
    },
    mixed: {
      outer: '#8B5CF6',
      mid: '#2DD4BF',
      inner: '#E0F2FE',
      stroke: '#3B0764',
      centerOuter: '#0D9488',
      centerInner: '#FDE047'
    }
  };

  const p = palettes[variant] || palettes.purple;
  const outerPetals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const midPetals = Array.from({ length: 16 }, (_, i) => i * 22.5 + 11.25);
  const innerPetals = Array.from({ length: 12 }, (_, i) => i * 30 + 5);

  return (
    <svg
      width={size}
      height={withStem ? size * 1.45 : size}
      viewBox={withStem ? '0 0 120 175' : '0 0 120 120'}
      className={`select-none transition-transform duration-500 ${
        spin ? 'animate-spin-slow' : 'hover:scale-110 hover:rotate-12'
      } ${className}`}
      onClick={onClick}
      style={{ overflow: 'visible' }}
    >
      {withStem && (
        <g>
          <path
            d="M 60 65 Q 52 115 64 168"
            fill="none"
            stroke="#0F766E"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="120 4"
          />
          <path
            d="M 58 65 Q 50 115 62 168"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 57 118 Q 22 102 18 122 Q 30 138 58 126 Z"
            fill="#14B8A6"
            fillOpacity="0.82"
            stroke="#115E59"
            strokeWidth="2"
          />
          <path
            d="M 55 121 L 26 118"
            stroke="#0F766E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 60 136 Q 95 122 98 140 Q 84 156 60 143 Z"
            fill="#0D9488"
            fillOpacity="0.85"
            stroke="#115E59"
            strokeWidth="2"
          />
        </g>
      )}

      <g transform="translate(60, 60)">
        {outerPetals.map((angle, idx) => (
          <g key={`outer-${idx}`} transform={`rotate(${angle})`}>
            <path
              d="M 0 -8 C -7 -26, -8 -48, 0 -54 C 8 -48, 7 -26, 0 -8 Z"
              fill={p.outer}
              fillOpacity="0.88"
              stroke={p.stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 0 -14 L 0 -44"
              stroke={p.inner}
              strokeWidth="1.2"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
          </g>
        ))}

        {midPetals.map((angle, idx) => (
          <g key={`mid-${idx}`} transform={`rotate(${angle})`}>
            <path
              d="M 0 -7 C -6 -22, -6 -39, 0 -44 C 6 -39, 6 -22, 0 -7 Z"
              fill={p.mid}
              fillOpacity="0.92"
              stroke={p.stroke}
              strokeWidth="1.4"
            />
          </g>
        ))}

        {innerPetals.map((angle, idx) => (
          <g key={`inner-${idx}`} transform={`rotate(${angle})`}>
            <path
              d="M 0 -5 C -4 -14, -4 -25, 0 -29 C 4 -25, 4 -14, 0 -5 Z"
              fill={p.inner}
              stroke={p.stroke}
              strokeWidth="1.2"
            />
          </g>
        ))}

        <circle cx="0" cy="0" r="13" fill={p.centerOuter} stroke={p.stroke} strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill={p.centerInner} stroke={p.stroke} strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="-3" cy="-2" r="1.5" fill={p.stroke} />
        <circle cx="3" cy="2" r="1.5" fill={p.stroke} />
        <circle cx="2" cy="-3" r="1.2" fill={p.stroke} />
        <circle cx="-2" cy="3" r="1.2" fill={p.stroke} />
      </g>
    </svg>
  );
};
