import React from 'react';

export const PencilUnderline = ({ color = '#9333EA' }: { color?: string }) => (
  <svg
    viewBox="0 0 220 14"
    className="w-full h-3 -mt-1 overflow-visible pointer-events-none"
    preserveAspectRatio="none"
  >
    <path
      d="M 3 9 Q 55 3, 110 8 T 217 6"
      fill="none"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    <path
      d="M 8 12 Q 70 7, 135 11 T 212 10"
      fill="none"
      stroke="#14B8A6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeOpacity="0.65"
    />
  </svg>
);
