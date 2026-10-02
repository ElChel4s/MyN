import React, { useMemo } from 'react';
import { Layers, BookOpen, ChevronLeft, ChevronRight, Calendar, MapPin, Edit3, ArrowRight, Smile, PenTool, MessageSquareHeart, Heart, Quote, Camera } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { WashiTape } from '../ui/WashiTape';
import { PolaroidCard } from '../ui/PolaroidCard';

export const TabScrapbook = () => {
  const {
    memories,
    searchQuery,
    bitacoraMode,
    setBitacoraMode,
    currentPageIndex,
    setCurrentPageIndex,
    isPageTurning,
    setIsPageTurning,
    user1Alias,
    user2Alias,
    flippedPolaroids,
    setFlippedPolaroids,
    setSelectedMemory,
    setZoomedPhoto,
    setIsQuickCreateOpen,
    setQuickCreateMode
  } = useAppContext();

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const q = searchQuery.toLowerCase();
      return (
        !q.trim() ||
        m.title.toLowerCase().includes(q) ||
        m.location_name.toLowerCase().includes(q) ||
        m.random_quote.toLowerCase().includes(q)
      );
    });
  }, [memories, searchQuery]);

  const currentBookMemory = filteredMemories[currentPageIndex] || filteredMemories[0];

  const handleTurnPage = (direction: 'next' | 'prev') => {
    setIsPageTurning(true);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentPageIndex((prev) => (prev < filteredMemories.length - 1 ? prev + 1 : 0));
      } else {
        setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : filteredMemories.length - 1));
      }
      setIsPageTurning(false);
    }, 200);
  };

  const togglePolaroidFlip = (photoId: string) => {
    setFlippedPolaroids((prev) => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  const renderFullMemorySpread = (memory: any, index: number) => (
    <div key={memory.id} className="relative bg-gradient-to-b from-purple-900 via-purple-950 to-teal-950 p-2 sm:p-4 rounded-[24px] sm:rounded-[30px] shadow-xl border-4 border-purple-950 mb-10">
      <div className="absolute -top-3.5 left-8 z-30 hidden sm:block">
        <WashiTape color={index % 2 === 0 ? 'purple' : 'teal'} rotate={index % 2 === 0 ? '-3deg' : '3deg'} />
      </div>
      <div className="absolute -top-3.5 right-8 z-30 hidden sm:block">
        <WashiTape color={index % 2 === 0 ? 'teal' : 'floral'} rotate={index % 2 === 0 ? '3deg' : '-3deg'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#FCFBF7] rounded-[18px] sm:rounded-[22px] overflow-hidden border-2 border-purple-300 relative">
        <div className="hidden lg:flex flex-col justify-around items-center absolute inset-y-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          {Array.from({ length: 11 }).map((_, idx) => (
            <div key={idx} className="w-9 h-3.5 rounded-full bg-gradient-to-r from-purple-300 via-white to-teal-300 border-2 border-purple-900 shadow-sm" />
          ))}
        </div>

        {/* HOJA IZQUIERDA */}
        <div className="p-4 sm:p-7 lg:pr-10 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-purple-300 pencil-shade-purple relative flex flex-col justify-between">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-white text-purple-900 border border-purple-300 sketch-pill">
                  <Calendar className="w-3 h-3 text-purple-600" /> {memory.scheduled_date}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-300 sketch-pill">
                  <MapPin className="w-3 h-3 text-teal-700" /> {memory.location_name}
                </span>
              </div>
              <h3 className="font-hand text-2xl sm:text-4xl font-bold text-purple-950 mt-1.5 leading-tight">{memory.title}</h3>
            </div>
            <div className="shrink-0 border-2 border-double border-teal-700/80 text-teal-800 px-2.5 py-1 rounded-xl -rotate-3 bg-teal-50/80 text-center shadow-inner select-none">
              <p className="text-[9px] font-bold tracking-widest uppercase">SELLO DE CITA</p>
              <p className="font-sketch text-xs sm:text-sm font-bold">{memory.stamp_code}</p>
            </div>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {memory.photos.map((photo: any, pIdx: number) => (
              <PolaroidCard
                key={photo.id}
                photo={photo}
                idx={pIdx}
                isFlipped={!!flippedPolaroids[photo.id]}
                gerberaColor={memory.gerbera_color}
                onToggleFlip={togglePolaroidFlip}
                onZoom={setZoomedPhoto}
              />
            ))}
          </div>

          <div className="bg-white/85 rounded-xl p-3 border border-dashed border-purple-300 mb-3">
            <p className="text-[11px] font-bold text-purple-900 mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-700" /> Apuntes detrás de las fotos:
            </p>
            <div className="space-y-1">
              {memory.photos.map((p: any, idx: number) => (
                <p key={p.id} className="font-sketch text-xs sm:text-sm text-slate-700">• Foto {idx + 1}: “{p.secret_back}”</p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-dashed border-purple-300">
            <button onClick={() => {}} className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-100/80 px-3 py-1.5 rounded-full border border-teal-400">
              <Edit3 className="w-3.5 h-3.5" /> Agregar fotos o editar textos
            </button>
            <button onClick={() => setSelectedMemory(memory)} className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-purple-950 underline">
              <span>Ver en ventana individual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* HOJA DERECHA */}
        <div className="p-4 sm:p-7 lg:pl-10 pencil-shade-teal relative flex flex-col justify-between space-y-4">
          <div className="absolute top-2 right-3 opacity-90 pointer-events-none hidden sm:block">
            <GerberaFlower size={48} variant="mixed" withStem />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-teal-700" />
              <h4 className="font-hand text-2xl font-bold text-slate-900">Lo que más nos gustó de la cita</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-teal-50/95 border-2 border-teal-700 sketch-box-alt p-3 shadow-sm">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-950 bg-teal-200/80 px-2.5 py-0.5 rounded-full border border-teal-500 mb-1">
                  <PenTool className="w-3 h-3 text-teal-800" /> {user1Alias}
                </span>
                <p className="font-sketch text-sm sm:text-base text-slate-800 leading-relaxed">“{memory.person1_liked}”</p>
              </div>
              <div className="bg-purple-50/95 border-2 border-purple-700 sketch-box p-3 shadow-sm">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-950 bg-purple-200/80 px-2.5 py-0.5 rounded-full border border-purple-500 mb-1">
                  <PenTool className="w-3 h-3 text-purple-800" /> {user2Alias}
                </span>
                <p className="font-sketch text-sm sm:text-base text-slate-800 leading-relaxed">“{memory.person2_liked}”</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-purple-700" />
              <h4 className="font-hand text-2xl font-bold text-slate-900">Algo bonito sobre ti en esta cita</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/95 border-2 border-teal-600 sketch-box p-3 shadow-sm relative">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-900 mb-1">
                  <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-200" /> <span>De {user1Alias} para ti:</span>
                </div>
                <p className="font-sketch text-sm sm:text-base text-slate-800 leading-relaxed">“{memory.person1_nice_note}”</p>
              </div>
              <div className="bg-white/95 border-2 border-purple-600 sketch-box-alt p-3 shadow-sm relative">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-900 mb-1">
                  <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-200" /> <span>De {user2Alias} para ti:</span>
                </div>
                <p className="font-sketch text-sm sm:text-base text-slate-800 leading-relaxed">“{memory.person2_nice_note}”</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 border-2 border-purple-800 sketch-box p-4 shadow-[4px_4px_0px_0px_#A855F7] relative">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700">
              <Quote className="w-4 h-4 text-purple-600" /> Frase random o momento que pasó en la cita
            </div>
            <p className="font-hand text-2xl sm:text-3xl text-purple-950 mt-1 leading-snug">{memory.random_quote}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mt-5 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/95 border-2 border-purple-800 sketch-box px-4 py-3.5 shadow-sm pencil-shade-mixed">
        <div>
          <h2 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950 flex items-center gap-2">
            <span>Bitácora Completa</span>
            <GerberaFlower size={30} variant="purple" />
          </h2>
          <p className="font-sketch text-sm sm:text-base text-slate-700">
            Todas nuestras citas abiertas con sus fotos, qué le gustó a cada uno, algo bonito sobre el otro y la frase random.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 p-1 rounded-xl border border-teal-400 shrink-0">
          <button
            onClick={() => setBitacoraMode('completa')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              bitacoraMode === 'completa' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Todo Desplegado ({filteredMemories.length})
          </button>
          <button
            onClick={() => setBitacoraMode('libro')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              bitacoraMode === 'libro' ? 'bg-teal-600 text-white shadow-sm' : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Hojear 1 por 1
          </button>
        </div>
      </div>

      {filteredMemories.length === 0 ? (
        <div className="relative bg-gradient-to-b from-purple-900 via-purple-950 to-teal-950 p-3 sm:p-5 rounded-[24px] sm:rounded-[30px] shadow-xl border-4 border-purple-950 my-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#FCFBF7] rounded-[18px] sm:rounded-[22px] overflow-hidden border-2 border-purple-300 relative p-6 sm:p-10">
            {/* Hoja izquierda */}
            <div className="p-4 sm:p-6 text-center border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-purple-300 flex flex-col items-center justify-center">
              <GerberaFlower size={60} variant="purple" spin className="mb-3" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                Página 1 • La libreta en blanco
              </span>
              <h3 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950 mt-2">
                Construyendo nuestros recuerdos
              </h3>
              <p className="font-sketch text-base sm:text-lg text-slate-700 mt-2 max-w-sm">
                Las mejores historias de amor se escriben un momento a la vez. Este cuaderno digital de Marcelo y Nicole está listo para ser inaugurado con su primera salida.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuickCreateMode('start_now');
                  setIsQuickCreateOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-sketch text-base rounded-2xl border-2 border-purple-950 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-purple-200 fill-purple-300" />
                ¡Vivir nuestra primera cita!
              </button>
            </div>

            {/* Hoja derecha */}
            <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center pencil-shade-teal">
              <div className="w-52 h-52 border-2 border-dashed border-teal-400 rounded-2xl p-4 flex flex-col items-center justify-center bg-white/80 shadow-inner">
                <Camera className="w-10 h-10 text-teal-600 mb-2" />
                <p className="font-hand text-2xl font-bold text-teal-950">Primera Polaroid</p>
                <p className="font-sketch text-xs text-slate-500 mt-1 max-w-[160px]">
                  Aquí se revelará su primera foto con la nota secreta al reverso
                </p>
              </div>
              <p className="font-sketch text-base text-teal-900 mt-4 italic">
                «No recordamos días, recordamos momentos.»
              </p>
            </div>
          </div>
        </div>
      ) : bitacoraMode === 'completa' ? (
        <div className="space-y-10 pt-2">
          {filteredMemories.map((memory, index) => renderFullMemorySpread(memory, index))}
        </div>
      ) : currentBookMemory ? (
        <div className="pt-1">
          <div className="flex items-center justify-between mb-4 px-1">
            <button onClick={() => handleTurnPage('prev')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-900 border-2 border-purple-800 sketch-pill font-sketch text-sm sm:text-base shadow-[2px_2px_0px_0px_#581C87] cursor-pointer">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <div className="flex items-center gap-2">
              <GerberaFlower size={24} variant="purple" />
              <span className="font-hand text-xl sm:text-2xl font-bold text-purple-950">
                Cita {currentPageIndex + 1} de {filteredMemories.length}
              </span>
              <GerberaFlower size={24} variant="teal" />
            </div>
            <button onClick={() => handleTurnPage('next')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-900 border-2 border-teal-800 sketch-pill font-sketch text-sm sm:text-base shadow-[2px_2px_0px_0px_#115E59] cursor-pointer">
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className={`transition-all duration-300 ${isPageTurning ? 'scale-[0.98] opacity-75' : 'scale-100 opacity-100'}`}>
            {renderFullMemorySpread(currentBookMemory, currentPageIndex)}
          </div>
        </div>
      ) : null}
    </section>
  );
};
