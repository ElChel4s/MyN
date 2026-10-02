'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, Check, PenTool } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';

export const EditNicknamesModal = () => {
  const {
    isEditNicknamesOpen,
    setIsEditNicknamesOpen,
    user1Alias,
    user2Alias,
    saveNicknames
  } = useAppContext();

  const [marceloNick, setMarceloNick] = useState(user1Alias);
  const [nicoleNick, setNicoleNick] = useState(user2Alias);

  useEffect(() => {
    if (isEditNicknamesOpen) {
      setMarceloNick(user1Alias);
      setNicoleNick(user2Alias);
    }
  }, [isEditNicknamesOpen, user1Alias, user2Alias]);

  if (!isEditNicknamesOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMarcelo = marceloNick.trim() || 'Marcelo';
    const finalNicole = nicoleNick.trim() || 'Nicole';
    
    setIsEditNicknamesOpen(false);
    await saveNicknames(finalMarcelo, finalNicole);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsEditNicknamesOpen(false);
      }}
    >
      <div
        className="bg-[#FCFBF7] border-4 border-purple-900 pencil-shade-mixed sketch-box w-full max-w-md p-5 sm:p-6 shadow-2xl relative cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashed border-purple-300">
          <div className="flex items-center gap-2.5">
            <GerberaFlower size={36} variant="mixed" spin />
            <div>
              <h3 className="font-hand text-2xl sm:text-3xl font-bold text-purple-950 leading-tight">
                Apodos de la Pareja
              </h3>
              <p className="font-sketch text-xs text-slate-600">
                Personalicen cómo se llaman en notas y recuerdos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditNicknamesOpen(false)}
            className="p-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-500 border border-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-teal-50/80 p-3.5 rounded-2xl border-2 border-teal-500 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-teal-700" />
                Nombre real: <strong>Marcelo</strong>
              </label>
              <span className="text-[10px] bg-teal-200 text-teal-900 font-bold px-2 py-0.5 rounded-full">
                Trazo Turquesa
              </span>
            </div>
            <input
              type="text"
              value={marceloNick}
              onChange={(e) => setMarceloNick(e.target.value)}
              placeholder="Apodo opcional (ej. Marce, Mi amor...)"
              className="w-full px-3.5 py-2 bg-white border border-teal-400 rounded-xl font-sketch text-base text-slate-800 focus:outline-none focus:border-teal-600"
            />
          </div>

          <div className="bg-purple-50/80 p-3.5 rounded-2xl border-2 border-purple-500 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-purple-700" />
                Nombre real: <strong>Nicole</strong>
              </label>
              <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                Trazo Morado
              </span>
            </div>
            <input
              type="text"
              value={nicoleNick}
              onChange={(e) => setNicoleNick(e.target.value)}
              placeholder="Apodo opcional (ej. Nico, Mi vida...)"
              className="w-full px-3.5 py-2 bg-white border border-purple-400 rounded-xl font-sketch text-base text-slate-800 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="pt-3 border-t border-dashed border-purple-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsEditNicknamesOpen(false)}
              className="px-4 py-2 font-sketch text-sm text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white font-sketch text-base border-2 border-purple-950 sketch-box shadow-[2px_2px_0px_0px_#134E4A] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" /> Guardar Apodos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
