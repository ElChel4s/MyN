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
  PenTool,
  Heart,
  Quote,
  Camera
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { WashiTape } from '../ui/WashiTape';
import { PolaroidCard } from '../ui/PolaroidCard';
import { DateMemory, DatePhoto } from '../../lib/types';

// ---------------------------------------------------------------------------
// Papel de cuaderno: renglones + línea de margen (izquierda o derecha)
// ---------------------------------------------------------------------------
const paperStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  backgroundColor: '#FDFBF4',
  backgroundImage: [
    `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, transparent 30px, rgba(236,72,153,0.28) 30px, rgba(236,72,153,0.28) 32px, transparent 32px)`,
    'repeating-linear-gradient(180deg, transparent 0px, transparent 31px, rgba(124,58,237,0.11) 31px, rgba(124,58,237,0.11) 32px)'
  ].join(', ')
});

type NoteSpec = {
  key: string;
  kind: 'liked' | 'letter';
  tone: 'teal' | 'purple';
  label: string;
  text: string;
};

type Row =
  | { type: 'pair'; photo: DatePhoto; photoIdx: number; note: NoteSpec; flip: boolean }
  | { type: 'photos'; photos: { photo: DatePhoto; idx: number }[] }
  | { type: 'photoQuote'; photo: DatePhoto; photoIdx: number; quote: string }
  | { type: 'notes'; notes: NoteSpec[] }
  | { type: 'quote'; quote: string };

const rowWeight = (r: Row) => {
  if (r.type === 'pair' || r.type === 'photos' || r.type === 'photoQuote') return 3;
  if (r.type === 'notes') return r.notes.length > 1 ? 2 : 1.4;
  return 1.2;
};

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
    }, 250);
  };

  const togglePolaroidFlip = (photoId: string) => {
    setFlippedPolaroids((prev) => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  // -------------------------------------------------------------------------
  // Piezas visuales
  // -------------------------------------------------------------------------
  const renderPolaroid = (memory: DateMemory, photo: DatePhoto, idx: number) => (
    <PolaroidCard
      photo={photo}
      idx={idx}
      isFlipped={!!flippedPolaroids[photo.id]}
      gerberaColor={memory.gerbera_color}
      onToggleFlip={togglePolaroidFlip}
      onZoom={setZoomedPhoto}
    />
  );

  const renderNote = (note: NoteSpec, rotate: number) => {
    const isTeal = note.tone === 'teal';
    const isLetter = note.kind === 'letter';
    return (
      <div
        key={note.key}
        className={`relative w-full rounded-xl p-3.5 sm:p-4 transition-transform hover:scale-[1.015] ${
          isLetter
            ? `bg-white border-2 border-dashed ${isTeal ? 'border-teal-500' : 'border-purple-500'}`
            : `border-2 ${isTeal ? 'bg-[#E9F8F4] border-teal-700' : 'bg-[#F5ECFB] border-purple-700'}`
        } shadow-[3px_4px_0px_0px_rgba(88,28,135,0.16)]`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none scale-75">
          <WashiTape color={isTeal ? 'teal' : 'purple'} rotate={rotate > 0 ? '-3deg' : '3deg'} />
        </div>
        <div
          className={`flex items-center gap-1.5 text-[11px] font-bold font-sketch mb-1 ${
            isTeal ? 'text-teal-900' : 'text-purple-900'
          }`}
        >
          {isLetter ? (
            <Heart className={`w-3.5 h-3.5 ${isTeal ? 'text-teal-600 fill-teal-200' : 'text-purple-600 fill-purple-200'}`} />
          ) : (
            <PenTool className={`w-3 h-3 ${isTeal ? 'text-teal-700' : 'text-purple-700'}`} />
          )}
          <span>{note.label}</span>
        </div>
        <p className={`font-sketch text-[15px] sm:text-base text-slate-800 leading-snug ${isLetter ? 'italic' : ''}`}>
          “{note.text}”
        </p>
      </div>
    );
  };

  const renderQuote = (quote: string, compact = false) => (
    <div
      className={`relative w-full bg-gradient-to-r from-amber-50 via-yellow-100 to-amber-50 border-2 border-purple-900 rounded-xl ${
        compact ? 'p-3' : 'p-4'
      } shadow-[3px_3px_0px_0px_#581C87] text-center`}
      style={{ transform: 'rotate(-1deg)' }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center justify-center gap-1 font-sketch">
        <Quote className="w-3.5 h-3.5 text-purple-700" /> Frase random de la cita
      </p>
      <p className={`font-hand ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} text-purple-950 font-bold leading-snug mt-0.5`}>
        “{quote}”
      </p>
    </div>
  );

  const renderRow = (memory: DateMemory, row: Row, key: string, rIdx: number) => {
    const tilt = rIdx % 2 === 0 ? 1.5 : -1.5;

    if (row.type === 'pair') {
      return (
        <div key={key} className={`flex items-center gap-3 sm:gap-4 ${row.flip ? 'flex-row-reverse' : ''}`}>
          <div className="w-[46%] shrink-0">{renderPolaroid(memory, row.photo, row.photoIdx)}</div>
          <div className="flex-1 min-w-0">{renderNote(row.note, tilt)}</div>
        </div>
      );
    }

    if (row.type === 'photos') {
      return (
        <div key={key} className="flex items-center justify-center gap-3 sm:gap-4">
          {row.photos.map(({ photo, idx }) => (
            <div key={photo.id} className="w-[47%]">
              {renderPolaroid(memory, photo, idx)}
            </div>
          ))}
        </div>
      );
    }

    if (row.type === 'photoQuote') {
      return (
        <div key={key} className="flex items-center gap-3 sm:gap-4">
          <div className="w-[46%] shrink-0">{renderPolaroid(memory, row.photo, row.photoIdx)}</div>
          <div className="flex-1 min-w-0">{renderQuote(row.quote, true)}</div>
        </div>
      );
    }

    if (row.type === 'notes') {
      return (
        <div key={key} className={`grid gap-3 sm:gap-4 ${row.notes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {row.notes.map((n, i) => renderNote(n, i % 2 === 0 ? -tilt : tilt))}
        </div>
      );
    }

    return <div key={key}>{renderQuote(row.quote)}</div>;
  };

  // -------------------------------------------------------------------------
  // Arma las filas sin huecos: cada foto va acompañada de una nota al lado
  // -------------------------------------------------------------------------
  const buildRows = (memory: DateMemory): Row[] => {
    const photos = memory.photos || [];
    const notes: NoteSpec[] = [
      { key: 'p1l', kind: 'liked', tone: 'teal', label: `Lo que más le gustó a ${user1Alias}`, text: memory.person1_liked },
      { key: 'p2n', kind: 'letter', tone: 'purple', label: `💌 De ${user2Alias} para ${user1Alias}`, text: memory.person2_nice_note },
      { key: 'p2l', kind: 'liked', tone: 'purple', label: `Lo que más le gustó a ${user2Alias}`, text: memory.person2_liked },
      { key: 'p1n', kind: 'letter', tone: 'teal', label: `💌 De ${user1Alias} para ${user2Alias}`, text: memory.person1_nice_note }
    ].filter((n) => n.text && n.text.trim()) as NoteSpec[];

    let quote = memory.random_quote?.trim() || '';
    const rows: Row[] = [];
    let pi = 0;
    let ni = 0;

    while (pi < photos.length || ni < notes.length) {
      if (pi < photos.length && ni < notes.length) {
        rows.push({ type: 'pair', photo: photos[pi], photoIdx: pi, note: notes[ni], flip: rows.length % 2 === 1 });
        pi++;
        ni++;
      } else if (pi < photos.length) {
        if (pi + 1 < photos.length) {
          rows.push({ type: 'photos', photos: [{ photo: photos[pi], idx: pi }, { photo: photos[pi + 1], idx: pi + 1 }] });
          pi += 2;
        } else if (quote) {
          rows.push({ type: 'photoQuote', photo: photos[pi], photoIdx: pi, quote });
          quote = '';
          pi++;
        } else {
          rows.push({ type: 'photos', photos: [{ photo: photos[pi], idx: pi }] });
          pi++;
        }
      } else {
        const remaining = notes.slice(ni, ni + 2);
        rows.push({ type: 'notes', notes: remaining });
        ni += remaining.length;
      }
    }

    if (quote) rows.push({ type: 'quote', quote });
    return rows;
  };

  // Reparte las filas entre la página izquierda y derecha equilibrando la altura
  const splitPages = (rows: Row[]) => {
    const headerWeight = 1.6;
    const total = rows.reduce((s, r) => s + rowWeight(r), 0) + headerWeight;
    const left: Row[] = [];
    const right: Row[] = [];
    let acc = headerWeight;
    rows.forEach((r) => {
      const w = rowWeight(r);
      if (right.length === 0 && (left.length === 0 || acc + w / 2 <= total / 2)) {
        left.push(r);
        acc += w;
      } else {
        right.push(r);
      }
    });
    // Nunca dejar la página derecha vacía si hay más de una fila
    if (right.length === 0 && left.length > 1) right.push(left.pop()!);
    return { left, right };
  };

  // -------------------------------------------------------------------------
  // Cuaderno abierto (dos páginas con espiral)
  // -------------------------------------------------------------------------
  const renderNotebookSpread = (memory: DateMemory, index: number) => {
    const rows = buildRows(memory);
    const { left, right } = splitPages(rows);
    const pageNum = index * 2 + 1;

    return (
      <article key={memory.id} className="relative mb-12">
        {/* Hojas apiladas detrás (efecto grosor del cuaderno) */}
        <div className="absolute inset-x-4 -bottom-2 h-full rounded-[26px] bg-[#E9E2D2] border-2 border-purple-950/40" />
        <div className="absolute inset-x-2 -bottom-1 h-full rounded-[28px] bg-[#F2ECDF] border-2 border-purple-950/40" />

        {/* Tapa del cuaderno */}
        <div className="relative bg-gradient-to-br from-purple-800 via-purple-950 to-teal-950 p-2 sm:p-3 rounded-[28px] shadow-2xl border-4 border-purple-950">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-[20px] overflow-hidden border-2 border-purple-950/60">
            {/* Espiral central (escritorio) */}
            <div className="hidden lg:flex flex-col justify-evenly items-center absolute inset-y-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="relative w-10 h-4">
                  <div className="absolute inset-0 rounded-full border-[3px] border-slate-500 bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 shadow-[0_2px_2px_rgba(0,0,0,0.35)]" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-950/70" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-950/70" />
                </div>
              ))}
            </div>

            {/* PÁGINA IZQUIERDA */}
            <section
              className="relative flex flex-col pl-11 pr-4 sm:pr-8 lg:pr-10 pt-5 pb-4 sm:pt-6 lg:shadow-[inset_-22px_0_26px_-20px_rgba(60,20,90,0.35)]"
              style={paperStyle('left')}
            >
              {/* Encabezado */}
              <header className="mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-white text-purple-900 border border-purple-300 rounded-full font-sketch">
                        <Calendar className="w-3 h-3 text-purple-600" /> {memory.scheduled_date || 'Fecha especial'}
                      </span>
                      {memory.location_name && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-teal-50 text-teal-900 border border-teal-300 rounded-full font-sketch">
                          <MapPin className="w-3 h-3 text-teal-700" /> {memory.location_name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950 mt-1 leading-tight">
                      {memory.title}
                    </h3>
                  </div>
                  <div className="shrink-0 border-2 border-double border-teal-700 text-teal-900 px-2.5 py-1 rounded-lg rotate-6 bg-teal-50/90 text-center shadow-xs">
                    <p className="text-[8px] font-bold tracking-widest uppercase font-sketch">Sello</p>
                    <p className="font-sketch text-xs font-bold">{memory.stamp_code}</p>
                  </div>
                </div>
              </header>

              <div className="space-y-6 flex-1">
                {left.length === 0 && rows.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <Camera className="w-8 h-8 text-teal-600 mb-2" />
                    <p className="font-hand text-2xl text-purple-950">Página por llenar</p>
                    <p className="font-sketch text-sm text-slate-500">Toca “Editar cita” para agregar fotos y notas.</p>
                  </div>
                )}
                {left.map((r, i) => renderRow(memory, r, `l-${i}`, i))}
              </div>

              <footer className="mt-5 flex items-center justify-between text-slate-400">
                <GerberaFlower size={22} variant={(memory.gerbera_color as any) || 'purple'} />
                <span className="font-hand text-lg">{pageNum}</span>
              </footer>
            </section>

            {/* PÁGINA DERECHA */}
            <section
              className="relative flex flex-col pr-11 pl-4 sm:pl-8 lg:pl-10 pt-5 pb-4 sm:pt-6 border-t-2 border-dashed border-purple-300 lg:border-t-0 lg:shadow-[inset_22px_0_26px_-20px_rgba(60,20,90,0.35)]"
              style={paperStyle('right')}
            >
              <div className="space-y-6 flex-1 pt-1">
                {right.map((r, i) => renderRow(memory, r, `r-${i}`, i + 1))}
                {right.length === 0 && (
                  <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center opacity-80">
                    <GerberaFlower size={56} variant="mixed" withStem />
                    <p className="font-hand text-2xl text-purple-900 mt-2">Continuará…</p>
                  </div>
                )}
              </div>

              <footer className="mt-5 flex items-center justify-between text-slate-400">
                <span className="font-hand text-lg">{pageNum + 1}</span>
                <GerberaFlower size={22} variant="teal" />
              </footer>
            </section>
          </div>

          {/* Acciones del recuerdo (sobre la tapa) */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2.5 pb-0.5">
            <button
              type="button"
              onClick={() => setEditingMemory(memory)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 font-sketch cursor-pointer transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar cita
            </button>
            <button
              type="button"
              onClick={() => setSelectedMemory(memory)}
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-100 hover:text-white underline font-sketch cursor-pointer"
            >
              <span>Ver en ventana individual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
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
            Nuestro cuaderno de citas: fotos, lo que más nos gustó, cartitas reveladas y frases random.
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
        <div className="relative bg-gradient-to-br from-purple-800 via-purple-950 to-teal-950 p-2 sm:p-3 rounded-[28px] shadow-xl border-4 border-purple-950 my-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-[20px] overflow-hidden border-2 border-purple-950/60">
            <div className="p-6 sm:p-10 pl-12 text-center flex flex-col items-center justify-center" style={paperStyle('left')}>
              <GerberaFlower size={60} variant="purple" spin className="mb-3" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                Página 1 • La libreta en blanco
              </span>
              <h3 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950 mt-2">Construyendo nuestros recuerdos</h3>
              <p className="font-sketch text-base sm:text-lg text-slate-700 mt-2 max-w-sm">
                Las mejores historias se escriben un momento a la vez. Este cuaderno de {user1Alias} y {user2Alias} está listo para su primera salida.
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
            <div className="p-6 sm:p-10 pr-12 text-center flex flex-col items-center justify-center" style={paperStyle('right')}>
              <div className="w-52 h-52 border-2 border-dashed border-teal-400 rounded-2xl p-4 flex flex-col items-center justify-center bg-white/80 shadow-inner">
                <Camera className="w-10 h-10 text-teal-600 mb-2" />
                <p className="font-hand text-2xl font-bold text-teal-950">Primera Polaroid</p>
                <p className="font-sketch text-xs text-slate-500 mt-1 max-w-[160px]">Aquí aparecerá su primera foto con su pie de foto</p>
              </div>
              <p className="font-sketch text-base text-teal-900 mt-4 italic">«No recordamos días, recordamos momentos.»</p>
            </div>
          </div>
        </div>
      ) : bitacoraMode === 'completa' ? (
        <div className="pt-2">{filteredMemories.map((memory, index) => renderNotebookSpread(memory, index))}</div>
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
          <div
            className={`transition-all duration-300 origin-left ${
              isPageTurning ? 'opacity-60 [transform:perspective(1200px)_rotateY(-8deg)_scale(0.98)]' : 'opacity-100'
            }`}
          >
            {renderNotebookSpread(currentBookMemory, currentPageIndex)}
          </div>
        </div>
      ) : null}
    </section>
  );
};
