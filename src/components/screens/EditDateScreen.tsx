"use client";

import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Camera,
  Trash2,
  Smile,
  PenTool,
  MessageSquareHeart,
  Heart,
  Quote,
  Check,
  Loader2,
  Image as ImageIcon,
  Lock,
  RotateCw,
  Edit3,
  X,
  Sparkles,
  Save
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { DateMemory, DatePhoto } from '../../lib/types';
import { uploadPolaroid } from '../../lib/uploadPhoto';

export const EditDateScreen = () => {
  const {
    editingMemory,
    setEditingMemory,
    currentUserSlot,
    user1Alias,
    user2Alias,
    saveEditedDateMemory,
    showToast
  } = useAppContext();

  if (!editingMemory) return null;

  const [form, setForm] = useState<DateMemory>({ ...editingMemory });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Estados para captura rápida de foto
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [pendingCaptureFile, setPendingCaptureFile] = useState<File | null>(null);
  const [pendingCapturePreview, setPendingCapturePreview] = useState<string | null>(null);
  const [pendingCaptureCaption, setPendingCaptureCaption] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Captura con cámara
  const handleCameraSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPendingCaptureFile(file);
    setPendingCapturePreview(preview);
    setPendingCaptureCaption('');
  };

  // Subida desde galería (soporta múltiples fotos sin límite)
  const handleGallerySelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length === 1) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setPendingCaptureFile(file);
      setPendingCapturePreview(preview);
      setPendingCaptureCaption('');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      showToast(`Comprimiendo ${files.length} fotos...`);
      const uploadedPhotos: DatePhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const publicUrl = await uploadPolaroid(files[i], form.id);
        uploadedPhotos.push({
          id: `p-${Date.now()}-${i}`,
          date_id: form.id,
          url: publicUrl,
          caption: `Recuerdo #${form.photos.length + i + 1}`,
          secret_back: '',
          rotation: (form.photos.length + i) % 2 === 0 ? '-2deg' : '2deg'
        });
      }

      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos]
      }));
      showToast(`¡${files.length} fotos añadidas a la cita! 📸`);
    } catch (err: any) {
      console.error('Error al subir múltiples fotos:', err);
      showToast('Error al subir fotos');
    } finally {
      setIsUploadingPhoto(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Confirmar foto individual con pie de foto
  const handleConfirmCapture = async (caption: string) => {
    if (!pendingCaptureFile) return;
    const fileToUpload = pendingCaptureFile;
    setPendingCaptureFile(null);
    setPendingCapturePreview(null);

    try {
      setIsUploadingPhoto(true);
      showToast('Comprimiendo foto para la cita...');
      const publicUrl = await uploadPolaroid(fileToUpload, form.id);
      const newPhotoObj: DatePhoto = {
        id: `p-${Date.now()}`,
        date_id: form.id,
        url: publicUrl,
        caption: caption.trim() || form.title,
        secret_back: '',
        rotation: form.photos.length % 2 === 0 ? '-2deg' : '2deg'
      };

      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoObj]
      }));
      showToast('¡Foto Polaroid agregada a la cita! 📸');
    } catch (err: any) {
      console.error('Error al subir foto:', err);
      showToast('Error al subir foto');
    } finally {
      setIsUploadingPhoto(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Añadir foto por URL web
  const handleAddPhotoByUrl = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhotoObj: DatePhoto = {
      id: `p-${Date.now()}`,
      date_id: form.id,
      url: newPhotoUrl.trim(),
      caption: form.title,
      secret_back: '',
      rotation: form.photos.length % 2 === 0 ? '-2deg' : '2deg'
    };
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhotoObj]
    }));
    setNewPhotoUrl('');
    showToast('Foto agregada por enlace');
  };

  // Actualizar pie de foto en la lista
  const handleUpdateCaption = (photoId: string, newCap: string) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => (p.id === photoId ? { ...p, caption: newCap } : p))
    }));
  };

  // Eliminar foto de la lista
  const handleRemovePhoto = (photoId: string) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId)
    }));
    showToast('Foto removida');
  };

  // Guardar todo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await saveEditedDateMemory(form);
    } catch (err: any) {
      console.error('Error al guardar cita:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 pt-2 animate-fadeIn max-w-4xl mx-auto">
      {/* Barra superior de navegación */}
      <div className="bg-[#FAF7EE] border-3 border-purple-900 rounded-2xl p-4 sm:p-5 shadow-md mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingMemory(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-950 font-sketch text-sm font-bold rounded-xl border border-purple-300 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>Volver a la bitácora</span>
          </button>
          <div>
            <h2 className="font-hand text-2xl sm:text-4xl font-bold text-purple-950 leading-none">
              Editar Recuerdos de la Cita
            </h2>
            <p className="font-sketch text-xs sm:text-sm text-slate-600 mt-0.5">
              Modifica fotos, lugares y tus notas con comodidad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {form.stamp_code && (
            <div className="px-3 py-1 bg-teal-50 border-2 border-dashed border-teal-700 rounded-xl text-teal-900 font-sketch text-xs font-bold shadow-xs">
              {form.stamp_code}
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-sketch text-base font-bold rounded-xl border-2 border-slate-900 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TARJETA 1: DATOS GENERALES */}
        <div className="bg-white/95 border-2 border-purple-800 rounded-2xl p-5 shadow-xs pencil-shade-purple space-y-4">
          <h3 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2 border-b border-purple-200 pb-2">
            <Sparkles className="w-5 h-5 text-purple-700" /> Datos Principales de la Cita
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-sketch font-bold text-slate-700 mb-1">
                Título o Momento de la Cita
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Tarde de helados y charla bonita"
                className="w-full px-3.5 py-2 bg-white border-2 border-purple-300 rounded-xl font-sketch text-base focus:border-purple-600 focus:outline-none shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-sketch font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-700" /> Fecha del recuerdo
              </label>
              <input
                type="text"
                value={form.scheduled_date}
                onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                placeholder="Ej. 14 de Febrero / Ayer"
                className="w-full px-3.5 py-2 bg-white border-2 border-purple-300 rounded-xl font-sketch text-base focus:border-purple-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-sketch font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-700" /> Lugar / Ubicación
              </label>
              <input
                type="text"
                value={form.location_name}
                onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                placeholder="Ej. Cafetería Central / Parque"
                className="w-full px-3.5 py-2 bg-white border-2 border-teal-300 rounded-xl font-sketch text-base focus:border-teal-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Color de la gerbera */}
          <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-sketch font-bold text-slate-700">
              Color de la Gerbera del recuerdo:
            </span>
            {(['purple', 'teal', 'aqua', 'lavender', 'mixed'] as const).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, gerbera_color: color })}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 text-xs font-sketch font-bold transition-all cursor-pointer ${
                  form.gerbera_color === color
                    ? 'border-purple-900 bg-purple-100 shadow-sm scale-105'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <GerberaFlower size={20} variant={color as any} />
                <span className="capitalize">{color}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TARJETA 2: FOTOS POLAROID (ILIMITADAS Y FÁCIL EDICIÓN DE PIE) */}
        <div className="bg-white/95 border-2 border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <h3 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-700" /> Fotos Polaroid ({form.photos.length})
              </h3>
              <p className="font-sketch text-xs text-slate-500">
                ¡Sin límite de fotos! Puedes editar el pie de foto de cada una directamente aquí
              </p>
            </div>
            <span className="text-xs font-sketch font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-300">
              Fotos ilimitadas
            </span>
          </div>

          {/* Galería de fotos con inputs directos para el pie de foto */}
          {form.photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {form.photos.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-[#FAF7EE] border-2 border-slate-800 rounded-2xl p-3 shadow-sm relative group hover:shadow-md transition-all flex flex-col justify-between"
                  style={{ transform: `rotate(${idx % 2 === 0 ? '-1.5deg' : '1.5deg'})` }}
                >
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(p.id)}
                    className="absolute -top-2 -right-2 z-10 bg-white text-rose-600 p-1.5 rounded-full shadow-md border border-slate-300 hover:bg-rose-50 cursor-pointer"
                    title="Eliminar esta foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-300 mb-2">
                    <img
                      src={p.url}
                      alt={p.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sketch font-bold text-purple-950 mb-1">
                      Pie de foto #{idx + 1}:
                    </label>
                    <input
                      type="text"
                      value={p.caption}
                      onChange={(e) => handleUpdateCaption(p.id, e.target.value)}
                      placeholder="Escribe el pie de foto..."
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded-lg font-sketch text-xs focus:border-purple-600 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
              <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-sketch text-sm text-slate-600">
                Aún no hay fotos en esta cita. ¡Sube o saca fotos para completar la bitácora!
              </p>
            </div>
          )}

          {/* Controles para agregar fotos */}
          <div className="bg-purple-50/70 p-4 rounded-2xl border-2 border-dashed border-purple-300 space-y-3">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraSelected}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallerySelected}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-sketch text-base font-bold rounded-xl border-2 border-slate-900 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Comprimiendo foto...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-teal-200" />
                    <span>Sacar Foto con Cámara</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-sketch text-base font-bold rounded-xl border-2 border-slate-900 shadow-sm transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Comprimiendo fotos...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 text-purple-200" />
                    <span>Subir de Galería (Ilimitadas)</span>
                  </>
                )}
              </button>
            </div>

            {/* Opción secundaria: URL web */}
            <div className="flex items-center gap-2 pt-2 border-t border-purple-200 text-xs">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="O pegar URL web de imagen..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-sketch text-xs"
              />
              <button
                type="button"
                onClick={handleAddPhotoByUrl}
                className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg font-sketch text-xs font-bold cursor-pointer shrink-0"
              >
                Añadir Enlace
              </button>
            </div>
          </div>
        </div>

        {/* TARJETA 3: ¿QUÉ NOS GUSTÓ? (Protección de usuario) */}
        <div className="bg-white/95 border-2 border-purple-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-2">
            <h3 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
              <Smile className="w-5 h-5 text-teal-700" /> ¿Qué fue lo que más les gustó?
            </h3>
            <span className="text-xs font-sketch text-slate-600">
              Conectado como:{' '}
              <strong className="text-purple-900">
                {currentUserSlot === 1 ? user1Alias : user2Alias}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Espacio de Marcelo (Slot 1) */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                currentUserSlot === 1
                  ? 'bg-teal-50 border-teal-700 shadow-md ring-2 ring-teal-400/40'
                  : 'bg-slate-100/90 border-slate-300 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-950 bg-teal-200/80 px-2.5 py-0.5 rounded-full border border-teal-500 font-sketch">
                  <PenTool className="w-3 h-3 text-teal-800" /> Lo que más le gustó a {user1Alias}
                </span>
                {currentUserSlot === 1 ? (
                  <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-300">
                    Tu espacio (editable)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-300">
                    <Lock className="w-3 h-3 text-slate-500" /> Bloqueado
                  </span>
                )}
              </div>

              {currentUserSlot === 1 ? (
                <textarea
                  value={form.person1_liked}
                  onChange={(e) => setForm({ ...form, person1_liked: e.target.value })}
                  placeholder={`Escribe lo que más te gustó de esta salida, ${user1Alias}...`}
                  rows={4}
                  className="w-full p-3 bg-white border-2 border-teal-400 rounded-xl font-sketch text-sm focus:border-teal-700 focus:outline-none shadow-inner"
                />
              ) : (
                <div className="bg-white/80 border border-slate-300 p-3 rounded-xl min-h-[96px] flex flex-col justify-between">
                  <p className="font-sketch text-sm text-slate-700 italic">
                    “{form.person1_liked || 'Aún no ha escrito su recuerdo.'}”
                  </p>
                  <p className="text-[11px] font-sketch text-slate-500 mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Solo {user1Alias} puede editar su propio recuerdo.
                  </p>
                </div>
              )}
            </div>

            {/* Espacio de Nicole (Slot 2) */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                currentUserSlot === 2
                  ? 'bg-purple-50 border-purple-700 shadow-md ring-2 ring-purple-400/40'
                  : 'bg-slate-100/90 border-slate-300 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-950 bg-purple-200/80 px-2.5 py-0.5 rounded-full border border-purple-500 font-sketch">
                  <PenTool className="w-3 h-3 text-purple-800" /> Lo que más le gustó a {user2Alias}
                </span>
                {currentUserSlot === 2 ? (
                  <span className="text-[10px] font-bold text-purple-800 bg-white px-2 py-0.5 rounded-full border border-purple-300">
                    Tu espacio (editable)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-300">
                    <Lock className="w-3 h-3 text-slate-500" /> Bloqueado
                  </span>
                )}
              </div>

              {currentUserSlot === 2 ? (
                <textarea
                  value={form.person2_liked}
                  onChange={(e) => setForm({ ...form, person2_liked: e.target.value })}
                  placeholder={`Escribe lo que más te gustó de esta salida, ${user2Alias}...`}
                  rows={4}
                  className="w-full p-3 bg-white border-2 border-purple-400 rounded-xl font-sketch text-sm focus:border-purple-700 focus:outline-none shadow-inner"
                />
              ) : (
                <div className="bg-white/80 border border-slate-300 p-3 rounded-xl min-h-[96px] flex flex-col justify-between">
                  <p className="font-sketch text-sm text-slate-700 italic">
                    “{form.person2_liked || 'Aún no ha escrito su recuerdo.'}”
                  </p>
                  <p className="text-[11px] font-sketch text-slate-500 mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Solo {user2Alias} puede editar su propio recuerdo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TARJETA 4: ALGO BONITO SOBRE EL OTRO (Protegido por usuario) */}
        <div className="bg-white/95 border-2 border-purple-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-2">
            <h3 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-purple-700" /> Algo bonito sobre la otra persona
            </h3>
            <span className="text-xs font-sketch text-slate-500">
              Cada uno edita exclusivamente su dedicatoria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mensaje de Marcelo sobre Nicole */}
            <div
              className={`p-4 rounded-2xl border-2 ${
                currentUserSlot === 1
                  ? 'bg-teal-50/90 border-teal-700 shadow-sm'
                  : 'bg-slate-100/90 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-900 font-sketch">
                  <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-100" />
                  De {user1Alias} para {user2Alias}:
                </span>
                {currentUserSlot === 1 ? (
                  <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-300">
                    Tu dedicatoria
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-300">
                    <Lock className="w-3 h-3" /> Solo lectura
                  </span>
                )}
              </div>

              {currentUserSlot === 1 ? (
                <textarea
                  value={form.person1_nice_note}
                  onChange={(e) => setForm({ ...form, person1_nice_note: e.target.value })}
                  placeholder={`Escribe algo lindo sobre ${user2Alias}...`}
                  rows={4}
                  className="w-full p-3 bg-white border-2 border-teal-300 rounded-xl font-sketch text-sm focus:border-teal-600 focus:outline-none shadow-inner"
                />
              ) : (
                <div className="bg-white/80 border border-slate-300 p-3 rounded-xl min-h-[96px]">
                  <p className="font-sketch text-sm text-slate-800 italic">
                    “{form.person1_nice_note || 'Una hermosa dedicatoria llena de cariño.'}”
                  </p>
                </div>
              )}
            </div>

            {/* Mensaje de Nicole sobre Marcelo */}
            <div
              className={`p-4 rounded-2xl border-2 ${
                currentUserSlot === 2
                  ? 'bg-purple-50/90 border-purple-700 shadow-sm'
                  : 'bg-slate-100/90 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 font-sketch">
                  <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                  De {user2Alias} para {user1Alias}:
                </span>
                {currentUserSlot === 2 ? (
                  <span className="text-[10px] font-bold text-purple-800 bg-white px-2 py-0.5 rounded-full border border-purple-300">
                    Tu dedicatoria
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-300">
                    <Lock className="w-3 h-3" /> Solo lectura
                  </span>
                )}
              </div>

              {currentUserSlot === 2 ? (
                <textarea
                  value={form.person2_nice_note}
                  onChange={(e) => setForm({ ...form, person2_nice_note: e.target.value })}
                  placeholder={`Escribe algo lindo sobre ${user1Alias}...`}
                  rows={4}
                  className="w-full p-3 bg-white border-2 border-purple-300 rounded-xl font-sketch text-sm focus:border-purple-600 focus:outline-none shadow-inner"
                />
              ) : (
                <div className="bg-white/80 border border-slate-300 p-3 rounded-xl min-h-[96px]">
                  <p className="font-sketch text-sm text-slate-800 italic">
                    “{form.person2_nice_note || 'Una hermosa dedicatoria llena de cariño.'}”
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TARJETA 5: FRASE RANDOM O MOMENTO CÓMICO */}
        <div className="bg-white/95 border-2 border-purple-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
            <Quote className="w-5 h-5 text-purple-700" /> Frase Random o Momento Memorable de la Cita
          </h3>
          <input
            type="text"
            value={form.random_quote}
            onChange={(e) => setForm({ ...form, random_quote: e.target.value })}
            placeholder="Ej. «¡Cuidado con la paloma!» o algún chiste que se dijeron..."
            className="w-full px-3.5 py-2.5 bg-purple-50/50 border-2 border-purple-300 rounded-xl font-sketch text-base focus:border-purple-600 focus:outline-none shadow-xs"
          />
        </div>

        {/* BARRA INFERIOR FLOTANTE DE GUARDADO */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#FAF7EE] border-3 border-purple-950 rounded-2xl p-3 px-5 shadow-2xl flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingMemory(null)}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-sketch text-sm font-bold rounded-xl border border-slate-300 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-sketch text-base sm:text-lg font-bold rounded-xl border-2 border-slate-900 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>
      </form>

      {/* Modal flotante rápido para escribir pie de foto interactivo */}
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
                  alt="Vista previa"
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
