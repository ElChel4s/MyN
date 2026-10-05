import React, { useMemo } from 'react';
import {
  Layers,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Edit3,
  ArrowRight,
  Smile,
  PenTool,
  MessageSquareHeart,
  Heart,
  Quote,
  Camera,
  Sparkles
} from 'lucide-react';
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
    setEditingMemory,
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

  // Renderizado artístico tipo Álbum / Scrapbook con "desorden bonito"
  const renderFullMemorySpread = (memory: any, index: number) => {
    const photo1 = memory.photos?.[0];
    const photo2 = memory.photos?.[1];
    const extraPhotos = memory.photos?.slice(2) || [];

    return (
      <div
        key={memory.id}
        className="relative bg-gradient-to-b from-purple-900 via-purple-950 to-teal-950 p-2.5 sm:p-5 rounded-[28px] sm:rounded-[36px] shadow-2xl border-4 border-purple-950 mb-12 select-none"
      >
        {/* Cintas decorativas superiores */}
        <div className="absolute -top-3.5 left-8 z-30 hidden sm:block pointer-events-none">
          <WashiTape color={index % 2 === 0 ? 'purple' : 'teal'} rotate={index % 2 === 0 ? '-3deg' : '3deg'} />
        </div>
        <div className="absolute -top-3.5 right-8 z-30 hidden sm:block pointer-events-none">
          <WashiTape color={index % 2 === 0 ? 'teal' : 'floral'} rotate={index % 2 === 0 ? '3deg' : '-3deg'} />
        </div>

        {/* Hoja de papel del cuaderno Scrapbook */}
        <div className="bg-[#FAF7EE] rounded-[20px] sm:rounded-[26px] overflow-hidden border-3 border-purple-300 relative p-4 sm:p-7 shadow-inner">
          {/* Cabecera del recuerdo: Título, fecha, lugar y sellos */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-dashed border-purple-200 pb-4 mb-6">
            <div className="flex-1 min-w-[220px]">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-white text-purple-900 border-2 border-purple-300 rounded-full font-sketch shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" /> {memory.scheduled_date || 'Fecha especial'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-teal-50 text-teal-900 border-2 border-teal-300 rounded-full font-sketch shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" /> {memory.location_name || 'Lugar lindo'}
                </span>
              </div>
              <h3 className="font-hand text-3xl sm:text-5xl font-bold text-purple-950 mt-1 leading-tight tracking-wide">
                {memory.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Sello oficial de la cita */}
              <div className="border-2 border-double border-teal-700 text-teal-900 px-3 py-1.5 rounded-xl -rotate-3 bg-teal-50/90 text-center shadow-xs select-none">
                <p className="text-[9px] font-bold tracking-widest uppercase font-sketch">SELLO OFICIAL</p>
                <p className="font-sketch text-xs sm:text-sm font-bold">{memory.stamp_code}</p>
              </div>

              {/* Botón rápido para editar esta cita en pantalla completa */}
              <button
                type="button"
                onClick={() => setEditingMemory(memory)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-900 bg-teal-100 hover:bg-teal-200 px-3.5 py-2 rounded-xl border border-teal-400 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer font-sketch"
                title="Editar cita, agregar fotos o modificar tus textos"
              >
                <Edit3 className="w-4 h-4 text-teal-700" />
                <span>Editar cita</span>
              </button>
            </div>
          </div>

          {/* ÁREA DE COLLAGE INTERACTIVO ("Desorden bonito y dinámico") */}
          <div className="space-y-6">
            {/* FILA / CLUSTER 1: Foto 1 + Lo que más le gustó a Marcelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Elemento 1: Primera Polaroid */}
              {photo1 ? (
                <div className="flex justify-center">
                  <PolaroidCard
                    photo={photo1}
                    idx={0}
                    isFlipped={!!flippedPolaroids[photo1.id]}
                    gerberaColor={memory.gerbera_color}
                    onToggleFlip={togglePolaroidFlip}
                    onZoom={setZoomedPhoto}
                  />
                </div>
              ) : (
                <div className="aspect-square max-w-[260px] mx-auto w-full bg-white/70 border-2 border-dashed border-teal-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Camera className="w-8 h-8 text-teal-600 mb-2" />
                  <p className="font-hand text-xl font-bold text-teal-950">Primera Polaroid</p>
                  <p className="font-sketch text-xs text-slate-500 mt-1">¡Toca "Editar cita" para subir fotos!</p>
                </div>
              )}

              {/* Elemento 2: Post-it de Marcelo ("Lo que más me gustó") */}
              <div
                className="relative bg-[#E8F8F5] border-2 border-teal-700 rounded-2xl p-5 shadow-[4px_6px_0px_0px_rgba(17,94,89,0.22)] pencil-shade-teal transition-transform hover:scale-[1.01]"
                style={{ transform: 'rotate(1.8deg)' }}
              >
                <div className="absolute -top-3 left-6 pointer-events-none">
                  <WashiTape color="teal" rotate="-2deg" />
                </div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-950 bg-teal-200/90 px-2.5 py-0.5 rounded-full border border-teal-500 font-sketch">
                    <PenTool className="w-3 h-3 text-teal-800" /> Lo que más le gustó a {user1Alias}
                  </span>
                </div>
                <p className="font-sketch text-base sm:text-lg text-slate-800 leading-relaxed">
                  “{memory.person1_liked || 'Un recuerdo hermoso guardado en el corazón.'}”
                </p>
              </div>
            </div>

            {/* FILA / CLUSTER 2: Nota romántica para Marcelo + Foto 2 (o Post-it de Nicole) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Elemento 3: Carta Romántica revelada (De Nicole para Marcelo) */}
              <div
                className="relative bg-[#FFFDF9] border-2 border-dashed border-purple-500 rounded-2xl p-5 shadow-[4px_6px_0px_0px_rgba(147,51,234,0.18)] transition-transform hover:scale-[1.01]"
                style={{ transform: 'rotate(-1.8deg)' }}
              >
                <div className="absolute -top-3 right-6 pointer-events-none">
                  <WashiTape color="purple" rotate="2deg" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2 font-sketch">
                  <Heart className="w-4 h-4 text-purple-600 fill-purple-200" />
                  <span>💌 De {user2Alias} para {user1Alias}:</span>
                </div>
                <p className="font-sketch text-base sm:text-lg text-slate-800 italic leading-relaxed">
                  “{memory.person2_nice_note || 'Un detalle lleno de ternura y cariño.'}”
                </p>
              </div>

              {/* Elemento 4: Segunda Polaroid si existe */}
              {photo2 ? (
                <div className="flex justify-center">
                  <PolaroidCard
                    photo={photo2}
                    idx={1}
                    isFlipped={!!flippedPolaroids[photo2.id]}
                    gerberaColor={memory.gerbera_color}
                    onToggleFlip={togglePolaroidFlip}
                    onZoom={setZoomedPhoto}
                  />
                </div>
              ) : (
                /* Si no hay segunda foto, mostramos aquí el Post-it de Nicole */
                <div
                  className="relative bg-[#F7EEFB] border-2 border-purple-700 rounded-2xl p-5 shadow-[4px_6px_0px_0px_rgba(88,28,135,0.22)] pencil-shade-purple transition-transform hover:scale-[1.01]"
                  style={{ transform: 'rotate(1.5deg)' }}
                >
                  <div className="absolute -top-3 left-6 pointer-events-none">
                    <WashiTape color="purple" rotate="-2deg" />
                  </div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-950 bg-purple-200/90 px-2.5 py-0.5 rounded-full border border-purple-500 font-sketch">
                      <PenTool className="w-3 h-3 text-purple-800" /> Lo que más le gustó a {user2Alias}
                    </span>
                  </div>
                  <p className="font-sketch text-base sm:text-lg text-slate-800 leading-relaxed">
                    “{memory.person2_liked || 'Un instante mágico que nunca olvidaré.'}”
                  </p>
                </div>
              )}
            </div>

            {/* FILA / CLUSTER 3: Si había foto 2, mostramos aquí el Post-it de Nicole + Carta para Nicole */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {photo2 && (
                <div
                  className="relative bg-[#F7EEFB] border-2 border-purple-700 rounded-2xl p-5 shadow-[4px_6px_0px_0px_rgba(88,28,135,0.22)] pencil-shade-purple transition-transform hover:scale-[1.01]"
                  style={{ transform: 'rotate(-1.5deg)' }}
                >
                  <div className="absolute -top-3 left-6 pointer-events-none">
                    <WashiTape color="purple" rotate="-2deg" />
                  </div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-950 bg-purple-200/90 px-2.5 py-0.5 rounded-full border border-purple-500 font-sketch">
                      <PenTool className="w-3 h-3 text-purple-800" /> Lo que más le gustó a {user2Alias}
                    </span>
                  </div>
                  <p className="font-sketch text-base sm:text-lg text-slate-800 leading-relaxed">
                    “{memory.person2_liked || 'Un instante mágico que nunca olvidaré.'}”
                  </p>
                </div>
              )}

              {/* Elemento: Carta Romántica revelada (De Marcelo para Nicole) */}
              <div
                className={`relative bg-[#FFFDF9] border-2 border-dashed border-teal-500 rounded-2xl p-5 shadow-[4px_6px_0px_0px_rgba(17,94,89,0.18)] transition-transform hover:scale-[1.01] ${
                  !photo2 ? 'md:col-span-2 max-w-xl mx-auto w-full' : ''
                }`}
                style={{ transform: 'rotate(1.2deg)' }}
              >
                <div className="absolute -top-3 left-6 pointer-events-none">
                  <WashiTape color="teal" rotate="2.5deg" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-2 font-sketch">
                  <Heart className="w-4 h-4 text-teal-600 fill-teal-200" />
                  <span>💌 De {user1Alias} para {user2Alias}:</span>
                </div>
                <p className="font-sketch text-base sm:text-lg text-slate-800 italic leading-relaxed">
                  “{memory.person1_nice_note || 'Un detalle lleno de ternura y cariño.'}”
                </p>
              </div>
            </div>

            {/* LISTÓN VINTAGE: Frase Random / Momento que pasó */}
            {memory.random_quote && (
              <div
                className="relative bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-purple-950 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#581C87] text-center my-3 transition-transform hover:scale-[1.01]"
                style={{ transform: 'rotate(-0.8deg)' }}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 pointer-events-none">
                  <WashiTape color="floral" rotate="1deg" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center justify-center gap-1.5 font-sketch">
                  <Quote className="w-4 h-4 text-purple-700" /> Frase random o momento cómico que nos pasó
                </p>
                <p className="font-hand text-2xl sm:text-4xl text-purple-950 mt-1 font-bold leading-snug">
                  “{memory.random_quote}”
                </p>
              </div>
            )}

            {/* MURAL DE POLAROIDS ADICIONALES (Para citas con muchas fotos - Ilimitadas) */}
            {extraPhotos.length > 0 && (
              <div className="pt-4 border-t-2 border-dashed border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-hand text-2xl font-bold text-purple-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" /> Más recuerdos de esta salida ({extraPhotos.length})
                  </span>
                  <span className="text-xs font-sketch text-slate-500">
                    Toca cualquier polaroid para ver su reverso o ampliarla
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                  {extraPhotos.map((photo: any, pIdx: number) => (
                    <PolaroidCard
                      key={photo.id}
                      photo={photo}
                      idx={pIdx + 2}
                      isFlipped={!!flippedPolaroids[photo.id]}
                      gerberaColor={memory.gerbera_color}
                      onToggleFlip={togglePolaroidFlip}
                      onZoom={setZoomedPhoto}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pie de la página del álbum */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-6 border-t-2 border-dashed border-purple-300">
            <button
              type="button"
              onClick={() => setEditingMemory(memory)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-900 hover:text-teal-950 bg-teal-100/90 hover:bg-teal-200 px-3.5 py-1.5 rounded-xl border border-teal-400 font-sketch cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Agregar más fotos o editar textos
            </button>
            <button
              type="button"
              onClick={() => setSelectedMemory(memory)}
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-purple-950 underline font-sketch cursor-pointer"
            >
              <span>Ver en ventana individual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mt-5 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/95 border-2 border-purple-800 sketch-box px-4 py-3.5 shadow-sm pencil-shade-mixed">
        <div>
          <h2 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950 flex items-center gap-2">
            <span>Bitácora de Recuerdos</span>
            <GerberaFlower size={30} variant="purple" />
          </h2>
          <p className="font-sketch text-sm sm:text-base text-slate-700">
            Nuestro álbum con fotos polaroid, anécdotas, notas secretas reveladas y frases divertidas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 p-1 rounded-xl border border-teal-400 shrink-0">
          <button
            onClick={() => setBitacoraMode('completa')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              bitacoraMode === 'completa' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Todo Desplegado ({filteredMemories.length})
          </button>
          <button
            onClick={() => setBitacoraMode('libro')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                Las mejores historias de amor se escriben un momento a la vez. Este cuaderno digital de {user1Alias} y {user2Alias} está listo para ser inaugurado con su primera salida.
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
                  Aquí se revelará su primera foto con los detalles de ese día
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
            <button
              onClick={() => handleTurnPage('prev')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-900 border-2 border-purple-800 sketch-pill font-sketch text-sm sm:text-base shadow-[2px_2px_0px_0px_#581C87] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <div className="flex items-center gap-2">
              <GerberaFlower size={24} variant="purple" />
              <span className="font-hand text-xl sm:text-2xl font-bold text-purple-950">
                Cita {currentPageIndex + 1} de {filteredMemories.length}
              </span>
              <GerberaFlower size={24} variant="teal" />
            </div>
            <button
              onClick={() => handleTurnPage('next')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-900 border-2 border-teal-800 sketch-pill font-sketch text-sm sm:text-base shadow-[2px_2px_0px_0px_#115E59] cursor-pointer"
            >
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
