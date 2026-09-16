import { useState, type FormEvent } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Habit } from '../types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completed' | 'streak'>) => void;
}

const AVAILABLE_ICONS = ['🧘', '📖', '💧', '⚡', '💳', '🏃', '🥗', '🧠', '🎯', '💤', '📝', '🥑'];

export function AddHabitModal({ isOpen, onClose, onAddHabit }: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⚡');
  const [category, setCategory] = useState<'mind' | 'health' | 'finance' | 'productivity'>('health');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddHabit({
      title: title.trim(),
      subtitle: subtitle.trim() || 'Hábito diario',
      icon: selectedIcon,
      category,
      timeBlock: 'morning'
    });

    setTitle('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0f1422] border border-[#1f2942] rounded-3xl p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2942]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Nuevo Hábito</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre del hábito
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Respiración Wim Hof, Gimnasio..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#141a2c] border border-[#1f2942] focus:border-cyan-400 text-white rounded-xl px-3 py-2 text-xs outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Métrica o frecuencia
            </label>
            <input
              type="text"
              placeholder="Ej. 15 minutos, 2 veces al día..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#141a2c] border border-[#1f2942] focus:border-cyan-400 text-white rounded-xl px-3 py-2 text-xs outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'health', label: 'Cuerpo & Salud' },
                { id: 'mind', label: 'Mente & Lectura' },
                { id: 'finance', label: 'Finanzas & Riqueza' },
                { id: 'productivity', label: 'Enfoque & Trabajo' }
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as typeof category)}
                  className={`text-[11px] p-2 rounded-xl border text-left transition cursor-pointer ${
                    category === cat.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-[#141a2c] border-[#1f2942] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Elige un icono
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition cursor-pointer ${
                    selectedIcon === icon
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 ring-2 ring-cyan-300'
                      : 'bg-[#141a2c] border border-[#1f2942] hover:border-slate-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Hábito</span>
          </button>
        </form>
      </div>
    </div>
  );
}
