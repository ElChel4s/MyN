import React, { useMemo } from 'react';
import { Search, Calendar, MapPin, Quote, Eye, Edit3 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { GerberaFlower } from '../ui/GerberaFlower';
import { WashiTape } from '../ui/WashiTape';

export const TabHistory = () => {
  const { memories, searchQuery, setSearchQuery, setSelectedMemory, setEditingMemory } = useAppContext();

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

  return (
    <section className="mt-5 space-y-6 animate-fadeIn">
      <div className="bg-white/95 border-2 border-purple-900 sketch-box p-4 sm:p-5 shadow-sm pencil-shade-purple">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950 flex items-center gap-2">
              <span>Historial de Citas</span>
              <GerberaFlower size={32} variant="purple" />
            </h2>
            <p className="font-sketch text-base sm:text-lg text-slate-700">
              Todas nuestras citas registradas con sus fotos, textos y frases. Toca cualquiera para verla a detalle.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cita, lugar o frase..."
              className="w-full pl-9 pr-4 py-2 bg-white border-2 border-purple-400 rounded-xl font-sketch text-base focus:outline-none focus:border-purple-700"
            />
          </div>
        </div>
      </div>

      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMemories.map((mem, index) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemory(mem)}
              className="cursor-pointer bg-white/95 border-2 border-purple-900 sketch-box p-4 sm:p-5 shadow-[5px_5px_0px_0px_rgba(20,184,166,0.3)] hover:-translate-y-1 transition-all pencil-shade-mixed relative group"
            >
              <div className="absolute -top-3 left-8">
                <WashiTape color={index % 2 === 0 ? 'purple' : 'teal'} rotate="-2deg" />
              </div>

              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-teal-100 text-teal-900 border border-teal-500 sketch-pill">
                    <Calendar className="w-3 h-3" /> {mem.scheduled_date}
                  </span>
                  <h3 className="font-hand text-2xl sm:text-3xl font-bold text-purple-950 mt-1.5 group-hover:text-purple-700 transition-colors">
                    {mem.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {mem.location_name}
                  </p>
                </div>
                <div className="shrink-0 border-2 border-double border-purple-700 px-2.5 py-1 rounded-xl rotate-3 bg-purple-50 text-center">
                  <p className="font-sketch text-xs font-bold text-purple-900">{mem.stamp_code}</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center my-3">
                <div className="col-span-5 flex -space-x-3 overflow-hidden py-1 pl-1">
                  {mem.photos.map((photo, pIdx) => (
                    <div key={photo.id} style={{ transform: `rotate(${pIdx % 2 === 0 ? '-3deg' : '4deg'})` }} className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-1.5 pb-3 border-2 border-slate-800 shadow-md shrink-0">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="col-span-7 bg-white/90 p-3 rounded-xl border border-dashed border-purple-400">
                  <p className="text-[10px] font-bold uppercase text-purple-700 flex items-center gap-1">
                    <Quote className="w-3 h-3" /> Frase de la cita
                  </p>
                  <p className="font-hand text-lg sm:text-xl text-purple-950 line-clamp-3 mt-0.5">{mem.random_quote}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-teal-400 flex items-center justify-between">
                <span className="text-xs font-sketch text-slate-600">{mem.photos.length} polaroids • Notas y dedicatorias</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMemory(mem);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-100/80 hover:bg-teal-200 px-2.5 py-1 rounded-lg border border-teal-300 transition-all cursor-pointer"
                    title="Editar recuerdos o fotos de esta cita"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 group-hover:translate-x-1 transition-transform cursor-pointer">
                    <Eye className="w-3.5 h-3.5" /> Ver cita completa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white/95 border-2 border-purple-900 sketch-box p-8 sm:p-12 text-center pencil-shade-mixed shadow-sm">
          <GerberaFlower size={56} variant="mixed" spin className="mx-auto mb-4" />
          <h3 className="font-hand text-3xl sm:text-4xl font-bold text-purple-950">
            Aquí se guardará su historia cita a cita
          </h3>
          <p className="font-sketch text-base sm:text-lg text-slate-700 max-w-md mx-auto mt-2">
            Aún no hay citas selladas. Cada vez que salgan y guarden un recuerdo, quedará registrado con su número oficial (ej. CITA #001), fecha, lugar y las fotos de ese día.
          </p>
        </div>
      ) : (
        <div className="bg-white/95 border-2 border-slate-300 rounded-2xl p-8 text-center">
          <p className="font-sketch text-lg text-slate-600">
            No se encontraron citas que coincidan con «{searchQuery}».
          </p>
        </div>
      )}
    </section>
  );
};
