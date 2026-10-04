import React from 'react';
import { X, Calendar, MapPin, Smile, MessageSquareHeart, Quote, Camera, Heart, PenTool, Edit3 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { PolaroidCard } from '../ui/PolaroidCard';

export const MemoryDetailModal = () => {
  const {
    selectedMemory,
    setSelectedMemory,
    flippedPolaroids,
    setFlippedPolaroids,
    setZoomedPhoto,
    user1Alias,
    user2Alias,
    currentUserSlot,
    setIsLiveDateModalOpen,
    setActiveOngoingDate
  } = useAppContext();

  if (!selectedMemory) return null;

  const toggleFlip = (id: string) => {
    setFlippedPolaroids((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditMemory = () => {
    setActiveOngoingDate({ ...selectedMemory, isEditingExistingMemory: true });
    setIsLiveDateModalOpen(true);
    setSelectedMemory(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FCFBF7] border-4 border-purple-900 sketch-box max-w-4xl w-full relative shadow-2xl pencil-shade-purple my-4 max-h-[92vh] flex flex-col">
        <div className="shrink-0 p-4 sm:p-6 border-b border-dashed border-purple-300 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-white text-purple-900 border border-purple-300 sketch-pill">
                <Calendar className="w-3 h-3 text-purple-600" /> {selectedMemory.scheduled_date}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-300 sketch-pill">
                <MapPin className="w-3 h-3 text-teal-700" /> {selectedMemory.location_name}
              </span>
            </div>
            <h2 className="font-hand text-3xl sm:text-5xl font-bold text-purple-950 leading-tight">
              {selectedMemory.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="shrink-0 border-2 border-double border-teal-700 px-3 py-1.5 rounded-xl rotate-6 bg-teal-50 text-center shadow-sm hidden sm:block">
              <p className="font-sketch text-sm font-bold text-teal-900">{selectedMemory.stamp_code}</p>
            </div>
            <button
              onClick={() => setSelectedMemory(null)}
              className="p-2 bg-white rounded-full border-2 border-purple-300 text-purple-900 hover:bg-purple-100 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="bg-white/80 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 relative">
            <div className="absolute -top-3 -right-3 opacity-90 z-10">
              <GerberaFlower size={60} variant={selectedMemory.gerbera_color as any} />
            </div>
            <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-teal-700" /> Fotos Polaroid ({selectedMemory.photos.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
              {selectedMemory.photos.map((photo: any, pIdx: number) => (
                <PolaroidCard
                  key={photo.id}
                  photo={photo}
                  idx={pIdx}
                  isFlipped={!!flippedPolaroids[photo.id]}
                  gerberaColor={selectedMemory.gerbera_color}
                  onToggleFlip={toggleFlip}
                  onZoom={setZoomedPhoto}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-teal-50/90 border-2 border-teal-700 sketch-box p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="w-4 h-4 text-teal-700" />
                  <h4 className="font-hand text-xl font-bold text-slate-900">Lo que le gustó a {user1Alias}</h4>
                </div>
                <p className="font-sketch text-base text-slate-800 bg-white/60 p-3 rounded-xl border border-dashed border-teal-400">
                  “{selectedMemory.person1_liked}”
                </p>
              </div>

              <div className="bg-purple-50/90 border-2 border-purple-700 sketch-box-alt p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="w-4 h-4 text-purple-700" />
                  <h4 className="font-hand text-xl font-bold text-slate-900">Lo que le gustó a {user2Alias}</h4>
                </div>
                <p className="font-sketch text-base text-slate-800 bg-white/60 p-3 rounded-xl border border-dashed border-purple-400">
                  “{selectedMemory.person2_liked}”
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-300 w-fit">
                <MessageSquareHeart className="w-3.5 h-3.5 text-purple-700" />
                <span>Notas secretas reveladas de la cita</span>
              </div>

              <div className="bg-white/95 border-2 border-teal-600 sketch-box p-4 relative shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-2">
                  <Heart className="w-4 h-4 text-teal-600 fill-teal-100" /> 
                  <span>Lo que {user1Alias} escribió para {user2Alias}:</span>
                </div>
                <p className="font-sketch text-base text-slate-800 italic">“{selectedMemory.person1_nice_note || 'Un recuerdo lleno de cariño.'}”</p>
              </div>

              <div className="bg-white/95 border-2 border-purple-600 sketch-box-alt p-4 relative shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
                  <Heart className="w-4 h-4 text-purple-600 fill-purple-100" /> 
                  <span>Lo que {user2Alias} escribió para {user1Alias}:</span>
                </div>
                <p className="font-sketch text-base text-slate-800 italic">“{selectedMemory.person2_nice_note || 'Un recuerdo lleno de cariño.'}”</p>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-teal-50 border-2 border-slate-800 sketch-box p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-800 mb-2">
                  <Quote className="w-4 h-4 text-purple-600" /> Frase de la cita
                </div>
                <p className="font-hand text-2xl text-purple-950 leading-snug">{selectedMemory.random_quote}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="shrink-0 p-4 border-t border-dashed border-purple-300 flex justify-end">
          <button
            onClick={handleEditMemory}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-sketch text-base font-bold rounded-xl border border-purple-400"
          >
            <Edit3 className="w-4 h-4" /> Editar recuerdos o agregar fotos
          </button>
        </div>
      </div>
    </div>
  );
};
