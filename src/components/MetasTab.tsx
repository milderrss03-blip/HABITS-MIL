import { useState, type FormEvent } from 'react';
import {
  Target,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  Clock,
  Flame,
  DollarSign,
  Activity,
  BookOpen,
  FolderKanban,
  X
} from 'lucide-react';
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
  // Horizon view state: 'monthly' (Mensual), 'annual' (Anual), or 'all' (Todas)
  const [timelineMode, setTimelineMode] = useState<'monthly' | 'annual' | 'all'>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Modal Form State with independent period selection
  const [goalPeriod, setGoalPeriod] = useState<'mensual' | 'anual'>('mensual');
  const [goalType, setGoalType] = useState<'fin' | 'fit' | 'mind' | 'custom'>('fin');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalUnit, setGoalUnit] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // Open modal pre-selecting the current view's period
  const handleOpenAddModal = (presetPeriod?: 'mensual' | 'anual') => {
    if (presetPeriod) {
      setGoalPeriod(presetPeriod);
    } else if (timelineMode === 'annual') {
      setGoalPeriod('anual');
    } else {
      setGoalPeriod('mensual');
    }
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const numTarget = parseFloat(goalTarget.replace(/[^0-9.]/g, '')) || 100;
    const isCurrency = goalTarget.includes('$') || goalType === 'fin';

    const category =
      goalType === 'fin'
        ? 'finance'
        : goalType === 'fit'
        ? 'fitness'
        : goalType === 'mind'
        ? 'mind'
        : 'custom';

    const categoryLabel =
      goalType === 'fin'
        ? 'Finanzas'
        : goalType === 'fit'
        ? 'Salud & Físico'
        : goalType === 'mind'
        ? 'Mental & Estudio'
        : 'Proyecto';

    const color =
      goalType === 'fin'
        ? 'emerald'
        : goalType === 'fit'
        ? 'cyan'
        : goalType === 'mind'
        ? 'indigo'
        : 'amber';

    const defaultTimeline =
      goalDate.trim() ||
      (goalPeriod === 'mensual' ? 'Cierre de Mes' : 'Año en curso');

    onAddNewGoal({
      title: goalTitle.trim(),
      category,
      categoryLabel,
      period: goalPeriod,
      badge: '0%',
      current: 0,
      target: numTarget,
      unit: isCurrency ? '' : goalUnit.trim() || 'u.',
      prefix: isCurrency ? '$' : '',
      color,
      timeline: defaultTimeline
    });

    setGoalTitle('');
    setGoalTarget('');
    setGoalUnit('');
    setGoalDate('');
    setIsModalOpen(false);
  };

  // Separation of goals into Mensuales and Anuales
  const monthlyGoals = goals.filter((g) => (g.period || 'mensual') === 'mensual');
  const annualGoals = goals.filter((g) => g.period === 'anual');

  // Goals to display based on selected tab
  const displayedGoals =
    timelineMode === 'monthly'
      ? monthlyGoals
      : timelineMode === 'annual'
      ? annualGoals
      : goals;

  const financeGoals = displayedGoals.filter((g) => g.category === 'finance');
  const personalGoals = displayedGoals.filter((g) => g.category !== 'finance');

  // Dynamic calculations for the active horizon
  const totalTargetFin = financeGoals.reduce((sum, g) => sum + g.target, 0);
  const totalCurrentFin = financeGoals.reduce((sum, g) => sum + g.current, 0);
  const finPercentage =
    totalTargetFin > 0 ? Math.min(100, Math.round((totalCurrentFin / totalTargetFin) * 100)) : 0;

  const totalPersonal = personalGoals.length;
  const completedPersonal = personalGoals.filter((g) => g.current >= g.target && g.target > 0).length;

  const totalDisplayed = displayedGoals.length;
  const completedDisplayed = displayedGoals.filter((g) => g.current >= g.target && g.target > 0).length;

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Header with Title & Quick Register CTAs */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-white tracking-tight">Registro de Metas</h1>
            <span className="text-[11px] text-slate-400">
              {timelineMode === 'monthly'
                ? `${monthlyGoals.length} metas mensuales activas`
                : timelineMode === 'annual'
                ? `${annualGoals.length} metas anuales activas`
                : `${goals.length} metas registradas en total`}
            </span>
          </div>
        </div>

        {/* Dynamic CTA button according to active tab */}
        <button
          type="button"
          onClick={() => handleOpenAddModal()}
          className="btn-cyan-glow text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>
            {timelineMode === 'monthly'
              ? 'Meta Mensual'
              : timelineMode === 'annual'
              ? 'Meta Anual'
              : 'Nueva Meta'}
          </span>
        </button>
      </div>

      {/* Horizon Selector: Registro Independiente en Mensual y Anual */}
      <div className="w-full p-1 rounded-2xl frosted-pill border border-cyan-500/25 flex items-center shadow-inner gap-1">
        <button
          type="button"
          onClick={() => setTimelineMode('monthly')}
          className={`flex-1 py-2 px-3 rounded-xl text-center text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            timelineMode === 'monthly'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.01]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Metas Mensuales</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              timelineMode === 'monthly' ? 'bg-black text-cyan-300' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {monthlyGoals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTimelineMode('annual')}
          className={`flex-1 py-2 px-3 rounded-xl text-center text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            timelineMode === 'annual'
              ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-[0_0_18px_rgba(251,191,36,0.6)] font-extrabold scale-[1.01]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Metas Anuales</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              timelineMode === 'annual' ? 'bg-black text-amber-300' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {annualGoals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTimelineMode('all')}
          className={`py-2 px-3 rounded-xl text-center text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
            timelineMode === 'all'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Ver todas las metas consolidada"
        >
          <span>Todas</span>
          <span className="text-[10px] opacity-70">({goals.length})</span>
        </button>
      </div>

      {/* Metrics Summary Cards (Calculated Specifically for the Active Horizon) */}
      <div className="grid grid-cols-1 gap-3">
        {/* Financial Metric Card */}
        <div className="relative overflow-hidden frosted-card border border-cyan-500/25 rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {timelineMode === 'monthly'
                    ? 'Ahorro & Finanzas del Mes'
                    : timelineMode === 'annual'
                    ? 'Patrimonio & Finanzas Anuales'
                    : 'Ahorro & Finanzas Global'}
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
                  {timelineMode === 'monthly'
                    ? 'Cumplimiento Personal Mensual'
                    : timelineMode === 'annual'
                    ? 'Grandes Retos Personales del Año'
                    : 'Metas Personales & Físicas'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[20px] font-extrabold text-white tracking-tight">
                  {completedPersonal} de {totalPersonal}
                </span>
                <span className="text-[12px] text-cyan-300 font-bold">
                  {totalPersonal === 0
                    ? 'sin registrar'
                    : completedPersonal === totalPersonal
                    ? '¡100% alcanzadas!'
                    : `${totalPersonal - completedPersonal} activas`}
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

      {/* Main Goals Section or Tailored Empty State */}
      {displayedGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-7 rounded-2xl frosted-card border border-cyan-500/20 text-center my-2 space-y-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              timelineMode === 'annual'
                ? 'bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                : 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            {timelineMode === 'annual' ? (
              <CalendarDays className="w-6 h-6" />
            ) : (
              <Calendar className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-[15px] font-bold text-white">
              {timelineMode === 'monthly'
                ? 'Sin metas mensuales registradas'
                : timelineMode === 'annual'
                ? 'Sin metas anuales registradas'
                : 'No tienes metas registradas'}
            </p>
            <p className="text-[12px] text-slate-400 mt-1 max-w-[300px]">
              {timelineMode === 'monthly'
                ? 'Establece objetivos concretos para este mes (ahorro mensual, libros del mes, entrenamientos).'
                : timelineMode === 'annual'
                ? 'Registra tus grandes hitos para este año (patrimonio anual, proyectos macro, adquisiciones).'
                : 'Registra tus objetivos mensuales y anuales de forma totalmente independiente.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenAddModal(timelineMode === 'annual' ? 'anual' : 'mensual')}
            className={`px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition ${
              timelineMode === 'annual'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : 'btn-cyan-glow'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>
              {timelineMode === 'annual'
                ? '+ Registrar Primera Meta Anual'
                : '+ Registrar Primera Meta Mensual'}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Section: Metas Financieras */}
          {financeGoals.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <h2 className="text-[15px] font-bold text-white tracking-tight">
                    {timelineMode === 'monthly'
                      ? 'Metas Financieras del Mes'
                      : timelineMode === 'annual'
                      ? 'Metas Financieras Anuales'
                      : 'Metas Financieras'}
                  </h2>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                  {financeGoals.length} Activas
                </span>
              </div>

              {financeGoals.map((goal) => {
                const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                const isFinished = goal.current >= goal.target && goal.target > 0;
                const isAnnual = goal.period === 'anual';

                return (
                  <div
                    key={goal.id}
                    className="frosted-card border border-cyan-500/20 hover:border-cyan-400/40 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Horizon Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold flex items-center gap-1 border ${
                              isAnnual
                                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                                : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                            }`}
                          >
                            {isAnnual ? (
                              <>
                                <CalendarDays className="w-2.5 h-2.5" />
                                <span>ANUAL</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-2.5 h-2.5" />
                                <span>MENSUAL</span>
                              </>
                            )}
                          </span>

                          <h3 className="text-[15px] font-bold text-white tracking-tight truncate">
                            {goal.title}
                          </h3>

                          {isFinished && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Lograda
                            </span>
                          )}
                        </div>

                        {goal.timeline && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
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

          {/* Section: Metas Personales & Salud */}
          {personalGoals.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  <h2 className="text-[15px] font-bold text-white tracking-tight">
                    {timelineMode === 'monthly'
                      ? 'Metas Personales del Mes'
                      : timelineMode === 'annual'
                      ? 'Grandes Metas Personales del Año'
                      : 'Metas Personales & Físicas'}
                  </h2>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">
                  {personalGoals.length} Activas
                </span>
              </div>

              {personalGoals.map((goal) => {
                const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                const isFinished = goal.current >= goal.target && goal.target > 0;
                const isAnnual = goal.period === 'anual';

                return (
                  <div
                    key={goal.id}
                    className="frosted-card border border-cyan-500/20 hover:border-cyan-400/40 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Horizon Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold flex items-center gap-1 border ${
                              isAnnual
                                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                                : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                            }`}
                          >
                            {isAnnual ? (
                              <>
                                <CalendarDays className="w-2.5 h-2.5" />
                                <span>ANUAL</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-2.5 h-2.5" />
                                <span>MENSUAL</span>
                              </>
                            )}
                          </span>

                          <h3 className="text-[15px] font-bold text-white tracking-tight truncate">
                            {goal.title}
                          </h3>

                          {isFinished && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Lograda
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
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
          onClick={() => handleOpenAddModal()}
          className={`w-full py-3 px-4 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-md ${
            timelineMode === 'annual'
              ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
              : 'btn-cyan-glow'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>
            {timelineMode === 'annual'
              ? '+ Registrar Nueva Meta Anual'
              : '+ Registrar Nueva Meta Mensual'}
          </span>
        </button>
      </div>

      {/* Modal for Registering New Goal with Independent Monthly vs Annual Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
          <div className="w-full max-w-md frosted-card border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-[0_-10px_40px_rgba(6,182,212,0.25)] animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    goalPeriod === 'anual'
                      ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                      : 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                  }`}
                >
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-white tracking-tight">
                    {goalPeriod === 'anual' ? 'Registrar Meta Anual' : 'Registrar Meta Mensual'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {goalPeriod === 'anual'
                      ? 'Horizonte de 12 meses • Objetivos macro'
                      : 'Horizonte de 30 días • Hitos inmediatos'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Independent Period Selection (Mensual vs Anual) */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Horizonte de Registro</span>
                <span className="text-cyan-400 text-[9.5px]">Selección Independiente</span>
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#070a12] border border-cyan-500/25">
                <button
                  type="button"
                  onClick={() => setGoalPeriod('mensual')}
                  className={`py-2.5 px-3 rounded-xl text-left text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
                    goalPeriod === 'mensual'
                      ? 'btn-cyan-glow font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold leading-tight">Meta Mensual</span>
                    <span className="text-[9px] opacity-75">Objetivo de este mes</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGoalPeriod('anual')}
                  className={`py-2.5 px-3 rounded-xl text-left text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
                    goalPeriod === 'anual'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold leading-tight">Meta Anual</span>
                    <span className="text-[9px] opacity-75">Visión del año</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Área de la Meta
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGoalType('fin')}
                  className={`p-2.5 rounded-xl text-left text-[11px] flex flex-col gap-0.5 transition-all cursor-pointer ${
                    goalType === 'fin'
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                      : 'frosted-pill border border-cyan-500/15 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">Finanzas</span>
                  </div>
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
                  <div className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-white">Salud & Físico</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Km / Deporte</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGoalType('mind')}
                  className={`p-2.5 rounded-xl text-left text-[11px] flex flex-col gap-0.5 transition-all cursor-pointer ${
                    goalType === 'mind'
                      ? 'bg-indigo-500/20 border-2 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'frosted-pill border border-cyan-500/15 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-white">Personal</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Lectura / Estudio</span>
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
                  placeholder={
                    goalPeriod === 'anual'
                      ? 'Ej. Facturar $100,000, Correr Maratón 42K o Ahorro $20,000'
                      : 'Ej. Ahorro $800 este mes, Leer 2 libros o Correr 50K'
                  }
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
                    placeholder="Ej. $1,500 o 25"
                    className="w-full h-11 px-3 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400" htmlFor="modal-goal-date">
                    Fecha Límite / Plazo
                  </label>
                  <input
                    id="modal-goal-date"
                    type="text"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    placeholder={goalPeriod === 'anual' ? 'Ej. Dic 2026' : 'Ej. 30 de este mes'}
                    className="w-full h-11 px-3 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl frosted-pill border border-cyan-500/20 text-slate-300 hover:text-white text-[13px] font-bold cursor-pointer transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition shadow-lg ${
                    goalPeriod === 'anual'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                      : 'btn-cyan-glow'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {goalPeriod === 'anual' ? 'Guardar Meta Anual' : 'Guardar Meta Mensual'}
                  </span>
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
