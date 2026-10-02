import React, { useState } from 'react';
import { X, Compass, MapPin, Heart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const QuickCreateModal = () => {
  const {
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    startNewQuickDate,
    showToast
  } = useAppContext();
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');

  if (!isQuickCreateOpen) return null;

  const handleStartNow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    const planTitle = title.trim();
    const planLoc = locationName.trim();
    setTitle('');
    setLocationName('');
    setIsQuickCreateOpen(false);
    startNewQuickDate(planTitle, planLoc);
    showToast('¡Cita iniciada! Capturando momentos...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#FCFBF7] border-4 border-teal-900 pencil-shade-teal sketch-box w-full max-w-md p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-teal-300">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-400 text-teal-700 flex items-center justify-center">
              <Compass className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="font-hand text-3xl font-bold text-teal-950 leading-tight">
                ¡Salimos ahorita!
              </h2>
              <p className="font-sketch text-xs text-slate-600">
                Salida espontánea para empezar a capturar fotos y recuerdos ya
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickCreateOpen(false)}
            className="p-1.5 bg-white rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleStartNow} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-teal-950 flex items-center gap-1 mb-1">
              ¿Qué van a hacer ahorita? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Vamos por un café, Helados en el parque, Caminata..."
              className="w-full px-3.5 py-2.5 bg-white border-2 border-teal-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-200 rounded-xl font-sketch text-lg text-slate-800 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-bold text-teal-900 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" /> Lugar o rincón (opcional)
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ej. Zona centro, Cafetería nueva, En casa..."
              className="w-full px-3.5 py-2 bg-white border border-teal-300 rounded-lg font-sketch text-base text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="mt-6 pt-3 border-t border-dashed border-teal-200 flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuickCreateOpen(false)}
              className="px-3.5 py-2 font-sketch text-sm text-slate-600 hover:bg-slate-100 rounded-xl text-center cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-sketch text-lg sketch-pill border-2 border-teal-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-teal-200" /> ¡Empezar Cita Ya!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


