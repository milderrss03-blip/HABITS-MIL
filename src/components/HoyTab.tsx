import { Habit, Goal, DailyTask } from '../types';
import {
  Flame,
  Target,
  Sun,
  Moon,
  CheckCircle2,
  Check,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';

interface HoyTabProps {
  habits: Habit[];
  goals: Goal[];
  tasks: DailyTask[];
  onToggleHabit: (id: string) => void;
  onToggleTask: (id: string) => void;
  onNavigateToTareas: () => void;
  onNavigateToMetas: () => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habit: Habit) => void;
  onEditTask?: (task: DailyTask) => void;
  onDeleteTask?: (task: DailyTask) => void;
}

export function HoyTab({
  habits,
  goals,
  tasks,
  onToggleHabit,
  onToggleTask,
  onNavigateToTareas,
  onNavigateToMetas,
  onEditHabit,
  onDeleteHabit,
  onEditTask,
  onDeleteTask
}: HoyTabProps) {
  const completedHabits = habits.filter((h) => h.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalItems = habits.length + tasks.length;
  const totalCompleted = completedHabits + completedTasks;
  const percentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  const ringCircumference = 264;
  const strokeOffset = ringCircumference - (ringCircumference * percentage) / 100;

  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak || 0)) : 0;

  const morningHabits = habits.filter((h) => h.timeBlock === 'morning');
  const nightHabits = habits.filter((h) => h.timeBlock === 'night');

  return (
    <div className="flex flex-col w-full gap-y-4">
      {/* Resumen de Energía y Consistencia Diaria */}
      <section className="relative overflow-hidden rounded-2xl frosted-card p-4.5 shadow-[0_0_30px_rgba(6,182,212,0.14)] border border-cyan-500/25">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between gap-4 relative z-10">
          {/* Métrica Circular SVG con Resplandor Celeste */}
          <div className="relative flex items-center justify-center flex-shrink-0 w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]" viewBox="0 0 100 100">
              <circle
                className="text-slate-800/80"
                cx="50"
                cy="50"
                fill="transparent"
                r="42"
                stroke="currentColor"
                strokeWidth="7"
              />
              <circle
                className="transition-all duration-700 ease-out"
                cx="50"
                cy="50"
                fill="transparent"
                r="42"
                stroke="url(#apexProgressGlow)"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="7"
              />
              <defs>
                <linearGradient id="apexProgressGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[26px] font-extrabold text-white tracking-tight leading-none drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                {percentage}%
              </span>
              <span className="text-[10px] font-bold text-cyan-400 uppercase mt-0.5 tracking-wider">
                Hoy
              </span>
            </div>
          </div>

          {/* Texto y Racha Global */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wide">
                {maxStreak > 0 ? `${maxStreak} DÍAS INVICTO` : '0 DÍAS DE RACHA'}
              </span>
            </div>
            <p className="text-[17px] font-bold text-white mt-1.5 truncate tracking-tight">
              {totalItems === 0 ? 'Tablero en Cero' : percentage === 100 ? '¡Día Conquistado!' : 'Impulso Diario'}
            </p>
            <p className="text-[12px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="font-bold text-cyan-300">{totalCompleted}</span> de{' '}
              <span className="text-slate-300">{totalItems}</span> hábitos y tareas listos
            </p>
            {/* Barra de ritmo diurno */}
            <div className="w-full bg-[#090d16] rounded-full h-2 mt-2.5 overflow-hidden p-0.5 border border-cyan-500/20">
              <div
                className="bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Metas Activas */}
      <section className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <h2 className="text-[16px] font-bold text-white tracking-tight">Metas Activas</h2>
          </div>
          <button
            onClick={onNavigateToMetas}
            className="frosted-pill text-[10px] font-bold text-cyan-300 hover:text-white px-2.5 py-1 rounded-full border border-cyan-500/30 transition-all cursor-pointer shadow-sm hover:border-cyan-400"
          >
            {goals.length > 0 ? 'Gestionar' : '+ Nueva Meta'}
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl frosted-card border border-cyan-500/20 text-center w-full">
            <Target className="w-7 h-7 text-cyan-400/60 mb-1.5" />
            <p className="text-[13px] font-bold text-white">Sin metas activas</p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[260px]">
              Tus metas financieras y personales aparecerán aquí al agregarlas.
            </p>
            <button
              type="button"
              onClick={onNavigateToMetas}
              className="mt-2.5 px-3 py-1 rounded-xl btn-cyan-glow text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear Primera Meta</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-none">
            {goals.map((g) => {
              const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
              return (
                <div
                  key={g.id}
                  className="flex flex-col flex-shrink-0 w-[240px] rounded-2xl frosted-card p-4 border border-cyan-500/20 hover:border-cyan-400/40 justify-between relative overflow-hidden transition-all shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {g.categoryLabel || (g.category === 'finance' ? 'Finanzas' : 'Personal')}
                        </span>
                      </div>
                      {g.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                          {g.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] font-bold text-white line-clamp-1">
                      {g.title}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-[17px] text-cyan-400 font-extrabold tracking-tight">
                        {g.prefix || ''}{g.current.toLocaleString()}{g.unit ? ` ${g.unit}` : ''}
                      </span>
                      <span className="text-[12px] text-slate-400">
                        / {g.prefix || ''}{g.target.toLocaleString()}{g.unit ? ` ${g.unit}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                      <span>Progreso</span>
                      <span className="text-cyan-400 font-bold">{pct}%</span>
                    </div>
                    <div className="w-full bg-[#090d16] rounded-full h-1.5 overflow-hidden border border-cyan-500/20">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sección Hábitos de Hoy */}
      <section className="flex flex-col gap-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-[16px] font-bold text-white tracking-tight">Hábitos de Hoy</h2>
          </div>
          <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full frosted-pill border border-cyan-500/25">
            {habits.length} asignados
          </span>
        </div>

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl frosted-card border border-cyan-500/20 text-center">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-[14px] font-bold text-white">Sin hábitos configurados</p>
            <p className="text-[12px] text-slate-400 mt-1 max-w-[260px]">
              Todo está en cero. Pulsa el botón flotante (<span className="text-cyan-300 font-bold">+</span>) para agregar tus propios hábitos matutinos y nocturnos.
            </p>
          </div>
        ) : (
          <>
            {/* Bloque 1: Mañana */}
            {morningHabits.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-1.5 px-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">
                    Bloque Matutino
                  </span>
                </div>

          {morningHabits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`habit-item flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
                habit.completed
                  ? 'bg-[#091522]/95 border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.2)]'
                  : 'frosted-card border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  aria-label="Alternar hábito"
                  className={`habit-toggle relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 active:scale-90 ${
                    habit.completed
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black border-2 border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.85)]'
                      : 'frosted-pill text-cyan-400/70 border-2 border-cyan-500/40 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {!habit.completed && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/20 opacity-75" />
                  )}
                  {habit.completed && <Check className="w-4 h-4 stroke-[3] text-slate-950" />}
                </button>
                <div className="flex flex-col min-w-0 text-left">
                  <p
                    className={`font-medium text-[14px] text-white truncate ${
                      habit.completed ? 'line-through opacity-60' : 'font-semibold'
                    }`}
                  >
                    {habit.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded-full bg-[#0f172a] border border-cyan-500/20 text-cyan-300 text-[10px] font-medium">
                      {habit.subtitle}
                    </span>
                    <span className="text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {habit.streak}d
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Mini Action Buttons: Editar & Eliminar */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                {onEditHabit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditHabit(habit);
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-cyan-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                    title="Editar hábito"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
                {onDeleteHabit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHabit(habit);
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-rose-500/25 text-slate-400 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                    title="Eliminar hábito"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bloque 2: Tarde / Noche */}
            {nightHabits.length > 0 && (
              <div className="flex flex-col gap-y-2 mt-1">
                <div className="flex items-center gap-1.5 px-1">
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">
                    Tarde & Noche
                  </span>
                </div>

          {nightHabits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`habit-item flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
                habit.completed
                  ? 'bg-[#091522]/95 border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.2)]'
                  : 'frosted-card border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  aria-label="Alternar hábito"
                  className={`habit-toggle flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 active:scale-90 ${
                    habit.completed
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black border-2 border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.85)]'
                      : 'frosted-pill text-cyan-400/70 border-2 border-cyan-500/40 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {habit.completed && <Check className="w-4 h-4 stroke-[3] text-slate-950" />}
                </button>
                <div className="flex flex-col min-w-0 text-left">
                  <p
                    className={`font-medium text-[14px] text-white truncate ${
                      habit.completed ? 'line-through opacity-60' : 'font-semibold'
                    }`}
                  >
                    {habit.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded-full bg-[#0f172a] border border-cyan-500/20 text-cyan-300 text-[10px] font-medium">
                      {habit.subtitle}
                    </span>
                    <span className="text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {habit.streak}d
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Mini Action Buttons: Editar & Eliminar */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                {onEditHabit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditHabit(habit);
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-cyan-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                    title="Editar hábito"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
                {onDeleteHabit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHabit(habit);
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-rose-500/25 text-slate-400 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                    title="Eliminar hábito"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
            )}
          </>
        )}
      </section>

      {/* Widget de Tareas Prioritarias del Día */}
      <section className="rounded-2xl frosted-card p-4.5 shadow-lg border border-cyan-500/25 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            <h3 className="text-[16px] font-bold text-white tracking-tight">Tareas Prioritarias</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full frosted-pill border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
            {tasks.filter((t) => !t.completed).length} pendientes
          </span>
        </div>

        {/* Mini-lista de tareas compactas */}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center">
            <p className="text-[13px] font-bold text-white">Sin tareas pendientes</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              No tienes pendientes registrados para hoy.
            </p>
            <button
              type="button"
              onClick={onNavigateToTareas}
              className="mt-2.5 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Agregar Tarea</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-y-2">
            {tasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                task.completed
                  ? 'bg-[#091522]/95 border-cyan-400/70 shadow-[0_0_16px_rgba(6,182,212,0.2)]'
                  : 'bg-[#090e18] border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                {task.completed ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 text-white font-black border-2 border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.85)] flex items-center justify-center flex-shrink-0 transition-transform active:scale-90">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : task.priority === 'urgente' ? (
                  <div className="w-5 h-5 rounded-full border-2 border-rose-400/80 hover:border-cyan-300 flex items-center justify-center flex-shrink-0 transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-cyan-500/60 hover:border-cyan-300 flex items-center justify-center flex-shrink-0 transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                )}
                <span
                  className={`text-[13px] text-slate-200 truncate ${
                    task.completed ? 'line-through opacity-60 text-cyan-200' : 'font-medium'
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-bold text-cyan-400 whitespace-nowrap">
                  {task.time || 'Hoy'}
                </span>
                <div className="flex items-center gap-1">
                  {onEditTask && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className="w-5.5 h-5.5 rounded-lg bg-[#070a12]/90 border border-cyan-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      title="Editar tarea"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {onDeleteTask && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task);
                      }}
                      className="w-5.5 h-5.5 rounded-lg bg-[#070a12]/90 border border-rose-500/25 text-slate-400 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/15 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Botón CTA Ver todas las tareas */}
        <button
          onClick={onNavigateToTareas}
          className="w-full mt-1 py-3 px-4 rounded-xl btn-cyan-glow font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md"
          type="button"
        >
          <span>Ver todas las tareas</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </section>
    </div>
  );
}
