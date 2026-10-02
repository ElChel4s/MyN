import React from 'react';
import { Home, Compass, History, BookOpen, UserCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const navigationTabs = [
  { id: 'inicio', label: 'Inicio', shortLabel: 'Inicio', icon: Home, badge: null },
  { id: 'citas', label: 'Planes y Citas', shortLabel: 'Planes', icon: Compass, badge: 'plans' },
  { id: 'historial', label: 'Historial', shortLabel: 'Historial', icon: History, badge: 'memories' },
  { id: 'bitacora', label: 'Bitácora Completa', shortLabel: 'Bitácora', icon: BookOpen, badge: 'Todo' },
  { id: 'perfil', label: 'Mi Perfil', shortLabel: 'Perfil', icon: UserCircle, badge: null }
];

export const Navbar = () => {
  const { activeTab, setActiveTab, wishlist, memories } = useAppContext();

  return (
    <>
      {/* Pestañas Desktop */}
      <nav className="hidden md:grid grid-cols-5 gap-3 mt-4 pt-3.5 border-t border-dashed border-purple-300">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          let badgeValue: React.ReactNode = tab.badge;
          if (tab.badge === 'plans') badgeValue = wishlist.length;
          if (tab.badge === 'memories') badgeValue = memories.length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-4 py-2.5 border-2 transition-all sketch-box ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white border-purple-950 shadow-[3px_3px_0px_0px_#3B0764] -translate-y-0.5'
                  : 'bg-white/85 hover:bg-purple-50 text-slate-800 border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-hand text-xl font-bold tracking-wide">{tab.label}</span>
              </div>
              {badgeValue !== null && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-900'
                  }`}
                >
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* BARRA DE NAVEGACIÓN INFERIOR PARA CELULAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-purple-900 px-2 py-1.5 shadow-[0_-4px_12px_rgba(88,28,135,0.15)]">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-sm -translate-y-0.5'
                    : 'text-slate-700 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-sketch text-xs mt-0.5 leading-none">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
