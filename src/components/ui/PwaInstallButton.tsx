'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    // 1. Detectar si ya está en modo standalone (instalada)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detectar si es iOS (iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Capturar evento de instalación en Android / Chrome / Edge
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setJustInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (isIOS) {
      // En iOS Safari no existe beforeinstallprompt, se guía al usuario
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setJustInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback para navegadores que no hayan disparado aún el evento
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-xs rounded-full font-sketch shadow-xs opacity-75">
        <Check className="w-3.5 h-3.5" />
        <span>App instalada</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="Instalar la Bitácora como aplicación en tu pantalla de inicio"
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-teal-400 rounded-full text-xs font-sketch shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
        <span>Instalar en el celular</span>
      </button>

      {/* Modal sutil de instrucciones para iOS / Fallback */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FCFBF7] border-3 border-slate-800 sketch-box p-5 max-w-xs w-full shadow-xl relative text-left">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-hand text-lg font-bold text-slate-800 leading-none">
                  Instalar Bitácora
                </h4>
                <p className="text-xs text-slate-500 font-sketch">En tu pantalla de inicio</p>
              </div>
            </div>

            {isIOS ? (
              <div className="text-xs text-slate-700 space-y-2.5 font-sketch">
                <p className="leading-relaxed">
                  Para tener la aplicación en tu iPhone:
                </p>
                <div className="flex items-start gap-2 bg-purple-50 p-2 rounded-lg border border-purple-200">
                  <Share2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>
                    1. Toca el botón <strong>Compartir</strong> en la barra de Safari.
                  </span>
                </div>
                <div className="flex items-start gap-2 bg-teal-50 p-2 rounded-lg border border-teal-200">
                  <PlusSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    2. Desliza hacia abajo y elige <strong>&quot;Agregar a inicio&quot;</strong>.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-700 space-y-2 font-sketch">
                <p className="leading-relaxed">
                  Puedes instalar la app desde el menú de tu navegador:
                </p>
                <p className="bg-slate-100 p-2 rounded-lg border border-slate-200 text-slate-600">
                  Toca los tres puntos <strong>(⋮)</strong> de tu navegador y selecciona <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Agregar a la pantalla principal&quot;</strong>.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-1.5 bg-slate-800 text-white rounded-xl text-xs font-sketch hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
