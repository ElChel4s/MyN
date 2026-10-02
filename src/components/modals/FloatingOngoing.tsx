import React from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';

export const FloatingOngoing = () => {
  const { activeOngoingDate, isLiveDateModalOpen, setIsLiveDateModalOpen } = useAppContext();

  if (!activeOngoingDate || isLiveDateModalOpen) return null;

  return (
    <div className="fixed bottom-20 md:bottom-7 right-4 sm:right-7 z-40 animate-pulse-gentle">
      <button
        onClick={() => setIsLiveDateModalOpen(true)}
        className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-teal-600 text-white border-2 border-purple-950 sketch-box shadow-[4px_5px_0px_0px_#134E4A] hover:scale-105 transition-all cursor-pointer"
        title="Toca para abrir la cita en curso"
      >
        <div className="relative">
          <GerberaFlower size={34} variant="teal" spin />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-300 border border-teal-950 animate-ping" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 flex items-center gap-1">
              <Camera className="w-3 h-3" /> Cita en curso • Toca para abrir
            </span>
            {activeOngoingDate.photos.length > 0 && (
              <span className="text-[9px] bg-teal-300 text-teal-950 px-1.5 py-0.5 rounded-full font-bold">
                {activeOngoingDate.photos.length} {activeOngoingDate.photos.length === 1 ? 'foto' : 'fotos'}
              </span>
            )}
          </div>
          <p className="font-hand text-xl font-bold leading-none max-w-[180px] sm:max-w-[220px] truncate">
            {activeOngoingDate.title}
          </p>
        </div>
        <div className="ml-1 bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
          <Maximize2 className="w-4 h-4 text-teal-100" />
        </div>
      </button>
    </div>
  );
};
