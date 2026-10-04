import React from 'react';
import { RotateCw, Heart, ZoomIn } from 'lucide-react';
import { DatePhoto } from '../../lib/types';
import { WashiTape } from './WashiTape';
import { GerberaFlower } from './GerberaFlower';

interface PolaroidCardProps {
  photo: DatePhoto;
  idx: number;
  isFlipped: boolean;
  gerberaColor: string;
  onToggleFlip: (id: string) => void;
  onZoom: (photo: DatePhoto) => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  photo,
  idx,
  isFlipped,
  gerberaColor,
  onToggleFlip,
  onZoom
}) => {
  return (
    <div
      style={{ transform: `rotate(${photo.rotation || '-2deg'})` }}
      className="relative group mx-auto w-full max-w-[250px]"
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <WashiTape color={idx % 2 === 0 ? 'purple' : 'teal'} rotate={idx % 2 === 0 ? '-2deg' : '3deg'} />
      </div>

      <div className="absolute -bottom-3 -right-3 z-20">
        <GerberaFlower size={40} variant={(idx % 2 === 0 ? gerberaColor : 'lavender') as any} />
      </div>

      <div
        onClick={() => {
          if (photo.secret_back?.trim()) {
            onToggleFlip(photo.id);
          } else {
            onZoom(photo);
          }
        }}
        className="bg-white p-2.5 pb-4 border-2 border-slate-800 shadow-[4px_6px_0px_0px_rgba(88,28,135,0.22)] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      >
        {!isFlipped || !photo.secret_back?.trim() ? (
          <>
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 border border-slate-300">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoom(photo);
                }}
                className="absolute top-2 left-2 bg-white/90 hover:bg-white text-purple-900 p-1.5 rounded-full shadow"
                title="Ver foto en grande"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {photo.secret_back?.trim() && (
                <span className="absolute top-2 right-2 bg-black/65 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <RotateCw className="w-2.5 h-2.5" />
                  Reverso
                </span>
              )}
            </div>
            <p className="font-hand text-lg sm:text-xl text-slate-900 text-center mt-2.5 leading-snug">
              {photo.caption}
            </p>
          </>
        ) : (
          <div className="aspect-square w-full bg-[#FDFBF2] border border-dashed border-purple-400 p-3.5 flex flex-col items-center justify-center text-center pencil-shade-teal">
            <Heart className="w-5 h-5 text-purple-600 fill-purple-200 mb-1.5" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Escrito detrás de la foto:
            </p>
            <p className="font-hand text-xl sm:text-2xl text-purple-950 mt-2">
              “{photo.secret_back}”
            </p>
            <span className="mt-3 text-[10px] text-teal-700 underline">
              Toca para volver a la foto
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
