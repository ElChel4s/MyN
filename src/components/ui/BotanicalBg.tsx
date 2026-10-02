import React from 'react';
import { GerberaFlower } from './GerberaFlower';

export const BotanicalBg = ({ animate = true }: { animate?: boolean }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
    <svg className="absolute inset-0 w-full h-full opacity-55" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hand-drawn-garden" width="180" height="180" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.4" fill="#9333EA" fillOpacity="0.22" />
          <circle cx="110" cy="20" r="1.4" fill="#0D9488" fillOpacity="0.22" />
          <circle cx="20" cy="110" r="1.4" fill="#0D9488" fillOpacity="0.22" />
          <circle cx="110" cy="110" r="1.4" fill="#9333EA" fillOpacity="0.22" />

          <g transform="translate(65, 55) scale(0.55)" opacity="0.28">
            <circle cx="0" cy="-12" r="7" fill="#C084FC" stroke="#6B21A8" strokeWidth="1.5" />
            <circle cx="12" cy="0" r="7" fill="#C084FC" stroke="#6B21A8" strokeWidth="1.5" />
            <circle cx="0" cy="12" r="7" fill="#C084FC" stroke="#6B21A8" strokeWidth="1.5" />
            <circle cx="-12" cy="0" r="7" fill="#C084FC" stroke="#6B21A8" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="6" fill="#FDE047" stroke="#6B21A8" strokeWidth="1.5" />
          </g>

          <g transform="translate(145, 135) rotate(-25) scale(0.7)" opacity="0.26">
            <path d="M 0 0 Q 18 -14 36 0 Q 18 14 0 0 Z" fill="#5EEAD4" stroke="#0F766E" strokeWidth="1.8" />
            <path d="M 3 0 L 32 0" stroke="#0F766E" strokeWidth="1.2" />
          </g>

          <path d="M 140 40 Q 145 45 150 40 Q 145 45 145 52 Q 145 45 140 40" fill="none" stroke="#8B5CF6" strokeWidth="1.6" opacity="0.3" />
          <path d="M 25 150 Q 45 138 65 150 T 105 150" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hand-drawn-garden)" />
    </svg>

    <svg viewBox="0 0 400 400" className="absolute -top-6 -left-6 w-64 sm:w-80 md:w-96 h-auto opacity-85">
      <path d="M -10 120 Q 90 95 150 45 T 310 -10" fill="none" stroke="#0D9488" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M -10 210 Q 80 180 120 120 T 220 20" fill="none" stroke="#9333EA" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
      <path d="M 70 102 Q 65 70 95 68 Q 95 95 70 102 Z" fill="#5EEAD4" fillOpacity="0.65" stroke="#115E59" strokeWidth="2" />
      <path d="M 125 65 Q 155 60 165 82 Q 135 90 125 65 Z" fill="#A855F7" fillOpacity="0.45" stroke="#581C87" strokeWidth="2" />
      <path d="M 45 185 Q 25 155 55 142 Q 70 168 45 185 Z" fill="#2DD4BF" fillOpacity="0.6" stroke="#115E59" strokeWidth="2" />
      <circle cx="185" cy="45" r="8" fill="#FDE047" stroke="#581C87" strokeWidth="2" />
      <circle cx="105" cy="145" r="6" fill="#C084FC" stroke="#581C87" strokeWidth="1.5" />
    </svg>

    <svg viewBox="0 0 400 400" className="absolute -top-6 -right-6 w-64 sm:w-80 md:w-96 h-auto opacity-85 transform scale-x-[-1]">
      <path d="M -10 140 Q 100 110 160 55 T 330 -10" fill="none" stroke="#7C3AED" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M -10 230 Q 90 190 140 125 T 240 15" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="7 5" strokeLinecap="round" />
      <path d="M 85 112 Q 80 80 110 78 Q 110 105 85 112 Z" fill="#D8B4FE" fillOpacity="0.7" stroke="#581C87" strokeWidth="2" />
      <path d="M 140 75 Q 170 70 180 92 Q 150 100 140 75 Z" fill="#2DD4BF" fillOpacity="0.55" stroke="#115E59" strokeWidth="2" />
    </svg>

    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-28 sm:h-40 opacity-70">
      <path d="M 0 140 Q 240 60 480 130 T 960 115 T 1440 130 L 1440 220 L 0 220 Z" fill="#CCFBF1" fillOpacity="0.55" />
      <path d="M 0 165 Q 320 95 640 155 T 1280 140 L 1440 165 L 1440 220 L 0 220 Z" fill="#F3E8FF" fillOpacity="0.65" />
      <path d="M 0 140 Q 240 60 480 130 T 960 115 T 1440 130" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeDasharray="10 6" />
      <path d="M 0 165 Q 320 95 640 155 T 1280 140" fill="none" stroke="#9333EA" strokeWidth="2.5" />
    </svg>

    {animate && (
      <>
        <div className="absolute top-20 left-2 sm:left-6 opacity-85 animate-float">
          <GerberaFlower size={46} variant="purple" />
        </div>
        <div className="absolute top-44 right-2 sm:right-8 opacity-85 animate-float" style={{ animationDelay: '1.3s' }}>
          <GerberaFlower size={54} variant="teal" />
        </div>
        <div className="absolute bottom-24 left-4 sm:left-10 opacity-85 animate-float hidden md:block" style={{ animationDelay: '0.7s' }}>
          <GerberaFlower size={66} variant="lavender" withStem />
        </div>
        <div className="absolute bottom-20 right-4 sm:right-12 opacity-85 animate-float hidden md:block" style={{ animationDelay: '1.9s' }}>
          <GerberaFlower size={62} variant="aqua" withStem />
        </div>
      </>
    )}
  </div>
);
