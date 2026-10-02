import React from 'react';
import { Quote, Heart, MapPin, Calendar, Link2, Edit3, Camera, Shuffle, ImageIcon, ArrowRight, Compass, Play, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { WashiTape } from '../ui/WashiTape';

export const TabDashboard = () => {
  const {
    memories,
    wishlist,
    setActiveTab,
    randomQuoteIndex,
    setRandomQuoteIndex,
    randomPlanIndex,
    setRandomPlanIndex,
    randomPhotoSeed,
    setRandomPhotoSeed,
    setSelectedMemory,
    setEditingWish,
    allPhotosWithContext,
    displayedRandomPhotos,
    currentRandomMemoryForQuote,
    currentSuggestedPlan,
    startOngoingDateFromPlan,
    setIsQuickCreateOpen,
    setQuickCreateMode,
    activeOngoingDate,
    setIsLiveDateModalOpen,
    openQuickPlan
  } = useAppContext();

  return (
    <section className="mt-5 space-y-6 animate-fadeIn">
      {/* BANNER DE ACCIÓN: ¿VIVIR UNA SALIDA AHORITA? */}
      {activeOngoingDate ? (
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-teal-800 text-white border-2 border-purple-950 sketch-box p-4 sm:p-5 shadow-[4px_4px_0px_0px_#134e4a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <GerberaFlower size={42} variant="teal" spin />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-300 rounded-full animate-ping" />
            </div>
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
                Cita activa en vivo
              </span>
              <h3 className="font-hand text-2xl sm:text-3xl font-bold leading-tight">
                {activeOngoingDate.title}
              </h3>
              <p className="font-sketch text-xs sm:text-sm text-purple-200">
                Pueden seguir agregando fotos y notas cuando quieran.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLiveDateModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-sketch text-base sm:text-lg border-2 border-teal-950 sketch-pill shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" /> Continuar Cita en Vivo
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-teal-50 via-white to-purple-50 border-2 border-teal-800 sketch-box p-4 sm:p-5 shadow-[4px_4px_0px_0px_#134e4a] flex flex-col sm:flex-row items-center justify-between gap-4 pencil-shade-mixed">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-teal-100 border-2 border-teal-600 flex items-center justify-center shrink-0 shadow-inner">
              <Heart className="w-6 h-6 text-teal-700 animate-pulse fill-teal-200" />
            </div>
            <div>
              <h3 className="font-hand text-2xl sm:text-3xl font-bold text-teal-950 leading-tight">
                ¿Están juntos en este momento?
              </h3>
              <p className="font-sketch text-sm sm:text-base text-slate-600">
                Inicia una salida espontánea en 1 paso o planea una idea para después.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setQuickCreateMode('start_now');
                setIsQuickCreateOpen(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-sketch text-base sm:text-lg border-2 border-teal-950 sketch-pill shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-teal-200" />
              <span>¡Salimos ahorita!</span>
            </button>

            <button
              onClick={openQuickPlan}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-purple-50 text-purple-950 font-sketch text-base border-2 border-purple-400 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-700" />
              <span>Anotar Idea</span>
            </button>
          </div>
        </div>
      )}
      {/* Tarjetas de resumen rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('historial')}
          className="cursor-pointer bg-white/95 border-2 border-purple-800 sketch-box p-3.5 shadow-sm pencil-shade-purple flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div>
            <p className="text-[11px] font-bold uppercase text-purple-700">Citas vividas</p>
            <p className="font-hand text-3xl sm:text-4xl font-bold text-purple-950">{memories.length} citas</p>
          </div>
          <GerberaFlower size={38} variant="purple" />
        </div>

        <div
          onClick={() => setActiveTab('citas')}
          className="cursor-pointer bg-white/95 border-2 border-teal-800 sketch-box-alt p-3.5 shadow-sm pencil-shade-teal flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div>
            <p className="text-[11px] font-bold uppercase text-teal-700">Planes anotados</p>
            <p className="font-hand text-3xl sm:text-4xl font-bold text-teal-950">{wishlist.length} planes</p>
          </div>
          <GerberaFlower size={38} variant="teal" />
        </div>

        <div
          onClick={() => setActiveTab('bitacora')}
          className="cursor-pointer bg-white/95 border-2 border-cyan-800 sketch-box p-3.5 shadow-sm pencil-shade-mixed flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div>
            <p className="text-[11px] font-bold uppercase text-cyan-800">Fotos Polaroid</p>
            <p className="font-hand text-3xl sm:text-4xl font-bold text-slate-900">{allPhotosWithContext.length} fotos</p>
          </div>
          <GerberaFlower size={38} variant="aqua" />
        </div>

        <div
          onClick={() => {
            setRandomQuoteIndex(prev => prev + 1);
            setRandomPhotoSeed(prev => prev + 1);
            setRandomPlanIndex(prev => prev + 1);
          }}
          className="cursor-pointer bg-gradient-to-br from-purple-100 via-white to-teal-100 border-2 border-purple-900 sketch-box-alt p-3.5 shadow-sm flex items-center justify-between hover:-translate-y-0.5 transition-transform"
        >
          <div>
            <p className="text-[11px] font-bold uppercase text-purple-800 flex items-center gap-1">
              <Shuffle className="w-3 h-3" /> Mezclar vista
            </p>
            <p className="font-hand text-2xl sm:text-3xl font-bold text-purple-950 leading-tight">Otra frase</p>
          </div>
          <GerberaFlower size={38} variant="lavender" />
        </div>
      </div>

      {/* BLOQUE CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 bg-white/95 border-2 border-purple-900 sketch-box p-5 sm:p-6 shadow-[4px_5px_0px_0px_rgba(147,51,234,0.22)] pencil-shade-purple relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-3 -bottom-3 opacity-85 pointer-events-none">
            <GerberaFlower size={82} variant="purple" />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-purple-100 text-purple-900 border border-purple-400 sketch-pill text-xs font-bold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5 text-purple-700" /> Frase aleatoria de nuestras citas
              </span>
              <button
                onClick={() => setRandomQuoteIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-300"
              >
                <Shuffle className="w-3 h-3" /> Otra frase
              </button>
            </div>

            {currentRandomMemoryForQuote ? (
              <div className="mt-4">
                <p className="font-hand text-3xl sm:text-4xl text-purple-950 leading-snug">
                  {currentRandomMemoryForQuote.random_quote}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-teal-50/90 border border-teal-300 rounded-xl p-2.5">
                    <p className="text-[10px] font-bold uppercase text-teal-800 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-teal-600" /> Algo bonito de ese día
                    </p>
                    <p className="font-sketch text-sm text-slate-700 mt-0.5 line-clamp-2">
                      “{currentRandomMemoryForQuote.person1_nice_note}”
                    </p>
                  </div>
                  <div className="bg-purple-50/90 border border-purple-300 rounded-xl p-2.5">
                    <p className="text-[10px] font-bold uppercase text-purple-800 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-purple-600" /> Algo bonito de ese día
                    </p>
                    <p className="font-sketch text-sm text-slate-700 mt-0.5 line-clamp-2">
                      “{currentRandomMemoryForQuote.person2_nice_note}”
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-purple-50/70 border-2 border-dashed border-purple-300 rounded-2xl p-5 text-center">
                <GerberaFlower size={44} variant="purple" spin className="mx-auto mb-2" />
                <h4 className="font-hand text-2xl sm:text-3xl font-bold text-purple-950">
                  Empezando a construir recuerdos
                </h4>
                <p className="font-sketch text-base text-slate-700 max-w-md mx-auto mt-1">
                  Nuestra bitácora recién empieza a latir. En cuanto salgan y sellen su primera cita, aquí aparecerán las frases espontáneas y cosas bonitas que se dijeron.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuickCreateMode('start_now');
                    setIsQuickCreateOpen(true);
                  }}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-sketch text-base sketch-pill border-2 border-purple-950 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Heart className="w-4 h-4 text-purple-200 fill-purple-300" />
                  ¡Vivir nuestra primera cita!
                </button>
              </div>
            )}
          </div>

          {currentRandomMemoryForQuote && (
            <div className="mt-4 pt-3 border-t border-dashed border-purple-300 flex flex-wrap items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="font-bold text-purple-950">{currentRandomMemoryForQuote.title}</span>
                <span>•</span>
                <span>{currentRandomMemoryForQuote.scheduled_date}</span>
              </div>
              <button
                onClick={() => setSelectedMemory(currentRandomMemoryForQuote)}
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-purple-950 underline"
              >
                <span>Ver esta cita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white/95 border-2 border-teal-800 sketch-box-alt p-5 shadow-[4px_5px_0px_0px_rgba(13,148,136,0.25)] pencil-shade-teal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-400">
                <Compass className="w-3.5 h-3.5 text-teal-700" /> ¿Qué podemos hacer?
              </span>
              {wishlist.length > 1 && (
                <button
                  onClick={() => setRandomPlanIndex((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:underline"
                >
                  <Shuffle className="w-3 h-3" /> Ver otro plan
                </button>
              )}
            </div>

            {currentSuggestedPlan ? (
              <>
                <h3 className="font-hand text-2xl sm:text-3xl font-bold text-teal-950 mt-2.5">
                  {currentSuggestedPlan.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-teal-800">
                    <MapPin className="w-3.5 h-3.5" /> {currentSuggestedPlan.location_name}
                  </span>
                  {currentSuggestedPlan.tentative_date && (
                    <span className="inline-flex items-center gap-1 text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      <Calendar className="w-3 h-3" /> {currentSuggestedPlan.tentative_date}
                    </span>
                  )}
                </div>
                <p className="font-sketch text-base text-slate-700 mt-3 bg-white/90 p-3 rounded-xl border border-dashed border-teal-400">
                  “{currentSuggestedPlan.planning_notes}”
                </p>
                {currentSuggestedPlan.references?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {currentSuggestedPlan.references.map((r: any) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-purple-800 px-2.5 py-1 rounded-lg border border-purple-300 hover:bg-purple-50"
                      >
                        <Link2 className="w-3 h-3" /> {r.label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4 bg-teal-50/70 border-2 border-dashed border-teal-300 rounded-2xl p-5 text-center">
                <GerberaFlower size={42} variant="teal" className="mx-auto mb-2" />
                <h4 className="font-hand text-2xl font-bold text-teal-950">
                  El baúl de ideas está listo
                </h4>
                <p className="font-sketch text-sm sm:text-base text-slate-700 mt-1">
                  ¿Vieron un café lindo en TikTok o quieren una caminata? Anoten aquí sus planes para salir sin presiones ni fechas obligatorias.
                </p>
                <button
                  type="button"
                  onClick={openQuickPlan}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-sketch text-sm sketch-pill border border-teal-950 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Anotar primera idea
                </button>
              </div>
            )}
          </div>

          {currentSuggestedPlan && (
            <div className="mt-4 pt-3 border-t border-dashed border-teal-300 flex items-center justify-between gap-2">
              <button
                onClick={() => setEditingWish(currentSuggestedPlan)}
                className="text-xs font-bold text-teal-900 hover:underline inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar plan
              </button>
              <button
                onClick={() => startOngoingDateFromPlan(currentSuggestedPlan)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold sketch-pill border border-purple-950 shadow-sm cursor-pointer hover:scale-105 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Empezar esta cita
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/95 border-2 border-purple-900 sketch-box p-4 sm:p-6 shadow-sm pencil-shade-mixed">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-700" />
            <h3 className="font-hand text-2xl sm:text-3xl font-bold text-purple-950">Fotos aleatorias de nuestras citas</h3>
          </div>
          {allPhotosWithContext.length > 0 && (
            <button
              onClick={() => setRandomPhotoSeed((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-purple-50 text-purple-900 border border-purple-400 sketch-pill text-xs font-bold shadow-sm cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" /> Mezclar fotos
            </button>
          )}
        </div>

        {displayedRandomPhotos && displayedRandomPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
            {displayedRandomPhotos.map((photo: any, idx: number) => (
              <div
                key={`${photo.id}-${idx}`}
                onClick={() => setSelectedMemory(photo.memoryObj)}
                style={{ transform: `rotate(${idx % 2 === 0 ? '-1.5deg' : '1.5deg'})` }}
                className="cursor-pointer bg-white p-3 pb-4 border-2 border-slate-800 shadow-[4px_5px_0px_0px_rgba(13,148,136,0.25)] hover:scale-[1.02] transition-transform relative group"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <WashiTape color={idx % 2 === 0 ? 'purple' : 'teal'} rotate={idx % 2 === 0 ? '-2deg' : '2deg'} />
                </div>
                <div className="aspect-square w-full overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="font-hand text-xl text-slate-900 text-center mt-2.5 leading-snug">{photo.caption}</p>
                <p className="text-[11px] text-center text-teal-800 font-semibold mt-0.5">
                  {photo.memoryTitle} ({photo.memoryDate})
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-purple-50/40 rounded-2xl border border-dashed border-purple-300 my-2">
            <div className="flex justify-center gap-4 mb-3 opacity-75">
              <div className="w-24 h-28 bg-white p-2 border-2 border-slate-300 rounded-lg shadow-sm -rotate-6 flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 text-purple-400" />
                <span className="text-[10px] font-sketch text-slate-400 mt-1">Tu Polaroid</span>
              </div>
              <div className="w-24 h-28 bg-white p-2 border-2 border-slate-300 rounded-lg shadow-sm rotate-6 flex flex-col items-center justify-center">
                <Heart className="w-6 h-6 text-teal-400" />
                <span className="text-[10px] font-sketch text-slate-400 mt-1">Un recuerdo</span>
              </div>
            </div>
            <h4 className="font-hand text-2xl font-bold text-purple-950">
              Colección de Polaroids lista para estrenar
            </h4>
            <p className="font-sketch text-sm sm:text-base text-slate-600 max-w-md mx-auto mt-1 px-4">
              Cada foto que suban en una cita se comprimirá automáticamente en WebP y aparecerá aquí con su pie y nota secreta al reverso.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
