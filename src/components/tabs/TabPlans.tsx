import React from 'react';
import { Plus, Calendar, MapPin, Link2, ExternalLink, CheckSquare, Square, Edit3, Camera } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { WashiTape } from '../ui/WashiTape';

export const TabPlans = () => {
  const { wishlist, setWishlist, setEditingWish, openQuickPlan, startOngoingDateFromPlan, savePlan } = useAppContext();

  const toggleChecklistItem = async (wishId: string, itemId: string) => {
    const target = wishlist.find((w) => w.id === wishId);
    if (!target) return;
    const updatedChecklist = target.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedPlan = { ...target, checklist: updatedChecklist };
    setWishlist((prev) => prev.map((w) => (w.id === wishId ? updatedPlan : w)));
    await savePlan(updatedPlan);
  };

  return (
    <section className="mt-5 space-y-6 animate-fadeIn">
      <div className="bg-white/95 border-2 border-teal-800 sketch-box p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pencil-shade-teal shadow-sm">
        <div>
          <h2 className="font-hand text-3xl sm:text-4xl font-bold text-teal-950 flex items-center gap-2">
            <span>Planes y Citas para Hacer</span>
            <GerberaFlower size={32} variant="teal" />
          </h2>
          <p className="font-sketch text-base sm:text-lg text-slate-700">
            Ideas con sus notas y links de referencia. Ambos pueden editarlas o empezar la cita en cualquier momento.
          </p>
        </div>
        <button
          onClick={openQuickPlan}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-sketch text-base border-2 border-purple-950 sketch-box shadow-[3px_3px_0px_0px_#14B8A6] cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Anotar Idea
        </button>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((wish, idx) => {
            const completedCount = wish.checklist.filter((c) => c.completed).length;
            return (
              <div
                key={wish.id}
                className="bg-white/95 border-2 border-purple-900 sketch-box p-4 sm:p-5 shadow-[5px_6px_0px_0px_rgba(147,51,234,0.22)] flex flex-col justify-between relative group hover:-translate-y-1 transition-transform pencil-shade-mixed"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <WashiTape color={idx % 2 === 0 ? 'teal' : 'purple'} rotate={idx % 2 === 0 ? '-2deg' : '3deg'} />
                </div>
                <div className="absolute -top-4 -right-3">
                  <GerberaFlower size={40} variant={idx % 2 === 0 ? 'purple' : 'teal'} />
                </div>

                <div className="pt-2">
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-purple-100/90 text-purple-900 border border-purple-300 sketch-pill">
                      <Calendar className="w-3 h-3 text-purple-700" /> {wish.tentative_date || 'Fecha por definir'}
                    </span>
                    {wish.location_name && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-300 sketch-pill">
                        <MapPin className="w-3.5 h-3.5 text-teal-700" /> {wish.location_name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-hand text-3xl font-bold text-purple-950 leading-snug">{wish.title}</h3>

                  {wish.planning_notes && (
                    <p className="font-sketch text-base text-slate-700 mt-2.5 bg-purple-50/70 p-3 rounded-xl border border-dashed border-purple-300">
                      “{wish.planning_notes}”
                    </p>
                  )}

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-950 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Link2 className="w-3.5 h-3.5 text-purple-700" /> Referencias ({wish.references?.length || 0})
                      </span>
                      <button onClick={() => setEditingWish(wish)} className="text-[11px] text-teal-700 hover:underline cursor-pointer">
                        + Añadir link
                      </button>
                    </div>
                    {wish.references && wish.references.length > 0 ? (
                      <div className="space-y-1">
                        {wish.references.map((ref) => (
                          <a key={ref.id} href={ref.url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs font-sketch bg-white/90 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-300 text-teal-950 transition-colors">
                            <span className="truncate">{ref.label}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-teal-700 ml-1" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-sketch text-slate-400">Sin links de referencia aún</p>
                    )}
                  </div>

                  {wish.checklist.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                        <span>Por tener en cuenta:</span>
                        <span className="text-teal-700">{completedCount}/{wish.checklist.length}</span>
                      </div>
                      {wish.checklist.map((item) => (
                        <button key={item.id} onClick={() => toggleChecklistItem(wish.id, item.id)} className="w-full flex items-center gap-2 text-left text-xs py-1 px-2 rounded-lg hover:bg-teal-50/80 transition-colors cursor-pointer">
                          {item.completed ? <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" /> : <Square className="w-4 h-4 text-purple-400 shrink-0" />}
                          <span className={`font-sketch text-base ${item.completed ? 'line-through text-slate-400 decoration-teal-600 decoration-2' : 'text-slate-800'}`}>
                            {item.item}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-purple-300 flex items-center justify-between gap-2">
                  <button onClick={() => setEditingWish(wish)} className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-purple-950 underline cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" /> Editar todo
                  </button>
                  <button onClick={() => startOngoingDateFromPlan(wish)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-bold sketch-pill border border-teal-950 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all">
                    <Camera className="w-3.5 h-3.5" /> Empezar / Subir Fotos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/95 border-2 border-teal-800 sketch-box p-8 sm:p-12 text-center pencil-shade-teal shadow-sm">
          <GerberaFlower size={52} variant="teal" className="mx-auto mb-3" />
          <h3 className="font-hand text-3xl sm:text-4xl font-bold text-teal-950">
            El baúl de ideas está esperando
          </h3>
          <p className="font-sketch text-base sm:text-lg text-slate-700 max-w-md mx-auto mt-2">
            Anoten aquí lugares que tienen ganas de conocer, recetas por cocinar o escapadas. Pueden pegar enlaces de Google Maps y TikTok sin fijar una fecha obligatoria.
          </p>
          <button
            type="button"
            onClick={openQuickPlan}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-sketch text-base sm:text-lg border-2 border-teal-950 sketch-pill shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-100" />
            Anotar primera idea
          </button>
        </div>
      )}
    </section>
  );
};
