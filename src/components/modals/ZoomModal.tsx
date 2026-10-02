import React from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const ZoomModal = () => {
  const { zoomedPhoto, setZoomedPhoto } = useAppContext();

  if (!zoomedPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-5xl w-full flex flex-col items-center">
        <button
          onClick={() => setZoomedPhoto(null)}
          className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <img
          src={zoomedPhoto.url}
          alt={zoomedPhoto.caption}
          className="max-h-[80vh] object-contain border-4 border-white rounded-sm shadow-2xl"
        />
        
        <div className="mt-4 text-center text-white bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md">
          <p className="font-hand text-2xl">{zoomedPhoto.caption}</p>
          <p className="font-sketch text-sm text-slate-300 mt-1">Reverso: {zoomedPhoto.secret_back}</p>
        </div>
      </div>
    </div>
  );
};
