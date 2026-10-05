"use client";

import React, { useEffect, useState } from 'react';
import { CalendarPlus, Compass, UserCircle2 } from 'lucide-react';
import { BotanicalBg } from '@/components/ui/BotanicalBg';
import { Navbar } from '@/components/ui/Navbar';
import { TabDashboard } from '@/components/tabs/TabDashboard';
import { TabPlans } from '@/components/tabs/TabPlans';
import { TabHistory } from '@/components/tabs/TabHistory';
import { TabScrapbook } from '@/components/tabs/TabScrapbook';
import { TabProfile } from '@/components/tabs/TabProfile';
import { LoginScreen } from '@/components/ui/LoginScreen';
import { FloatingOngoing } from '@/components/modals/FloatingOngoing';
import { OngoingModal } from '@/components/modals/OngoingModal';
import { PlanModal } from '@/components/modals/PlanModal';
import { QuickCreateModal } from '@/components/modals/QuickCreateModal';
import { ZoomModal } from '@/components/modals/ZoomModal';
import { MemoryDetailModal } from '@/components/modals/MemoryDetailModal';
import { EditNicknamesModal } from '@/components/modals/EditNicknamesModal';
import { EditDateScreen } from '@/components/screens/EditDateScreen';
import { useAppContext } from '@/context/AppContext';
import { GerberaFlower } from '@/components/ui/GerberaFlower';
import { PenTool } from 'lucide-react';

export default function BitacoraApp() {
  const {
    activeTab,
    isLoggedIn,
    currentUserSlot,
    user1Alias,
    user2Alias,
    setIsEditNicknamesOpen,
    petalShower,
    setPetalShower,
    toastMessage,
    openQuickPlan,
    startNewQuickDate,
    setQuickCreateMode,
    setIsQuickCreateOpen,
    editingMemory
  } = useAppContext();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setPetalShower(false), 4500);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <>
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full font-body text-sm font-medium shadow-2xl flex items-center gap-2 animate-fadeIn border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {toastMessage}
          </div>
        )}
        <LoginScreen />
      </>
    );
  }

  return (
    <>
      <BotanicalBg animate={true} />
      
      {petalShower && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20%`,
                animation: `fallDown ${4 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.8
              }}
            >
              <GerberaFlower size={20 + Math.random() * 15} variant={['purple', 'teal', 'aqua', 'lavender'][Math.floor(Math.random() * 4)] as any} />
            </div>
          ))}
          <style>{`
            @keyframes fallDown {
              0% { transform: translateY(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full font-body text-sm font-medium shadow-2xl flex items-center gap-2 animate-fadeIn border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      <main className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-slate-300 pb-4">
          <div className="flex items-center gap-3">
            <GerberaFlower size={52} variant="mixed" />
            <div>
              <h1 className="font-hand text-4xl sm:text-5xl font-bold text-slate-800 leading-none">
                Bitácora de Recuerdos
              </h1>
              <p className="font-sketch text-lg sm:text-xl text-slate-600 mt-1">
                Diario y planes de {user1Alias} y {user2Alias}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Botón rápido: Anotar Idea */}
            <button
              onClick={openQuickPlan}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-1.5 rounded-xl border-2 border-purple-300 bg-white hover:bg-purple-50 transition-all text-purple-950 font-sketch text-sm sm:text-base shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Anotar una nueva idea de salida sin fecha fija"
            >
              <CalendarPlus className="w-4 h-4 text-purple-600" />
              <span className="font-bold">Anotar Idea</span>
            </button>

            {/* Botón rápido: ¡Salimos ahorita! */}
            <button
              onClick={() => {
                setQuickCreateMode('start_now');
                setIsQuickCreateOpen(true);
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-1.5 rounded-xl border-2 border-teal-700 bg-teal-600 hover:bg-teal-700 transition-all text-white font-sketch text-sm sm:text-base shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 sketch-pill cursor-pointer"
              title="Salida espontánea en 1 paso para empezar a capturar fotos y notas ya"
            >
              <Compass className="w-4 h-4 text-teal-200 animate-pulse" />
              <span className="font-bold">¡Salimos ahorita!</span>
            </button>

            <div className="flex items-center bg-slate-200/80 p-2 rounded-xl border border-slate-300 gap-2 font-sketch text-sm font-bold text-slate-700 shadow-inner">
              <UserCircle2 className={`w-5 h-5 ${currentUserSlot === 1 ? 'text-teal-700' : 'text-purple-700'}`} />
              Sesión iniciada como: {currentUserSlot === 1 ? user1Alias : user2Alias}
            </div>
          </div>
        </header>

        {editingMemory ? (
          <EditDateScreen />
        ) : (
          <>
            <Navbar />

            <div className="min-h-[60vh]">
              {activeTab === 'inicio' && <TabDashboard />}
              {activeTab === 'citas' && <TabPlans />}
              {activeTab === 'historial' && <TabHistory />}
              {activeTab === 'bitacora' && <TabScrapbook />}
              {activeTab === 'perfil' && <TabProfile />}
            </div>
          </>
        )}
      </main>

      <FloatingOngoing />
      
      {/* Modals */}
      <OngoingModal />
      <PlanModal />
      <QuickCreateModal />
      <ZoomModal />
      <MemoryDetailModal />
      <EditNicknamesModal />
    </>
  );
}
