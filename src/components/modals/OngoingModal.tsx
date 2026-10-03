import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Calendar, Camera, Trash2, Plus, Smile, PenTool, MessageSquareHeart, Eye, EyeOff, Heart, Quote, Check, Minimize2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { DateMemory, DatePhoto } from '../../lib/types';

export const OngoingModal = () => {
  const {
    activeOngoingDate,
    setActiveOngoingDate,
    isLiveDateModalOpen,
    setIsLiveDateModalOpen,
    currentUserSlot,
    user1Alias,
    user2Alias,
    surpriseNiceNotes,
    setSurpriseNiceNotes,
    showToast,
    memories,
    setMemories,
    wishlist,
    setWishlist,
    setActiveTab,
    saveOngoingDateToBitacora,
    uploadAndAddPhotoToOngoing,
    deletePhotoFromOngoing
  } = useAppContext();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoSecret, setNewPhotoSecret] = useState('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleMinimize = () => {
    setIsLiveDateModalOpen(false);
    showToast('Cita minimizada. Sigue disponible en el botón flotante.');
  };

  useEffect(() => {
    if (!isLiveDateModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleMinimize();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLiveDateModalOpen]);

  if (!activeOngoingDate || !isLiveDateModalOpen) return null;

  const toggleFlip = (photoId: string) => {
    setFlippedCards((prev) => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeOngoingDate) return;

    try {
      setIsUploadingPhoto(true);
      await uploadAndAddPhotoToOngoing(file, newPhotoCaption, newPhotoSecret);
      setNewPhotoCaption('');
      setNewPhotoSecret('');
    } catch (err: any) {
      console.error('Error al subir foto:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleAddPhotoToOngoing = () => {
    if (!activeOngoingDate) return;
    const defaultPhotos = [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ];
    const chosenUrl = newPhotoUrl.trim() || defaultPhotos[activeOngoingDate.photos.length % defaultPhotos.length];

    const newPhotoObj = {
      id: `p-${Date.now()}`,
      url: chosenUrl,
      caption: newPhotoCaption.trim() || activeOngoingDate.title,
      secret_back: newPhotoSecret.trim() || 'Momento especial guardado en la cita.',
      rotation: activeOngoingDate.photos.length % 2 === 0 ? '-2deg' : '2deg'
    };

    setActiveOngoingDate({
      ...activeOngoingDate,
      photos: [...activeOngoingDate.photos, newPhotoObj]
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoSecret('');
    showToast('Foto Polaroid añadida');
  };

  const handleRemovePhotoFromOngoing = async (photoId: string) => {
    await deletePhotoFromOngoing(photoId);
  };

  const handleSaveOngoingToBitacora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOngoingDate) return;

    const finalPhotos =
      activeOngoingDate.photos.length > 0
        ? activeOngoingDate.photos
        : [
            {
              id: `p-def-${Date.now()}`,
              url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
              caption: activeOngoingDate.title,
              secret_back: 'Recuerdo guardado en nuestra bitácora.',
              rotation: '-2deg'
            }
          ];

    const dateNum = memories.length + 1;
    const formattedNum = String(dateNum).padStart(3, '0');
    const stampCode = activeOngoingDate.stamp_code || `CITA #${formattedNum}`;

    const completedEntry: DateMemory = {
      id: activeOngoingDate.isEditingExistingMemory ? activeOngoingDate.id : activeOngoingDate.id || `mem-${Date.now()}`,
      title: activeOngoingDate.title.trim() || 'Nuestra cita',
      scheduled_date: activeOngoingDate.scheduled_date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      location_name: activeOngoingDate.location_name || 'Rincón compartido',
      gerbera_color: activeOngoingDate.gerbera_color || 'purple',
      stamp_code: stampCode,
      date_number: dateNum,
      fromWishId: activeOngoingDate.fromWishId,
      random_quote: activeOngoingDate.random_quote.trim() || '«Los mejores momentos son los que se disfrutan de principio a fin.»',
      person1_liked: activeOngoingDate.person1_liked.trim() || 'Todo el ambiente y lo bien que la pasamos juntos.',
      person2_liked: activeOngoingDate.person2_liked.trim() || 'La charla, las risas y cada detalle del plan.',
      person1_nice_note: activeOngoingDate.person1_nice_note.trim() || 'Me encanta compartir este tipo de salidas contigo.',
      person2_nice_note: activeOngoingDate.person2_nice_note.trim() || 'Gracias por hacer que cada salida sea tan especial.',
      photos: finalPhotos
    };

    await saveOngoingDateToBitacora(completedEntry);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleMinimize();
        }
      }}
    >
      <div
        className="bg-[#FCFBF7] border-4 border-purple-900 sketch-box max-w-3xl w-full p-4 sm:p-7 relative shadow-2xl my-6 pencil-shade-mixed max-h-[92vh] overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-purple-300 pb-3">
          <div className="flex items-center gap-2.5">
            <GerberaFlower size={42} variant="teal" spin />
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-400">
                <Heart className="w-3 h-3 text-teal-700 fill-teal-200" />
                {activeOngoingDate.isEditingExistingMemory ? 'Editando recuerdos de la cita' : 'Cita en curso • Registro compartido'}
              </span>
              <input
                type="text"
                value={activeOngoingDate.title}
                onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, title: e.target.value })}
                className="block w-full font-hand text-2xl sm:text-4xl font-bold text-purple-950 bg-transparent border-b border-transparent focus:border-purple-400 focus:outline-none mt-0.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleMinimize}
              className="px-3.5 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-950 border-2 border-purple-500 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Minimizar (la cita sigue activa en el botón flotante)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Minimizar</span>
            </button>
            <button
              type="button"
              onClick={handleMinimize}
              className="p-1.5 rounded-full bg-white hover:bg-purple-100 text-slate-600 hover:text-purple-950 border border-purple-300 transition-colors cursor-pointer"
              title="Cerrar y minimizar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveOngoingToBitacora} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5 text-teal-700" /> Lugar de la cita</label>
              <input type="text" value={activeOngoingDate.location_name} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, location_name: e.target.value })} placeholder="¿Dónde estamos?" className="w-full px-3 py-1.5 bg-white border-2 border-teal-400 rounded-xl font-sketch text-base" />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1 mb-1"><Calendar className="w-3.5 h-3.5 text-purple-700" /> Fecha (opcional)</label>
              <input type="text" value={activeOngoingDate.scheduled_date} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, scheduled_date: e.target.value })} placeholder="Ej. Hoy / 30 Sep 2026" className="w-full px-3 py-1.5 bg-white border-2 border-purple-300 rounded-xl font-sketch text-base" />
            </div>
          </div>

          <div className="bg-white/90 border-2 border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-700" /> 1. Las Fotos Polaroid ({activeOngoingDate.photos.length})
              </h4>
              <span className="text-[11px] font-sketch text-slate-500">Toca cualquier polaroid para ver su reverso</span>
            </div>

            {activeOngoingDate.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {activeOngoingDate.photos.map((p) => {
                  const isFlipped = !!flippedCards[p.id];
                  return (
                    <div
                      key={p.id}
                      className="relative bg-white p-2 border-2 border-slate-300 rounded-xl shadow-xs cursor-pointer group hover:-translate-y-0.5 transition-all"
                      onClick={() => toggleFlip(p.id)}
                      title="Toca para voltear la Polaroid"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhotoFromOngoing(p.id);
                        }}
                        className="absolute -top-1.5 -right-1.5 z-10 bg-white text-rose-600 p-1 rounded-full shadow border border-slate-200 hover:bg-rose-50"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {isFlipped ? (
                        <div className="h-28 sm:h-32 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 flex flex-col justify-between text-left">
                          <p className="text-[10px] font-bold uppercase text-purple-700">Nota secreta al dorso:</p>
                          <p className="font-hand text-base text-slate-800 line-clamp-3">“{p.secret_back}”</p>
                          <span className="text-[9px] text-teal-700 italic text-right">Toca para ver foto</span>
                        </div>
                      ) : (
                        <div>
                          <div className="w-full h-24 sm:h-26 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                          </div>
                          <p className="font-hand text-sm text-center truncate mt-1 text-slate-800">{p.caption}</p>
                          <span className="block text-[9px] text-slate-400 text-center font-sketch">Toca para ver reverso</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Controles para añadir Polaroid con compresión automática */}
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border-2 border-dashed border-purple-300 space-y-3">
              {/* Inputs ocultos: cámara directa para celulares y selector de archivos/galería */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelected}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelected}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Botón 1: Tomar foto directa con la cámara */}
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-sketch text-base rounded-xl border-2 border-slate-900 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-60"
                  title="Abre la cámara del teléfono o dispositivo para sacar una foto en el momento"
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-teal-200" />
                      <span>Comprimiendo foto...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-teal-200" />
                      <span className="font-bold">Sacar Foto con Cámara</span>
                    </>
                  )}
                </button>

                {/* Botón 2: Subir foto desde la galería o archivos */}
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-sketch text-base rounded-xl border-2 border-slate-900 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-60"
                  title="Elige una foto guardada en tu galería o fotos del teléfono"
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
                      <span>Comprimiendo foto...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 text-purple-200" />
                      <span className="font-bold">Subir de la Galería</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Pie de foto visible (ej. Probando el helado...)"
                  className="px-3 py-1.5 bg-white border border-purple-300 rounded-xl font-sketch text-sm focus:outline-none focus:border-purple-600"
                />
                <input
                  type="text"
                  value={newPhotoSecret}
                  onChange={(e) => setNewPhotoSecret(e.target.value)}
                  placeholder="Nota secreta al dorso (ej. Te veías hermosa...)"
                  className="px-3 py-1.5 bg-white border border-teal-300 rounded-xl font-sketch text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Opción secundaria: URL web directa si no es archivo local */}
              <div className="flex items-center gap-2 pt-1 border-t border-purple-200 text-xs">
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="O pegar URL web de foto (opcional)"
                  className="flex-1 px-2.5 py-1 bg-white/80 border border-slate-300 rounded-lg font-sketch text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoToOngoing}
                  className="px-3 py-1 bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg font-sketch text-xs font-bold cursor-pointer shrink-0"
                >
                  Añadir por URL
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2"><Smile className="w-5 h-5 text-teal-700" /> 2. ¿Qué fue lo que más les gustó de la cita?</h4>
              <span className="text-[11px] font-sketch text-slate-600">Escribiendo como: <strong className="text-purple-900">{currentUserSlot === 1 ? user1Alias : user2Alias}</strong></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`bg-teal-50/90 p-3 rounded-2xl border-2 transition-all ${currentUserSlot === 1 ? 'border-teal-700 ring-2 ring-teal-400/60 shadow-md' : 'border-teal-500/70 opacity-90'}`}>
                <label className="text-xs font-bold text-teal-950 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5 text-teal-700" /> {user1Alias} (Trazo turquesa)</span>
                  {currentUserSlot === 1 && <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full">Tu espacio</span>}
                </label>
                <textarea rows={2} value={activeOngoingDate.person1_liked} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, person1_liked: e.target.value })} placeholder="Lo que más me gustó de hoy fue..." className="w-full p-2.5 bg-white border border-teal-400 rounded-xl font-sketch text-base focus:outline-none" />
              </div>
              <div className={`bg-purple-50/90 p-3 rounded-2xl border-2 transition-all ${currentUserSlot === 2 ? 'border-purple-700 ring-2 ring-purple-400/60 shadow-md' : 'border-purple-500/70 opacity-90'}`}>
                <label className="text-xs font-bold text-purple-950 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5 text-purple-700" /> {user2Alias} (Trazo morado)</span>
                  {currentUserSlot === 2 && <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full">Tu espacio</span>}
                </label>
                <textarea rows={2} value={activeOngoingDate.person2_liked} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, person2_liked: e.target.value })} placeholder="Lo que más me gustó de hoy fue..." className="w-full p-2.5 bg-white border border-purple-400 rounded-xl font-sketch text-base focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2"><MessageSquareHeart className="w-5 h-5 text-purple-700" /> 3. Algo bonito sobre la otra persona</h4>
              <button type="button" onClick={() => setSurpriseNiceNotes(!surpriseNiceNotes)} className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border border-purple-400 bg-purple-50 text-purple-900 hover:bg-purple-100 cursor-pointer transition-colors">
                {surpriseNiceNotes ? <><Eye className="w-3.5 h-3.5 text-purple-700" /> Revelar notas</> : <><EyeOff className="w-3.5 h-3.5 text-purple-700" /> Modo sorpresa (ocultar)</>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-2xl border-2 border-teal-500 shadow-xs">
                <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5 mb-1"><Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-100" /> De {user1Alias} para {user2Alias}</label>
                {surpriseNiceNotes && currentUserSlot === 2 ? (
                  <div className="p-3 bg-teal-50/70 border border-dashed border-teal-400 rounded-xl text-center font-sketch text-sm text-teal-900">Nota sorpresa oculta para no arruinar el misterio.</div>
                ) : (
                  <textarea rows={2} value={activeOngoingDate.person1_nice_note} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, person1_nice_note: e.target.value })} placeholder="Algo lindo que noté de ti..." className="w-full p-2.5 bg-teal-50/40 border border-teal-300 rounded-xl font-sketch text-base focus:outline-none" />
                )}
              </div>
              <div className="bg-white p-3 rounded-2xl border-2 border-purple-500 shadow-xs">
                <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5 mb-1"><Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-100" /> De {user2Alias} para {user1Alias}</label>
                {surpriseNiceNotes && currentUserSlot === 1 ? (
                  <div className="p-3 bg-purple-50/70 border border-dashed border-purple-400 rounded-xl text-center font-sketch text-sm text-purple-900">Nota sorpresa oculta para no arruinar el misterio.</div>
                ) : (
                  <textarea rows={2} value={activeOngoingDate.person2_nice_note} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, person2_nice_note: e.target.value })} placeholder="Algo lindo que noté de ti..." className="w-full p-2.5 bg-purple-50/40 border border-purple-300 rounded-xl font-sketch text-base focus:outline-none" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-purple-800 shadow-sm">
            <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5 mb-1"><Quote className="w-4 h-4 text-purple-600" /> 4. La frase random (algo gracioso o especial que se dijo)</label>
            <input type="text" value={activeOngoingDate.random_quote} onChange={(e) => setActiveOngoingDate({ ...activeOngoingDate, random_quote: e.target.value })} placeholder="«Escribe aquí la frase textual...»" className="w-full px-3.5 py-2 bg-purple-50/50 border-2 border-purple-300 rounded-xl font-hand text-2xl text-purple-950 focus:outline-none focus:border-purple-700" />
          </div>

          <div className="pt-3 border-t border-dashed border-purple-300 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMinimize}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-purple-950 bg-purple-100/90 hover:bg-purple-200 rounded-xl border border-purple-400 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
              >
                <Minimize2 className="w-4 h-4 text-purple-700" />
                Minimizar (sigue en el botón flotante)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Deseas descartar esta salida en curso? No se guardará en la bitácora.')) {
                    setActiveOngoingDate(null);
                    setIsLiveDateModalOpen(false);
                    showToast('Cita cancelada');
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 underline underline-offset-2 p-1 font-sketch cursor-pointer"
              >
                Descartar cita
              </button>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-sketch text-base sm:text-lg border-2 border-purple-950 sketch-box shadow-[3px_3px_0px_0px_#134E4A] hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <Check className="w-4 h-4 text-white" /> Guardar en Bitácora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
