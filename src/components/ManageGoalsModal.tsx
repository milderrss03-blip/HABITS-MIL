import { useState, type FormEvent } from 'react';
import { X, Plus, DollarSign, Activity } from 'lucide-react';
import { Goal } from '../types';

interface ManageGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onUpdateGoalProgress: (id: string, increment: number) => void;
  onAddNewGoal: (goal: Omit<Goal, 'id'>) => void;
}

export function ManageGoalsModal({
  isOpen,
  onClose,
  goals,
  onUpdateGoalProgress,
  onAddNewGoal
}: ManageGoalsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'finance' | 'fitness'>('finance');
  const [newCurrent, setNewCurrent] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;

    const isFinance = newCategory === 'finance';
    onAddNewGoal({
      title: newTitle,
      category: newCategory,
      categoryLabel: isFinance ? 'FINANZAS' : 'FÍSICO',
      badge: isFinance ? '+$10 hoy' : 'Activa',
      current: parseFloat(newCurrent) || 0,
      target: parseFloat(newTarget),
      unit: newUnit || (isFinance ? '' : 'km'),
      prefix: isFinance ? '$' : '',
      color: isFinance ? 'emerald' : 'cyan'
    });

    setNewTitle('');
    setNewCurrent('');
    setNewTarget('');
    setNewUnit('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f1422] border border-[#1f2942] rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2942]">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-white">Gestionar Metas</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Goals Quick Progress */}
        <div className="mt-4 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Progreso Rápido</div>
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isFinance = goal.category === 'finance';
            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-2xl bg-[#141a2c] border border-[#1f2942] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      goal.color === 'emerald'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-indigo-500/15 text-indigo-400'
                    }`}>
                      {goal.categoryLabel}
                    </span>
                    <div className="text-xs font-semibold text-white mt-1">{goal.title}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-sm text-cyan-300">
                      {goal.prefix}{goal.current.toLocaleString()} {goal.unit}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {' '}/ {goal.prefix}{goal.target.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#070a12] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      goal.color === 'emerald' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Quick Add Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">Añadir avance:</span>
                  {isFinance ? (
                    <>
                      <button
                        onClick={() => onUpdateGoalProgress(goal.id, 25)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition cursor-pointer font-mono"
                      >
                        +$25
                      </button>
                      <button
                        onClick={() => onUpdateGoalProgress(goal.id, 100)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition cursor-pointer font-mono"
                      >
                        +$100
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onUpdateGoalProgress(goal.id, 1)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition cursor-pointer font-mono"
                      >
                        +1 km
                      </button>
                      <button
                        onClick={() => onUpdateGoalProgress(goal.id, 5)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition cursor-pointer font-mono"
                      >
                        +5 km
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle New Goal Form */}
        <div className="mt-4 pt-3 border-t border-[#1f2942]">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl bg-[#141a2c] hover:bg-[#1a2238] border border-[#1f2942] text-cyan-400 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nueva Meta</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3 bg-[#141a2c] p-3.5 rounded-2xl border border-[#1f2942]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Nueva Meta</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Título (Ej. Comprar Inmueble, Peso ideal)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0f1422] border border-[#1f2942] focus:border-cyan-400 text-white rounded-xl px-3 py-1.5 text-xs outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewCategory('finance')}
                  className={`flex-1 py-1.5 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    newCategory === 'finance'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                      : 'bg-[#0f1422] border-[#1f2942] text-slate-400'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" /> Finanzas
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory('fitness')}
                  className={`flex-1 py-1.5 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    newCategory === 'fitness'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-[#0f1422] border-[#1f2942] text-slate-400'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" /> Físico
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Actual"
                  value={newCurrent}
                  onChange={(e) => setNewCurrent(e.target.value)}
                  className="w-full bg-[#0f1422] border border-[#1f2942] text-white rounded-xl px-2.5 py-1.5 text-xs outline-none"
                />
                <input
                  type="number"
                  required
                  placeholder="Objetivo"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-[#0f1422] border border-[#1f2942] text-white rounded-xl px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Guardar Meta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
