import { useState, useEffect, type FormEvent } from 'react';
import { X, Target, Trash2 } from 'lucide-react';
import { Goal } from '../types';

interface EditGoalModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<Goal>) => void;
  onDelete?: (id: string) => void;
}

export function EditGoalModal({
  goal,
  isOpen,
  onClose,
  onSave,
  onDelete
}: EditGoalModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'finance' | 'fitness' | 'mind' | 'custom'>('finance');
  const [period, setPeriod] = useState<'mensual' | 'anual'>('mensual');
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(100);
  const [unit, setUnit] = useState('');
  const [prefix, setPrefix] = useState('$');
  const [timeline, setTimeline] = useState('');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setCategory(goal.category);
      setPeriod(goal.period || 'mensual');
      setCurrent(goal.current);
      setTarget(goal.target);
      setUnit(goal.unit || '');
      setPrefix(goal.prefix || '');
      setTimeline(goal.timeline || '');
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const numTarget = Number(target) || 1;
    const numCurrent = Number(current) || 0;
    const pct = Math.min(100, Math.round((numCurrent / numTarget) * 100));

    onSave(goal.id, {
      title: title.trim(),
      category,
      categoryLabel:
        category === 'finance'
          ? 'Finanzas'
          : category === 'fitness'
          ? 'Salud & Físico'
          : category === 'mind'
          ? 'Desarrollo'
          : 'Personal',
      period,
      current: numCurrent,
      target: numTarget,
      unit,
      prefix,
      badge: `${pct}%`,
      timeline: timeline.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0a0f1d] border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Editar Meta</h3>
              <span className="text-[11px] text-slate-400">Ajusta valores y progreso</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-3 flex flex-col">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Título de la Meta</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Period Selector (Mensual vs Anual) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Horizonte de la Meta</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#070a12] border border-cyan-500/20">
              <button
                type="button"
                onClick={() => setPeriod('mensual')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  period === 'mensual'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📅 Meta Mensual</span>
              </button>
              <button
                type="button"
                onClick={() => setPeriod('anual')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  period === 'anual'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎯 Meta Anual</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="finance">Finanzas / Ahorro</option>
              <option value="fitness">Salud & Físico</option>
              <option value="mind">Desarrollo Mental & Lectura</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Progreso Actual</label>
              <input
                type="number"
                step="any"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Meta Objetivo</label>
              <input
                type="number"
                step="any"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Símbolo Prefijo</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Ej. $"
                className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Unidad Sufijo</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Ej. km, libros, u."
                className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Fecha Límite / Plazo</label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="Ej. Diciembre 2026"
              className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-3 py-2 text-white text-[13px] font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(goal.id);
                  onClose();
                }}
                className="p-2.5 rounded-xl frosted-pill border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-500/20 cursor-pointer transition"
                title="Eliminar meta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl frosted-pill border border-cyan-500/20 text-slate-300 hover:text-white text-[12px] font-bold cursor-pointer transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl btn-cyan-glow text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
