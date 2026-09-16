import { useState, useEffect, type FormEvent } from 'react';
import { X, Sparkles, Save, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface EditHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<Habit>) => void;
  onDelete?: (id: string) => void;
}

const AVAILABLE_ICONS = ['🧘', '📖', '💧', '⚡', '💳', '🏃', '🥗', '🧠', '🎯', '💤', '📝', '🥑', '💪', '☀️', '🌙'];

export function EditHabitModal({
  habit,
  isOpen,
  onClose,
  onSave,
  onDelete
}: EditHabitModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'mind' | 'health' | 'finance' | 'productivity'>('health');
  const [timeBlock, setTimeBlock] = useState<'morning' | 'night'>('morning');
  const [selectedIcon, setSelectedIcon] = useState('⚡');
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setSubtitle(habit.subtitle);
      setCategory(habit.category);
      setTimeBlock(habit.timeBlock);
      setSelectedIcon(habit.icon || '⚡');
      setStreak(habit.streak || 1);
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(habit.id, {
      title: title.trim(),
      subtitle: subtitle.trim() || 'Hábito diario',
      category,
      timeBlock,
      icon: selectedIcon,
      streak: Math.max(1, streak)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0a0f1d] border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Editar Hábito</h3>
              <p className="text-[10px] text-cyan-400 font-mono">Modificar configuración diaria</p>
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
              Nombre del hábito
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Meditación profunda"
              className="w-full h-9.5 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>

          {/* Subtítulo / Descripción corta */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Etiqueta o descripción corta
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej. 15 minutos al despertar"
              className="w-full h-9.5 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>

          {/* Bloque horario */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Momento del día
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimeBlock('morning')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  timeBlock === 'morning'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                    : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>☀️ Matutino</span>
              </button>
              <button
                type="button"
                onClick={() => setTimeBlock('night')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  timeBlock === 'night'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🌙 Nocturno</span>
              </button>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'health', label: 'Salud', color: 'emerald' },
                { id: 'mind', label: 'Mente', color: 'cyan' },
                { id: 'finance', label: 'Finanzas', color: 'amber' },
                { id: 'productivity', label: 'Productividad', color: 'purple' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as typeof category)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                    category === c.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-[#070a12] border border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ícono & Racha */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Ícono
              </label>
              <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
                {AVAILABLE_ICONS.slice(0, 7).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition cursor-pointer ${
                      selectedIcon === emoji
                        ? 'bg-cyan-400/30 border border-cyan-300 scale-110'
                        : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-24">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Racha (días)
              </label>
              <input
                type="number"
                min="1"
                max="9999"
                value={streak}
                onChange={(e) => setStreak(parseInt(e.target.value, 10) || 1)}
                className="w-full h-8 px-2 rounded-lg bg-[#070a12] border border-cyan-500/25 text-white text-xs text-center font-bold"
              />
            </div>
          </div>

          {/* Acciones del pie */}
          <div className="pt-2 flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(habit.id);
                  onClose();
                }}
                className="h-10 px-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-400 transition flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Eliminar este hábito"
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
