import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Camera,
  Trash2,
  Smile,
  PenTool,
  MessageSquareHeart,
  Heart,
  Quote,
  Check,
  Minimize2,
  Loader2,
  Image as ImageIcon,
  Lock,
  RotateCw,
  Edit3
} from 'lucide-react';
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
    showToast,
    memories,
    saveOngoingDateToBitacora,
    uploadAndAddPhotoToOngoing,
    deletePhotoFromOngoing,
    updatePhotoCaption
  } = useAppContext();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Estados para captura interactiva de foto con pie de foto inmediato
  const [pendingCaptureFile, setPendingCaptureFile] = useState<File | null>(null);
  const [pendingCapturePreview, setPendingCapturePreview] = useState<string | null>(null);
  const [pendingCaptureCaption, setPendingCaptureCaption] = useState('');

  // Estado para edición en línea de pie de fotos ya existentes
  const [editingCaptionPhotoId, setEditingCaptionPhotoId] = useState<string | null>(null);
  const [editingCaptionText, setEditingCaptionText] = useState('');

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

  // Turno aleatorio para registrar la frase random (determinado por el ID de la cita o slot elegido)
  const quoteTurnSlot: 1 | 2 =
    activeOngoingDate.quote_turn_slot ||
    ((activeOngoingDate.id.charCodeAt(0) +
      (activeOngoingDate.id.charCodeAt(activeOngoingDate.id.length - 1) || 0)) %
      2 ===
    0
      ? 1
      : 2);

  const handleRerollQuoteTurn = () => {
    const nextSlot = quoteTurnSlot === 1 ? 2 : 1;
    setActiveOngoingDate({
      ...activeOngoingDate,
      quote_turn_slot: nextSlot
    });
    showToast(`🎲 Turno de la frase cambiado a: ${nextSlot === 1 ? user1Alias : user2Alias}`);
  };

  const handleCameraFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeOngoingDate) return;
    const preview = URL.createObjectURL(file);
    setPendingCaptureFile(file);
    setPendingCapturePreview(preview);
    setPendingCaptureCaption('');
  };

  const handleGalleryFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !activeOngoingDate) return;

    if (files.length === 1) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setPendingCaptureFile(file);
      setPendingCapturePreview(preview);
      setPendingCaptureCaption('');
      return;
    }

    // Subida múltiple (sin límite de fotos)
    try {
      setIsUploadingPhoto(true);
      showToast(`Comprimiendo ${files.length} fotos para la cita...`);
      for (let i = 0; i < files.length; i++) {
        await uploadAndAddPhotoToOngoing(files[i], `Recuerdo #${activeOngoingDate.photos.length + i + 1}`);
      }
      showToast(`¡${files.length} fotos agregadas a la cita! 📸`);
    } catch (err: any) {
      console.error('Error al subir múltiples fotos:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleConfirmCapture = async (caption: string) => {
    if (!pendingCaptureFile) return;
    const fileToUpload = pendingCaptureFile;
    setPendingCaptureFile(null);
    setPendingCapturePreview(null);
    try {
      setIsUploadingPhoto(true);
      await uploadAndAddPhotoToOngoing(fileToUpload, caption.trim());
    } catch (err: any) {
      console.error('Error al subir foto:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleSaveEditedCaption = async (photoId: string) => {
    if (!editingCaptionPhotoId) return;
    await updatePhotoCaption(photoId, editingCaptionText);
    setEditingCaptionPhotoId(null);
  };

  const handleAddPhotoToOngoing = () => {
    if (!activeOngoingDate) return;
    const defaultPhotos = [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ];
    const chosenUrl =
      newPhotoUrl.trim() ||
      defaultPhotos[activeOngoingDate.photos.length % defaultPhotos.length];

    const newPhotoObj: DatePhoto = {
      id: `p-${Date.now()}`,
      url: chosenUrl,
      caption: newPhotoCaption.trim() || activeOngoingDate.title,
      secret_back: '',
      rotation: activeOngoingDate.photos.length % 2 === 0 ? '-2deg' : '2deg'
    };

    setActiveOngoingDate({
      ...activeOngoingDate,
      photos: [...activeOngoingDate.photos, newPhotoObj]
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
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
              secret_back: '',
              rotation: '-2deg'
            }
          ];

    const dateNum = memories.length + 1;
    const formattedNum = String(dateNum).padStart(3, '0');
    const stampCode = activeOngoingDate.stamp_code || `CITA #${formattedNum}`;

    const completedEntry: DateMemory = {
      id: activeOngoingDate.isEditingExistingMemory
        ? activeOngoingDate.id
        : activeOngoingDate.id || `mem-${Date.now()}`,
      title: activeOngoingDate.title.trim() || 'Nuestra cita',
      scheduled_date:
        activeOngoingDate.scheduled_date ||
        new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      location_name: activeOngoingDate.location_name || 'Rincón compartido',
      gerbera_color: activeOngoingDate.gerbera_color || 'purple',
      stamp_code: stampCode,
      date_number: dateNum,
      fromWishId: activeOngoingDate.fromWishId,
      quote_turn_slot: quoteTurnSlot,
      random_quote:
        activeOngoingDate.random_quote.trim() ||
        '«Los mejores momentos son los que se disfrutan de principio a fin.»',
      person1_liked:
        activeOngoingDate.person1_liked.trim() ||
        'Todo el ambiente y lo bien que la pasamos juntos.',
      person2_liked:
        activeOngoingDate.person2_liked.trim() ||
        'La charla, las risas y cada detalle del plan.',
      person1_nice_note:
        activeOngoingDate.person1_nice_note.trim() ||
        'Me encanta compartir este tipo de salidas contigo.',
      person2_nice_note:
        activeOngoingDate.person2_nice_note.trim() ||
        'Gracias por hacer que cada salida sea tan especial.',
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
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-purple-300 pb-3">
          <div className="flex items-center gap-2.5">
            <GerberaFlower size={42} variant="teal" spin />
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-400">
                <Heart className="w-3 h-3 text-teal-700 fill-teal-200" />
                {activeOngoingDate.isEditingExistingMemory
                  ? 'Editando recuerdos de la cita'
                  : 'Cita en curso • Registro compartido'}
              </span>
              <input
                type="text"
                value={activeOngoingDate.title}
                onChange={(e) =>
                  setActiveOngoingDate({
                    ...activeOngoingDate,
                    title: e.target.value
                  })
                }
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
          {/* Lugar y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-teal-700" /> Lugar de la cita
              </label>
              <input
                type="text"
                value={activeOngoingDate.location_name}
                onChange={(e) =>
                  setActiveOngoingDate({
                    ...activeOngoingDate,
                    location_name: e.target.value
                  })
                }
                placeholder="¿Dónde estamos?"
                className="w-full px-3 py-1.5 bg-white border-2 border-teal-400 rounded-xl font-sketch text-base"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-700" /> Fecha (opcional)
              </label>
              <input
                type="text"
                value={activeOngoingDate.scheduled_date}
                onChange={(e) =>
                  setActiveOngoingDate({
                    ...activeOngoingDate,
                    scheduled_date: e.target.value
                  })
                }
                placeholder="Ej. Hoy / 30 Sep 2026"
                className="w-full px-3 py-1.5 bg-white border-2 border-purple-300 rounded-xl font-sketch text-base"
              />
            </div>
          </div>

          {/* 1. SECCIÓN DE FOTOS POLAROID (Solo con Pie de Foto) */}
          <div className="bg-white/90 border-2 border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-700" /> 1. Fotos Polaroid ({activeOngoingDate.photos.length})
              </h4>
              <span className="text-[11px] font-sketch text-slate-500">
                ¡Sin límite de fotos! Toca el texto de cualquier foto para editarlo
              </span>
            </div>

            {/* Galería de fotos agregadas con edición fácil de pie de foto */}
            {activeOngoingDate.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {activeOngoingDate.photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative bg-white p-2.5 pb-3 border-2 border-slate-800 rounded-xl shadow-xs group hover:-translate-y-0.5 transition-all text-center"
                    style={{ transform: `rotate(${p.rotation || '-1deg'})` }}
                  >
                    <button
                      type="button"
                      onClick={() => handleRemovePhotoFromOngoing(p.id)}
                      className="absolute -top-1.5 -right-1.5 z-10 bg-white text-rose-600 p-1 rounded-full shadow border border-slate-300 hover:bg-rose-50 cursor-pointer"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-full h-28 sm:h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
                      <img
                        src={p.url}
                        alt={p.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Edición directa del pie de foto */}
                    {editingCaptionPhotoId === p.id ? (
                      <div className="mt-1.5 flex items-center gap-1">
                        <input
                          type="text"
                          autoFocus
                          value={editingCaptionText}
                          onChange={(e) => setEditingCaptionText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditedCaption(p.id);
                            if (e.key === 'Escape') setEditingCaptionPhotoId(null);
                          }}
                          className="w-full px-1.5 py-0.5 text-xs font-sketch bg-purple-50 border-2 border-purple-400 rounded-lg focus:outline-none"
                          placeholder="Pie de foto..."
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditedCaption(p.id)}
                          className="p-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 cursor-pointer shrink-0"
                          title="Guardar pie de foto"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingCaptionPhotoId(p.id);
                          setEditingCaptionText(p.caption || '');
                        }}
                        className="group/cap flex items-center justify-center gap-1 mt-1.5 cursor-pointer hover:bg-purple-50 rounded-lg px-1 py-0.5 border border-transparent hover:border-purple-200 transition-all"
                        title="Toca para editar pie de foto"
                      >
                        <p className="font-hand text-base text-slate-800 truncate font-bold">
                          {p.caption || activeOngoingDate.title}
                        </p>
                        <Edit3 className="w-3.5 h-3.5 text-purple-600 opacity-60 group-hover/cap:opacity-100 shrink-0" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Controles para añadir Polaroid con compresión automática */}
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border-2 border-dashed border-purple-300 space-y-3">
              {/* Inputs ocultos */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraFileSelected}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryFilesSelected}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Botón 1: Cámara directa */}
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-sketch text-base rounded-xl border-2 border-slate-900 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-60"
                  title="Abre la cámara para sacar una foto y luego escribir su pie de foto"
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

                {/* Botón 2: Galería */}
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-sketch text-base rounded-xl border-2 border-slate-900 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-60"
                  title="Elige una o varias fotos guardadas en tu galería"
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
                      <span>Comprimiendo fotos...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 text-purple-200" />
                      <span className="font-bold">Subir de Galería (Ilimitadas)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Opción secundaria: URL web directa */}
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

          {/* 2. ¿QUÉ FUE LO QUE MÁS LES GUSTÓ? (Ninguno puede editar el recuadro del otro) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                <Smile className="w-5 h-5 text-teal-700" /> 2. ¿Qué fue lo que más les gustó de la cita?
              </h4>
              <span className="text-xs font-sketch text-slate-600">
                Conectado como:{' '}
                <strong className="text-purple-900">
                  {currentUserSlot === 1 ? user1Alias : user2Alias}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Espacio de Marcelo (Slot 1) */}
              <div
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  currentUserSlot === 1
                    ? 'bg-teal-50 border-teal-700 shadow-md ring-2 ring-teal-400/50'
                    : 'bg-slate-100/90 border-slate-300'
                }`}
              >
                <label className="text-xs font-bold flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-teal-950">
                    <PenTool className="w-3.5 h-3.5 text-teal-700" /> {user1Alias} (Turquesa)
                  </span>
                  {currentUserSlot === 1 ? (
                    <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Tu espacio
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3" /> Solo {user1Alias}
                    </span>
                  )}
                </label>

                {currentUserSlot === 1 ? (
                  <textarea
                    rows={2}
                    value={activeOngoingDate.person1_liked}
                    onChange={(e) =>
                      setActiveOngoingDate({
                        ...activeOngoingDate,
                        person1_liked: e.target.value
                      })
                    }
                    placeholder="Lo que más me gustó de hoy fue..."
                    className="w-full p-2.5 bg-white border-2 border-teal-400 rounded-xl font-sketch text-base focus:outline-none focus:border-teal-700"
                  />
                ) : (
                  <div className="min-h-[64px] p-2.5 bg-white/70 border border-dashed border-teal-300 rounded-xl font-sketch text-base text-slate-700 flex items-center">
                    {activeOngoingDate.person1_liked.trim() ? (
                      <p className="italic">“{activeOngoingDate.person1_liked}”</p>
                    ) : (
                      <p className="text-slate-400 italic text-sm">
                        Esperando que {user1Alias} escriba desde su celular...
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Espacio de Nicole (Slot 2) */}
              <div
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  currentUserSlot === 2
                    ? 'bg-purple-50 border-purple-700 shadow-md ring-2 ring-purple-400/50'
                    : 'bg-slate-100/90 border-slate-300'
                }`}
              >
                <label className="text-xs font-bold flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-purple-950">
                    <PenTool className="w-3.5 h-3.5 text-purple-700" /> {user2Alias} (Morado)
                  </span>
                  {currentUserSlot === 2 ? (
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Tu espacio
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3" /> Solo {user2Alias}
                    </span>
                  )}
                </label>

                {currentUserSlot === 2 ? (
                  <textarea
                    rows={2}
                    value={activeOngoingDate.person2_liked}
                    onChange={(e) =>
                      setActiveOngoingDate({
                        ...activeOngoingDate,
                        person2_liked: e.target.value
                      })
                    }
                    placeholder="Lo que más me gustó de hoy fue..."
                    className="w-full p-2.5 bg-white border-2 border-purple-400 rounded-xl font-sketch text-base focus:outline-none focus:border-purple-700"
                  />
                ) : (
                  <div className="min-h-[64px] p-2.5 bg-white/70 border border-dashed border-purple-300 rounded-xl font-sketch text-base text-slate-700 flex items-center">
                    {activeOngoingDate.person2_liked.trim() ? (
                      <p className="italic">“{activeOngoingDate.person2_liked}”</p>
                    ) : (
                      <p className="text-slate-400 italic text-sm">
                        Esperando que {user2Alias} escriba desde su celular...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. ALGO BONITO SOBRE LA OTRA PERSONA (Secreto oculto hasta que finalice la cita) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-purple-700" /> 3. Algo bonito sobre la otra persona
              </h4>
              <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-sketch flex items-center gap-1 font-bold">
                <Lock className="w-3 h-3" /> Secreto hasta finalizar la cita
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* De Marcelo para Nicole */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-teal-600 shadow-xs">
                <label className="text-xs font-bold text-teal-950 flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-100" /> De {user1Alias} para {user2Alias}
                  </span>
                  {currentUserSlot === 1 && (
                    <span className="text-[10px] text-teal-700 italic">
                      {user2Alias} no lo verá hasta terminar
                    </span>
                  )}
                </label>

                {currentUserSlot === 1 ? (
                  // Marcelo escribe su mensaje secreto
                  <textarea
                    rows={2}
                    value={activeOngoingDate.person1_nice_note}
                    onChange={(e) =>
                      setActiveOngoingDate({
                        ...activeOngoingDate,
                        person1_nice_note: e.target.value
                      })
                    }
                    placeholder={`Escribe algo lindo sobre ${user2Alias} (secreto 🤫)...`}
                    className="w-full p-2.5 bg-teal-50/50 border-2 border-teal-300 rounded-xl font-sketch text-base focus:outline-none focus:border-teal-600"
                  />
                ) : (
                  // Nicole ve el sobre secreto cerrado
                  <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-dashed border-teal-300 rounded-xl text-center space-y-1">
                    <p className="font-hand text-lg font-bold text-teal-950 flex items-center justify-center gap-1">
                      💌 Mensaje Secreto de {user1Alias}
                    </p>
                    <p className="font-sketch text-xs text-teal-800">
                      {activeOngoingDate.person1_nice_note.trim()
                        ? `¡${user1Alias} ya escribió algo lindo para ti! Se revelará en el historial al guardar la cita ✨`
                        : `${user1Alias} aún está pensando qué escribirte en secreto...`}
                    </p>
                  </div>
                )}
              </div>

              {/* De Nicole para Marcelo */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-purple-600 shadow-xs">
                <label className="text-xs font-bold text-purple-950 flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-100" /> De {user2Alias} para {user1Alias}
                  </span>
                  {currentUserSlot === 2 && (
                    <span className="text-[10px] text-purple-700 italic">
                      {user1Alias} no lo verá hasta terminar
                    </span>
                  )}
                </label>

                {currentUserSlot === 2 ? (
                  // Nicole escribe su mensaje secreto
                  <textarea
                    rows={2}
                    value={activeOngoingDate.person2_nice_note}
                    onChange={(e) =>
                      setActiveOngoingDate({
                        ...activeOngoingDate,
                        person2_nice_note: e.target.value
                      })
                    }
                    placeholder={`Escribe algo lindo sobre ${user1Alias} (secreto 🤫)...`}
                    className="w-full p-2.5 bg-purple-50/50 border-2 border-purple-300 rounded-xl font-sketch text-base focus:outline-none focus:border-purple-600"
                  />
                ) : (
                  // Marcelo ve el sobre secreto cerrado
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-fuchsia-50 border-2 border-dashed border-purple-300 rounded-xl text-center space-y-1">
                    <p className="font-hand text-lg font-bold text-purple-950 flex items-center justify-center gap-1">
                      💌 Mensaje Secreto de {user2Alias}
                    </p>
                    <p className="font-sketch text-xs text-purple-800">
                      {activeOngoingDate.person2_nice_note.trim()
                        ? `¡${user2Alias} ya escribió algo lindo para ti! Se revelará en el historial al guardar la cita ✨`
                        : `${user2Alias} aún está pensando qué escribirte en secreto...`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. LA FRASE RANDOM (Aleatorio a quién le toque) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-purple-800 shadow-sm space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-purple-600" /> 4. La frase random (algo gracioso o especial)
              </label>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sketch border ${
                    quoteTurnSlot === 1
                      ? 'bg-teal-100 text-teal-900 border-teal-400'
                      : 'bg-purple-100 text-purple-900 border-purple-400'
                  }`}
                >
                  🎲 Le toca ponerla a:{' '}
                  <strong className="underline">
                    {quoteTurnSlot === 1 ? user1Alias : user2Alias}
                  </strong>
                </span>

                <button
                  type="button"
                  onClick={handleRerollQuoteTurn}
                  className="px-2.5 py-1 text-xs font-sketch bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  title="Cambiar turno de la frase"
                >
                  <RotateCw className="w-3 h-3" /> Cambiar turno
                </button>
              </div>
            </div>

            {currentUserSlot === quoteTurnSlot ? (
              <div>
                <input
                  type="text"
                  value={activeOngoingDate.random_quote}
                  onChange={(e) =>
                    setActiveOngoingDate({
                      ...activeOngoingDate,
                      random_quote: e.target.value
                    })
                  }
                  placeholder="«Escribe aquí la frase textual o cómica...»"
                  className="w-full px-4 py-2.5 bg-amber-50/50 border-2 border-amber-300 rounded-xl font-hand text-2xl text-purple-950 focus:outline-none focus:border-purple-700 shadow-inner"
                />
                <p className="text-[11px] font-sketch text-slate-500 mt-1">
                  ¡Te tocó a ti! Escribe esa frase espontánea que hizo reír a ambos.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center">
                {activeOngoingDate.random_quote.trim() ? (
                  <p className="font-hand text-2xl text-purple-950">
                    «{activeOngoingDate.random_quote}»
                  </p>
                ) : (
                  <p className="font-sketch text-sm text-slate-500">
                    🎲 Hoy le tocó a{' '}
                    <strong>{quoteTurnSlot === 1 ? user1Alias : user2Alias}</strong>{' '}
                    registrar la frase random. Esperando que la escriba...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Botones de acción inferiores */}
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
                  if (
                    window.confirm(
                      '¿Deseas descartar esta salida en curso? No se guardará en la bitácora.'
                    )
                  ) {
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
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-sketch text-base sm:text-lg border-2 border-purple-950 sketch-box shadow-[3px_3px_0px_0px_#134E4A] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-white" /> Guardar en Bitácora y Revelar Secretos
            </button>
          </div>
        </form>
      </div>

      {/* Modal flotante rápido al sacar foto: Escribir pie de foto viendo la foto capturada */}
      {pendingCaptureFile && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF7EE] border-4 border-purple-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 pencil-shade-mixed">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <h4 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-700" /> ¡Foto capturada!
              </h4>
              <button
                type="button"
                onClick={() => {
                  setPendingCaptureFile(null);
                  setPendingCapturePreview(null);
                }}
                className="p-1 rounded-full text-slate-500 hover:bg-purple-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pendingCapturePreview && (
              <div className="w-full h-52 bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-sm relative">
                <img
                  src={pendingCapturePreview}
                  alt="Vista previa de foto"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-sketch font-bold text-slate-700 mb-1">
                Escribe el pie de foto para esta Polaroid:
              </label>
              <input
                autoFocus
                type="text"
                value={pendingCaptureCaption}
                onChange={(e) => setPendingCaptureCaption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmCapture(pendingCaptureCaption);
                }}
                placeholder="Ej. Probando un postre, risas en la mesa..."
                className="w-full px-3.5 py-2.5 bg-white border-2 border-purple-300 rounded-xl font-sketch text-base focus:border-purple-600 focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleConfirmCapture(pendingCaptureCaption)}
                disabled={isUploadingPhoto}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-sketch text-base font-bold rounded-xl border border-teal-800 shadow-sm transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isUploadingPhoto ? 'Comprimiendo...' : 'Guardar Polaroid 📸'}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmCapture('')}
                disabled={isUploadingPhoto}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-sketch text-xs rounded-xl border border-slate-300 cursor-pointer disabled:opacity-50"
              >
                Sin pie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
