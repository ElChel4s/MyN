import React, { useRef, useState } from 'react';
import { Camera, Maximize2, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';

export const FloatingOngoing = () => {
  const {
    activeOngoingDate,
    isLiveDateModalOpen,
    setIsLiveDateModalOpen,
    uploadAndAddPhotoToOngoing
  } = useAppContext();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!activeOngoingDate || isLiveDateModalOpen) return null;

  const handleQuickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadAndAddPhotoToOngoing(file);
    } finally {
      setIsUploading(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-7 right-3 sm:right-7 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Inputs ocultos para cámara y galería directos desde el widget flotante */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleQuickPhoto}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleQuickPhoto}
        className="hidden"
      />

      {/* Botones rápidos flotantes para sacar foto o subir de galería */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          disabled={isUploading}
          onClick={() => cameraInputRef.current?.click()}
          className="p-3 bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-full shadow-[3px_3px_0px_0px_#0f172a] hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          title="📸 Sacar foto rápida con la cámara"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => galleryInputRef.current?.click()}
          className="p-2.5 bg-white/95 hover:bg-white text-purple-900 border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
          title="🖼️ Subir foto desde la galería"
        >
          <ImageIcon className="w-4 h-4 text-purple-800" />
        </button>
      </div>

      {/* Tarjeta principal de la cita en curso */}
      <button
        onClick={() => setIsLiveDateModalOpen(true)}
        className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-teal-600 text-white border-2 border-purple-950 sketch-box shadow-[4px_5px_0px_0px_#134E4A] hover:scale-[1.02] transition-all cursor-pointer text-left"
        title="Toca para abrir detalles, notas y fotos de la cita en curso"
      >
        <div className="relative">
          <GerberaFlower size={34} variant="teal" spin />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-300 border border-teal-950 animate-ping" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 flex items-center gap-1">
              Cita en curso • Toca para abrir
            </span>
            {activeOngoingDate.photos.length > 0 && (
              <span className="text-[10px] bg-teal-300 text-teal-950 px-2 py-0.2 rounded-full font-bold shadow-xs">
                {activeOngoingDate.photos.length} {activeOngoingDate.photos.length === 1 ? 'foto' : 'fotos'}
              </span>
            )}
          </div>
          <p className="font-hand text-xl font-bold leading-none max-w-[160px] sm:max-w-[210px] truncate">
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
