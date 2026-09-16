import { useState, type FormEvent } from 'react';
import { Target, Plus, Pencil, Trash2, Calendar, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Goal } from '../types';
import { EditGoalModal } from './EditGoalModal';

interface MetasTabProps {
  goals: Goal[];
  onAddNewGoal: (newGoal: Omit<Goal, 'id'>) => void;
  onQuickProgress: (id: string, amount: number) => void;
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goal: Goal) => void;
}

export function MetasTab({
  goals,
  onAddNewGoal,
  onQuickProgress,
  onEditGoal,
  onDeleteGoal
}: MetasTabProps) {
  const [timelineMode, setTimelineMode] = useState<'all' | 'monthly' | 'annual'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Modal Form State
  const [goalType, setGoalType] = useState<'fin' | 'per' | 'fit'>('fin');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const handleSaveGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const numTarget = parseFloat(goalTarget.replace(/[^0-9.]/g, '')) || 100;
    const isCurrency = goalTarget.includes('$') || goalType === 'fin';

    onAddNewGoal({
      title: goalTitle.trim(),
      category: goalType === 'fin' ? 'finance' : goalType === 'fit' ? 'fitness' : 'mind',
      categoryLabel:
        goalType === 'fin'
          ? 'Finanzas'
          : goalType === 'fit'
          ? 'Salud & Físico'
          : 'Personal',
      badge: '0%',
      current: 0,
      target: numTarget,
      unit: isCurrency ? '' : 'u.',
      prefix: isCurrency ? '$' : '',
      color: goalType === 'fin' ? 'emerald' : goalType === 'fit' ? 'cyan' : 'indigo',
      timeline: goalDate.trim() || undefined
    });

    setGoalTitle('');
    setGoalTarget('');
    setGoalDate('');
    setIsModalOpen(false);
  };

  const financeGoals = goals.filter((g) => g.category === 'finance');
  const personalGoals = goals.filter((g) => g.category !== 'finance');

  // Dynamic calculations
  const totalTargetFin = financeGoals.reduce((sum, g) => sum + g.target, 0);
  const totalCurrentFin = financeGoals.reduce((sum, g) => sum + g.current, 0);
  const finPercentage = totalTargetFin > 0 ? Math.min(100, Math.round((totalCurrentFin / totalTargetFin) * 100)) : 0;

  const totalPersonal = personalGoals.length;
  const completedPersonal = personalGoals.filter((g) => g.current >= g.target && g.target > 0).length;

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Header with "+ Nueva Meta" CTA */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-white tracking-tight">Metas & Objetivos</h1>
            <span className="text-[11px] text-slate-400">
              {goals.length === 0 ? '0 metas activas' : `${goals.length} metas registradas`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-cyan-glow text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Meta</span>
        </button>
      </div>

      {/* Segmented Control Time Switcher */}
      <div className="w-full p-1 rounded-2xl frosted-pill border border-cyan-500/25 flex items-center shadow-inner">
        <button
          type="button"
          onClick={() => setTimelineMode('all')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-center text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            timelineMode === 'all'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Todas ({goals.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTimelineMode('monthly')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-center text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            timelineMode === 'monthly'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Mensuales</span>
        </button>
        <button
          type="button"
          onClick={() => setTimelineMode('annual')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-center text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            timelineMode === 'annual'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Anuales</span>
        </button>
      </div>

      {/* Global Metrics Summary Cards (Real-time calculated) */}
      <div className="grid grid-cols-1 gap-3">
        {/* Financial Metric Card */}
        <div className="relative overflow-hidden frosted-card border border-cyan-500/25 rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ahorro & Finanzas
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-extrabold text-white tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  ${totalCurrentFin.toLocaleString()}
                </span>
                <span className="text-[12px] text-slate-400">
                  / ${totalTargetFin.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                <TrendingUp className="w-3.5 h-3.5" />
                {finPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {financeGoals.length} {financeGoals.length === 1 ? 'meta' : 'metas'}
              </span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-[#090d16] h-2 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.6)]"
              style={{ width: `${finPercentage}%` }}
            />
          </div>
        </div>

        {/* Personal & Fitness Metrics Card */}
        <div className="relative overflow-hidden frosted-card border border-cyan-500/25 rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Metas Personales & Salud
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[20px] font-extrabold text-white tracking-tight">
                  {completedPersonal} de {totalPersonal}
                </span>
                <span className="text-[12px] text-cyan-300 font-bold">
                  {totalPersonal === 0 ? 'por definir' : completedPersonal === totalPersonal ? '¡Todas completadas!' : 'activas'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                <Sparkles className="w-3.5 h-3.5" />
                {totalPersonal > 0 ? `${Math.round((completedPersonal / totalPersonal) * 100)}%` : '0%'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Cumplimiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Goals List or Clean Empty State */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl frosted-card border border-cyan-500/20 text-center my-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Target className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-[15px] font-bold text-white">Tablero de Metas en Cero</p>
          <p className="text-[12px] text-slate-400 mt-1 max-w-[280px]">
            No tienes metas registradas todavía. Define tus objetivos financieros, físicos o personales para comenzar a medir tu avance.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl btn-cyan-glow text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Primera Meta</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Metas Financieras */}
          {financeGoals.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <h2 className="text-[15px] font-bold text-white tracking-tight">Metas Financieras</h2>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                  {financeGoals.length} Activas
                </span>
              </div>

              {financeGoals.map((goal) => {
                const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                const isFinished = goal.current >= goal.target && goal.target > 0;
                return (
                  <div
                    key={goal.id}
                    className="frosted-card border border-cyan-500/20 hover:border-cyan-400/40 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-bold text-white tracking-tight truncate">
                            {goal.title}
                          </h3>
                          {isFinished && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> 100%
                            </span>
                          )}
                        </div>
                        {goal.timeline && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>Plazo: {goal.timeline}</span>
                          </p>
                        )}
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingGoal(goal)}
                          className="w-7 h-7 rounded-lg frosted-pill border border-cyan-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer transition hover:scale-105"
                          title="Editar meta"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteGoal && (
                          <button
                            type="button"
                            onClick={() => onDeleteGoal(goal)}
                            className="w-7 h-7 rounded-lg frosted-pill border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition hover:scale-105"
                            title="Eliminar meta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Values & Bar */}
                    <div>
                      <div className="flex items-baseline justify-between text-[11px] mb-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[16px] text-emerald-400 font-extrabold tracking-tight">
                            {goal.prefix || ''}{goal.current.toLocaleString()}{goal.unit ? ` ${goal.unit}` : ''}
                          </span>
                          <span className="text-slate-400">
                            / {goal.prefix || ''}{goal.target.toLocaleString()}{goal.unit ? ` ${goal.unit}` : ''}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-bold">{pct}%</span>
                      </div>
                      <div className="relative w-full bg-[#090d16] h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Contribution Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 font-medium">Aportar rápido:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onQuickProgress(goal.id, 25)}
                          className="px-2 py-0.5 rounded-lg frosted-pill border border-cyan-500/20 text-cyan-300 hover:text-white text-[10px] font-bold cursor-pointer transition active:scale-95"
                        >
                          +$25
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickProgress(goal.id, 50)}
                          className="px-2 py-0.5 rounded-lg frosted-pill border border-cyan-500/20 text-cyan-300 hover:text-white text-[10px] font-bold cursor-pointer transition active:scale-95"
                        >
                          +$50
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickProgress(goal.id, 100)}
                          className="px-2.5 py-0.5 rounded-lg btn-cyan-glow text-[10px] font-bold cursor-pointer transition active:scale-95"
                        >
                          +$100
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Metas Personales & Salud */}
          {personalGoals.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  <h2 className="text-[15px] font-bold text-white tracking-tight">Metas Personales & Físicas</h2>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">
                  {personalGoals.length} Activas
                </span>
              </div>

              {personalGoals.map((goal) => {
                const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                const isFinished = goal.current >= goal.target && goal.target > 0;
                return (
                  <div
                    key={goal.id}
                    className="frosted-card border border-cyan-500/20 hover:border-cyan-400/40 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-bold text-white tracking-tight truncate">
                            {goal.title}
                          </h3>
                          {isFinished && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Lograda
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{goal.categoryLabel || 'Personal'}</span>
                          {goal.timeline && <span>• Plazo: {goal.timeline}</span>}
                        </p>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingGoal(goal)}
                          className="w-7 h-7 rounded-lg frosted-pill border border-cyan-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer transition hover:scale-105"
                          title="Editar meta"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteGoal && (
                          <button
                            type="button"
                            onClick={() => onDeleteGoal(goal)}
                            className="w-7 h-7 rounded-lg frosted-pill border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition hover:scale-105"
                            title="Eliminar meta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Values & Bar */}
                    <div>
                      <div className="flex items-baseline justify-between text-[11px] mb-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[16px] text-cyan-300 font-extrabold tracking-tight">
                            {goal.prefix || ''}{goal.current.toLocaleString()}{goal.unit ? ` ${goal.unit}` : ''}
                          </span>
                          <span className="text-slate-400">
                            / {goal.prefix || ''}{goal.target.toLocaleString()}{goal.unit ? ` ${goal.unit}` : ''}
                          </span>
                        </div>
                        <span className="text-cyan-300 font-bold">{pct}%</span>
                      </div>
                      <div className="relative w-full bg-[#090d16] h-2.5 rounded-full overflow-hidden p-0.5 border border-cyan-500/20">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Progress Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 font-medium">Sumar avance:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onQuickProgress(goal.id, 1)}
                          className="px-2 py-0.5 rounded-lg frosted-pill border border-cyan-500/20 text-cyan-300 hover:text-white text-[10px] font-bold cursor-pointer transition active:scale-95"
                        >
                          +1 {goal.unit || 'u.'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickProgress(goal.id, 5)}
                          className="px-2.5 py-0.5 rounded-lg btn-cyan-glow text-[10px] font-bold cursor-pointer transition active:scale-95"
                        >
                          +5 {goal.unit || 'u.'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Trigger: Bottom CTA Button */}
      <div className="pt-2 pb-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 px-4 rounded-xl btn-cyan-glow font-bold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agregar Nueva Meta</span>
        </button>
      </div>

      {/* Modal for Creating New Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
          <div className="w-full max-w-md frosted-card border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-[0_-10px_40px_rgba(6,182,212,0.25)] animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-[18px] font-bold text-white tracking-tight">Nueva Meta</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full frosted-pill border border-cyan-500/20 text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tipo de Meta
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGoalType('fin')}
                  className={`p-2.5 rounded-xl text-left text-[11px] flex flex-col gap-0.5 transition-all cursor-pointer ${
                    goalType === 'fin'
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'frosted-pill border border-cyan-500/15 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-white">Financiera</span>
                  <span className="text-[9px] text-slate-400">Ahorro / Inversión</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoalType('fit')}
                  className={`p-2.5 rounded-xl text-left text-[11px] flex flex-col gap-0.5 transition-all cursor-pointer ${
                    goalType === 'fit'
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'frosted-pill border border-cyan-500/15 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-white">Salud & Físico</span>
                  <span className="text-[9px] text-slate-400">Km / Peso / Deporte</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoalType('per')}
                  className={`p-2.5 rounded-xl text-left text-[11px] flex flex-col gap-0.5 transition-all cursor-pointer ${
                    goalType === 'per'
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'frosted-pill border border-cyan-500/15 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-white">Personal</span>
                  <span className="text-[9px] text-slate-400">Libros / Estudio</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveGoal} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400" htmlFor="modal-goal-title">
                  Título de la Meta
                </label>
                <input
                  id="modal-goal-title"
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Ej. Ahorro $10,000, Correr 21K o Leer 15 Libros"
                  className="w-full h-11 px-3 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400" htmlFor="modal-goal-target">
                    Objetivo Cuantitativo
                  </label>
                  <input
                    id="modal-goal-target"
                    type="text"
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="Ej. $5,000 o 21"
                    className="w-full h-11 px-3 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400" htmlFor="modal-goal-date">
                    Fecha Límite
                  </label>
                  <input
                    id="modal-goal-date"
                    type="text"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    placeholder="Ej. Dic 2026"
                    className="w-full h-11 px-3 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl frosted-pill border border-cyan-500/20 text-slate-300 hover:text-white text-[13px] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl btn-cyan-glow font-bold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Meta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && onEditGoal && (
        <EditGoalModal
          goal={editingGoal}
          isOpen={!!editingGoal}
          onClose={() => setEditingGoal(null)}
          onSave={(id, updated) => {
            onEditGoal({ ...editingGoal, ...updated });
            setEditingGoal(null);
          }}
          onDelete={
            onDeleteGoal
              ? (id) => {
                  onDeleteGoal(editingGoal);
                  setEditingGoal(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
