import React from 'react';
import { RotateCw, ZoomIn, Sparkles } from 'lucide-react';
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
      style={{ transform: `rotate(${photo.rotation || (idx % 2 === 0 ? '-2deg' : '2deg')})` }}
      className="relative group mx-auto w-full max-w-[260px] transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Cinta washi decorativa */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <WashiTape color={idx % 2 === 0 ? 'purple' : 'teal'} rotate={idx % 2 === 0 ? '-2.5deg' : '3deg'} />
      </div>

      {/* Flor gerbera de esquina */}
      <div className="absolute -bottom-3 -right-3 z-20 pointer-events-none">
        <GerberaFlower size={38} variant={(idx % 2 === 0 ? gerberaColor : 'lavender') as any} />
      </div>

      {/* Tarjeta Polaroid */}
      <div
        onClick={() => onToggleFlip(photo.id)}
        className="bg-white p-2.5 pb-4 border-2 border-slate-800 shadow-[4px_6px_0px_0px_rgba(88,28,135,0.22)] cursor-pointer select-none rounded-sm transition-all"
        title="Toca para voltear la Polaroid"
      >
        {!isFlipped ? (
          /* Frente de la Polaroid */
          <>
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 border border-slate-300">
              <img
                src={photo.url}
                alt={photo.caption || 'Foto de recuerdo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Botón Zoom */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoom(photo);
                }}
                className="absolute top-2 left-2 bg-white/90 hover:bg-white text-purple-900 p-1.5 rounded-full shadow border border-slate-300 transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                title="Ampliar foto"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Botón Voltear Reverso */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFlip(photo.id);
                }}
                className="absolute top-2 right-2 bg-slate-900/75 hover:bg-slate-900 text-white text-[10px] font-sketch px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer z-10"
                title="Ver detalles detrás"
              >
                <RotateCw className="w-2.5 h-2.5" />
                <span>Reverso</span>
              </button>
            </div>

            {/* Pie de foto de la Polaroid */}
            <p className="font-hand text-lg sm:text-xl text-slate-900 text-center mt-2.5 px-1 leading-snug font-bold">
              {photo.caption || 'Momento inolvidable ✨'}
            </p>
          </>
        ) : (
          /* Reverso de la Polaroid (Solo detalles y pie de foto, sin notas secretas) */
          <div className="aspect-square w-full bg-[#FAF7EE] border-2 border-dashed border-purple-300 p-4 flex flex-col items-center justify-between text-center pencil-shade-teal relative">
            <div className="flex items-center justify-between w-full border-b border-purple-200 pb-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-teal-800 flex items-center gap-1 font-sketch">
                <Sparkles className="w-3 h-3 text-purple-600" /> Polaroid #{idx + 1}
              </span>
              <span className="text-[9px] font-sketch font-bold bg-white text-purple-900 px-2 py-0.5 rounded-full border border-purple-200">
                Detalles
              </span>
            </div>

            {/* Texto y explicación del momento */}
            <div className="my-auto py-2">
              <p className="font-hand text-xl sm:text-2xl text-purple-950 leading-snug">
                “{photo.caption || 'Un instante que guardamos con todo el corazón.'}”
              </p>
            </div>

            {/* Pie del reverso */}
            <div className="w-full pt-1.5 border-t border-purple-200 flex items-center justify-center gap-1 text-[11px] font-sketch text-teal-700">
              <RotateCw className="w-3 h-3" />
              <span>Toca para ver la foto</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
