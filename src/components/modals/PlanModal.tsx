import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Link2, Plus, Trash2, Camera, CheckSquare, Square, Play, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const PlanModal = () => {
  const {
    editingWish,
    setEditingWish,
    wishlist,
    showToast,
    startOngoingDateFromPlan,
    savePlan,
    deletePlan
  } = useAppContext();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (editingWish) {
      setFormData({
        ...editingWish,
        references: editingWish.references || [],
        checklist: editingWish.checklist || []
      });
    } else {
      setFormData(null);
    }
  }, [editingWish]);

  if (!editingWish || !formData) return null;

  const isNewPlan = !wishlist.some((w) => w.id === formData.id);

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      showToast('Por favor escribe un título para el plan');
      return;
    }

    setEditingWish(null);
    await savePlan(formData);
  };

  const handleStartPlanNow = async () => {
    if (!formData.title?.trim()) {
      showToast('Por favor escribe un título para el plan');
      return;
    }

    setEditingWish(null);
    await savePlan(formData);
    await startOngoingDateFromPlan(formData);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Quieres eliminar esta idea de planes?')) {
      setEditingWish(null);
      await deletePlan(formData.id);
    }
  };

  const handleAddChecklist = () => {
    setFormData({
      ...formData,
      checklist: [...formData.checklist, { id: `chk-${Date.now()}`, item: '', completed: false }]
    });
  };

  const handleUpdateChecklist = (id: string, value: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map((c: any) => (c.id === id ? { ...c, item: value } : c))
    });
  };

  const handleRemoveChecklist = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter((c: any) => c.id !== id)
    });
  };

  const handleAddReference = () => {
    setFormData({
      ...formData,
      references: [
        ...formData.references,
        { id: `ref-${Date.now()}`, label: 'Google Maps / TikTok / Menú', url: 'https://' }
      ]
    });
  };

  const handleUpdateReference = (id: string, field: 'label' | 'url', value: string) => {
    setFormData({
      ...formData,
      references: formData.references.map((r: any) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    });
  };

  const handleRemoveReference = (id: string) => {
    setFormData({
      ...formData,
      references: formData.references.filter((r: any) => r.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#FCFBF7] border-4 border-purple-900 sketch-box w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl pencil-shade-teal">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-purple-300">
          <div>
            <h2 className="font-hand text-3xl font-bold text-purple-950">
              {isNewPlan ? 'Anotar Nueva Idea' : 'Editar Plan / Idea'}
            </h2>
            <p className="font-sketch text-xs text-purple-800">
              {isNewPlan ? 'Completa todos los detalles para esta salida cuando decidan hacerla' : 'Modifica notas, links o tareas para cuando salgan'}
            </p>
          </div>
          <button onClick={() => setEditingWish(null)} className="p-2 bg-white rounded-full border border-purple-300 text-purple-900 hover:bg-purple-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-purple-900 flex items-center gap-1 mb-1">
              Título del plan / idea *
            </label>
            <input
              type="text"
              placeholder="Ej. Tarde de picnic, Probar hamburguesas nuevas, Tarde de cine..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border-2 border-purple-300 rounded-xl font-hand text-2xl text-purple-950 focus:outline-none focus:border-purple-600"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-teal-900 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> Lugar o zona (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Zona centro, Mirador, Restaurante nuevo..."
                value={formData.location_name || ''}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-teal-300 rounded-lg font-sketch text-base focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-600" /> Fecha tentativa (relajada)
              </label>
              <input
                type="text"
                placeholder="Ej. Algún domingo por la tarde, Fin de semana largo..."
                value={formData.tentative_date || ''}
                onChange={(e) => setFormData({ ...formData, tentative_date: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg font-sketch text-base focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-purple-900 flex items-center gap-1 mb-1">
              Notas libres de preparación
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Abren solo hasta las 8 PM, llevar abrigo porque hace frío, reservar mesa..."
              value={formData.planning_notes || ''}
              onChange={(e) => setFormData({ ...formData, planning_notes: e.target.value })}
              className="w-full px-3 py-2 bg-purple-50/50 border border-purple-300 rounded-xl font-sketch text-base focus:outline-none focus:border-purple-600"
            />
          </div>

          {/* Enlaces y referencias útiles */}
          <div className="bg-white/80 p-3.5 rounded-xl border border-dashed border-teal-300">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-teal-600" /> Enlaces y referencias (Google Maps, TikTok, Reels, etc.)
              </label>
              <button
                type="button"
                onClick={handleAddReference}
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 text-xs font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir enlace
              </button>
            </div>
            {formData.references.length === 0 ? (
              <p className="text-xs font-sketch text-slate-500 italic">No hay enlaces agregados aún. Toca "+ Añadir enlace" para pegar un pin de Maps o video.</p>
            ) : (
              <div className="space-y-2">
                {formData.references.map((ref: any) => (
                  <div key={ref.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-teal-50/40 p-2 rounded-lg border border-teal-200">
                    <input
                      type="text"
                      placeholder="Etiqueta (ej. Ubicación Maps, TikTok reseña)"
                      value={ref.label}
                      onChange={(e) => handleUpdateReference(ref.id, 'label', e.target.value)}
                      className="w-full sm:w-1/3 px-2 py-1 bg-white border border-teal-300 rounded font-sketch text-xs"
                    />
                    <input
                      type="text"
                      placeholder="URL (https://...)"
                      value={ref.url}
                      onChange={(e) => handleUpdateReference(ref.id, 'url', e.target.value)}
                      className="w-full sm:flex-1 px-2 py-1 bg-white border border-teal-300 rounded font-sketch text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveReference(ref.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded self-end sm:self-center cursor-pointer"
                      title="Eliminar enlace"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checklist colaborativo */}
          <div>
            <label className="text-xs font-bold text-teal-900 flex items-center justify-between mb-1">
              <span>Checklist de preparación colaborativo</span>
              <button
                type="button"
                onClick={handleAddChecklist}
                className="text-teal-700 hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir tarea
              </button>
            </label>
            <div className="space-y-2">
              {formData.checklist.map((item: any) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="shrink-0">{item.completed ? <CheckSquare className="w-4 h-4 text-teal-600" /> : <Square className="w-4 h-4 text-slate-400" />}</div>
                  <input
                    type="text"
                    placeholder="Ej. Comprar snacks, cargar cámara..."
                    value={item.item}
                    onChange={(e) => handleUpdateChecklist(item.id, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-teal-200 rounded-lg font-sketch text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-purple-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setEditingWish(null)} className="px-4 py-2 font-sketch text-base text-slate-600 hover:bg-slate-100 rounded-xl text-center cursor-pointer">
              Cancelar
            </button>
            {!isNewPlan && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-3 py-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl font-sketch text-sm cursor-pointer transition-colors"
                title="Eliminar este plan"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar plan
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-purple-50 text-purple-950 font-sketch text-base rounded-xl border-2 border-purple-400 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-purple-700" />
              <span>{isNewPlan ? 'Guardar Idea en Planes' : 'Guardar Cambios'}</span>
            </button>

            <button
              onClick={handleStartPlanNow}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-sketch text-base sketch-pill border-2 border-teal-950 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 text-teal-200 fill-teal-200" /> Empezar / Subir Fotos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
