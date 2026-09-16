import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckSquare, Save, Trash2, Clock, Tag } from 'lucide-react';
import { DailyTask } from '../types';

interface EditTaskModalProps {
  task: DailyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<DailyTask>) => void;
  onDelete?: (id: string) => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete
}: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'urgente' | 'normal'>('normal');
  const [category, setCategory] = useState<'trabajo' | 'finanzas' | 'personal'>('trabajo');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setTime(task.time || '');
      setPriority(task.priority);
      setCategory(task.category);
      setTag(task.tag || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(task.id, {
      title: title.trim(),
      time: time.trim() ? time.trim() : undefined,
      priority,
      category,
      tag: tag.trim() ? tag.trim() : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0a0f1d] border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Editar Tarea</h3>
              <p className="text-[10px] text-cyan-400 font-mono">Actualizar pendiente o entrega</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Título */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Descripción de la tarea
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Revisar estados financieros"
              className="w-full h-9.5 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Nivel de prioridad
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'normal'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Normal</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('urgente')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'urgente'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🔥 Urgente</span>
              </button>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'trabajo', label: 'Trabajo' },
                { id: 'finanzas', label: 'Finanzas' },
                { id: 'personal', label: 'Personal' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as typeof category)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition capitalize cursor-pointer ${
                    category === cat.id
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50'
                      : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Horario & Etiqueta */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Hora límite</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ej. 16:30 hrs"
                className="w-full h-9 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Etiqueta</span>
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Ej. +$5K o Clave"
                className="w-full h-9 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-2 flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                className="h-10 px-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-400 transition flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Eliminar esta tarea"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            )}

            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
