import { useState, type FormEvent } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';
import { DailyTask } from '../types';

interface TareasTabProps {
  tasks: DailyTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (newTask: Omit<DailyTask, 'id' | 'completed'>) => void;
  onEditTask?: (task: DailyTask) => void;
  onDeleteTask?: (task: DailyTask) => void;
}

export function TareasTab({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask
}: TareasTabProps) {
  const [selectedDay, setSelectedDay] = useState('Sáb 12');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'urgente' | 'trabajo' | 'finanzas' | 'personal'>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTime, setQuickTime] = useState('Sin hora');
  const [quickCat, setQuickCat] = useState<'trabajo' | 'finanzas' | 'personal'>('trabajo');
  const [quickPriority, setQuickPriority] = useState<'urgente' | 'normal'>('normal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle.trim(),
      priority: quickPriority,
      category: quickCat,
      time: quickTime !== 'Sin hora' ? `${quickTime} hrs` : undefined
    });

    showToast(`Tarea agregada: "${quickTitle.trim()}"`);
    setQuickTitle('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const pacingPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 66;

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'urgente') return t.priority === 'urgente';
    return t.category === selectedCategory;
  });

  const urgentTasks = filteredTasks.filter((t) => t.priority === 'urgente' && !t.completed);
  const normalTasks = filteredTasks.filter((t) => t.priority === 'normal' && !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Interactive Week Horizontal Ribbon */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[16px] font-semibold text-on-surface">Septiembre 2026</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-high text-primary">
              Semana 37
            </span>
          </div>
          <button
            className="flex items-center space-x-1 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
            type="button"
          >
            <span className="text-[10px] font-semibold">Mes completo</span>
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          </button>
        </div>

        {/* Micro-Snap Day Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1.5 -mx-3 px-3 scrollbar-none">
          {[
            { day: 'Lun', num: '7', color: 'bg-emerald-400', count: '5' },
            { day: 'Mar', num: '8', color: 'bg-emerald-400', count: '4' },
            { day: 'Mié', num: '9', color: 'bg-emerald-400', count: '6' },
            { day: 'Jue', num: '10', color: 'bg-amber-400', count: '7' },
            { day: 'Vie', num: '11', color: 'bg-slate-500', count: '3' },
            { day: 'Sáb', num: '12', color: 'bg-cyan-300', count: '4', active: true },
            { day: 'Dom', num: '13', color: 'bg-slate-500', count: '2' },
          ].map((d) => {
            const isCurrent = selectedDay === `${d.day} ${d.num}`;
            return (
              <button
                key={d.num}
                type="button"
                onClick={() => {
                  setSelectedDay(`${d.day} ${d.num}`);
                  showToast(`Cargando tareas para ${d.day} ${d.num}`);
                }}
                className={`day-chip flex flex-col items-center justify-between min-w-[54px] h-[72px] py-2 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'min-w-[58px] h-[76px] btn-cyan-glow shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-300/80 scale-[1.03]'
                    : 'frosted-card text-slate-400 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-wider ${isCurrent ? 'font-bold text-black' : 'opacity-70'}`}>
                  {d.day}
                </span>
                <span className={`text-[16px] font-extrabold ${isCurrent ? 'text-[19px] text-black' : 'text-white'}`}>
                  {d.num}
                </span>
                <div className="flex items-center space-x-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-black' : d.color}`} />
                  <span className={`text-[10px] font-bold ${isCurrent ? 'text-black' : 'text-slate-400'}`}>
                    {d.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Telemetry Pacing & Speed Action */}
      <div className="relative overflow-hidden rounded-2xl frosted-card p-4.5 border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[16px] font-bold text-white tracking-tight">Ritmo de Hoy</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                {pacingPercentage}%
              </span>
            </div>
            <span className="text-[12px] text-slate-400 truncate">
              {completedCount} de {totalCount} completadas · Faltan {totalCount - completedCount} críticas
            </span>
          </div>
          <a
            href="#quick-task-tray"
            className="btn-cyan-glow flex items-center space-x-1 px-4 py-2 rounded-xl font-bold text-[13px] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nueva</span>
          </a>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#090d16] overflow-hidden p-0.5 border border-cyan-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            style={{ width: `${pacingPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto -mx-3 px-3 scrollbar-none py-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`filter-chip flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.5)]'
              : 'frosted-pill text-slate-400 hover:text-white hover:border-cyan-400/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Todas</span>
          <span className="text-[10px] px-1.5 rounded-full bg-black/20">{tasks.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('urgente')}
          className={`filter-chip flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            selectedCategory === 'urgente'
              ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
              : 'frosted-pill text-slate-400 hover:text-white hover:border-rose-400/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>Alta Prioridad</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('trabajo')}
          className={`filter-chip flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            selectedCategory === 'trabajo'
              ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.5)]'
              : 'frosted-pill text-slate-400 hover:text-white hover:border-cyan-400/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Trabajo</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('finanzas')}
          className={`filter-chip flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            selectedCategory === 'finanzas'
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.5)]'
              : 'frosted-pill text-slate-400 hover:text-white hover:border-emerald-400/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Finanzas</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('personal')}
          className={`filter-chip flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            selectedCategory === 'personal'
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)]'
              : 'frosted-pill text-slate-400 hover:text-white hover:border-amber-400/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Personal</span>
        </button>
      </div>

      {/* Task Timeline Section */}
      <div className="flex flex-col space-y-4">
        {/* Section: Prioridad Inmediata */}
        {urgentTasks.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-error flex items-center space-x-1">
                <span className="material-symbols-outlined text-[15px]">priority_high</span>
                <span>Prioridad Inmediata</span>
              </span>
              <span className="text-[10px] text-on-surface-variant font-semibold">Límite 18:00</span>
            </div>

            {urgentTasks.map((t) => (
              <div
                key={t.id}
                className="task-card group relative overflow-hidden rounded-2xl frosted-card p-4 border border-rose-500/30 hover:border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.12)] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <button
                      type="button"
                      aria-label="Completar tarea"
                      onClick={() => {
                        onToggleTask(t.id);
                        showToast('¡Pendiente resuelto! Impecable.');
                      }}
                      className="task-checkbox mt-0.5 flex-shrink-0 w-7 h-7 rounded-full border-2 border-rose-400/60 hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-center text-rose-300 transition-all hover:scale-105 active:scale-90 cursor-pointer group/chk"
                    >
                      <Check className="w-3.5 h-3.5 opacity-0 group-hover/chk:opacity-50 transition-opacity text-cyan-300" />
                    </button>
                    <div className="flex flex-col min-w-0 w-full">
                      <span className="task-title text-[15px] font-semibold text-white tracking-tight">
                        {t.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {t.time && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[10px] font-bold shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                            <span className="material-symbols-outlined text-[12px]">alarm</span>
                            <span>{t.time}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">business_center</span>
                          <span className="capitalize">{t.category}</span>
                        </span>
                        {t.tag && (
                          <span className="text-[10px] font-bold text-amber-400">
                            {t.tag}
                          </span>
                        )}
                      </div>

                      {/* Mini Checklist preview if available */}
                      {t.subtasks && (
                        <div className="mt-2 pt-1 flex flex-col space-y-1">
                          {t.subtasks.map((st, i) => (
                            <div
                              key={i}
                              className={`flex items-center space-x-2 text-[12px] ${
                                st.completed ? 'text-slate-500 line-through opacity-70' : 'text-slate-300'
                              }`}
                            >
                              <span
                                className={`material-symbols-outlined text-[14px] ${
                                  st.completed ? 'text-cyan-400' : 'text-slate-500'
                                }`}
                              >
                                {st.completed ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span className="truncate">{st.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mini Action Buttons: Editar & Eliminar */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {onEditTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-cyan-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                        title="Editar tarea"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(t);
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-rose-500/25 text-slate-400 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section: Jornada de Tarde / Regulares */}
        {normalTasks.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>Bloque de Tarde</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">16:00 - 20:00</span>
            </div>

            {normalTasks.map((t) => (
              <div
                key={t.id}
                className="task-card group relative overflow-hidden rounded-2xl frosted-card p-4 border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <button
                      type="button"
                      aria-label="Completar tarea"
                      onClick={() => {
                        onToggleTask(t.id);
                        showToast('¡Pendiente resuelto! Impecable.');
                      }}
                      className="task-checkbox mt-0.5 flex-shrink-0 w-7 h-7 rounded-full border-2 border-cyan-500/50 hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-center text-cyan-300 transition-all hover:scale-105 active:scale-90 cursor-pointer group/chk"
                    >
                      <Check className="w-3.5 h-3.5 opacity-0 group-hover/chk:opacity-50 transition-opacity text-cyan-300" />
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className="task-title text-[15px] font-semibold text-white tracking-tight">
                        {t.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {t.time && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            <span>{t.time}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">account_balance</span>
                          <span className="capitalize">{t.category}</span>
                        </span>
                        {t.tag && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {t.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mini Action Buttons: Editar & Eliminar */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {onEditTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-cyan-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                        title="Editar tarea"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(t);
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-rose-500/25 text-slate-400 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section: Completadas Hoy */}
        {completedTasks.length > 0 && (
          <div className="flex flex-col space-y-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <span className="material-symbols-outlined text-[15px]">done_all</span>
                <span>Completadas ({completedTasks.length})</span>
              </span>
            </div>

            {completedTasks.map((t) => (
              <div
                key={t.id}
                className="task-card group relative overflow-hidden rounded-2xl bg-[#091522]/95 border-2 border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.2)] p-4 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <button
                      type="button"
                      aria-label="Desmarcar tarea"
                      onClick={() => onToggleTask(t.id)}
                      className="task-checkbox mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 text-white font-black border-2 border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.85)] flex items-center justify-center transition-all hover:scale-105 active:scale-90 cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className="task-title text-[15px] font-medium text-cyan-200 line-through opacity-80">
                        {t.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#0d1322] border border-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">check</span>
                          <span>{t.time || 'Completado'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Action Buttons: Editar & Eliminar */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {onEditTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-cyan-500/25 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                        title="Editar tarea"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteTask && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(t);
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-rose-500/25 text-slate-400 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/15 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Quick Add Task Tray */}
      <div
        id="quick-task-tray"
        className="relative overflow-hidden rounded-2xl frosted-card p-4.5 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.2)] mt-2"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-cyan-400 text-[20px] drop-shadow-[0_0_8px_#22d3ee]">bolt</span>
            <span className="text-[16px] font-bold text-white tracking-tight">Captura Rápida de Pendiente</span>
          </div>
          <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full frosted-pill border-cyan-500/25">Hoy, {selectedDay}</span>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleCreateTask} className="flex flex-col space-y-2.5">
          <div className="relative">
            <input
              id="quick-task-input"
              type="text"
              required
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="¿Qué pendiente único resuelves hoy?"
              className="w-full h-12 px-4 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all shadow-inner"
            />
          </div>

          {/* Micro Controls Bar (Time, Category, Priority) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Time Picker Chip */}
              <div className="relative flex items-center frosted-pill border border-cyan-500/25 px-2.5 py-1 rounded-xl text-slate-300">
                <span className="material-symbols-outlined text-[16px] mr-1 text-cyan-400">schedule</span>
                <select
                  value={quickTime}
                  onChange={(e) => setQuickTime(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-cyan-300 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#0b101c] text-slate-200" value="Sin hora">Sin hora</option>
                  <option className="bg-[#0b101c] text-slate-200" value="12:00">12:00 PM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="15:30">15:30 PM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="18:00">18:00 PM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="20:00">20:00 PM</option>
                </select>
              </div>

              {/* Category Selector */}
              <div className="relative flex items-center frosted-pill border border-cyan-500/25 px-2.5 py-1 rounded-xl text-slate-300">
                <span className="material-symbols-outlined text-[16px] mr-1 text-cyan-400">label</span>
                <select
                  value={quickCat}
                  onChange={(e) => setQuickCat(e.target.value as any)}
                  className="bg-transparent text-[11px] font-bold text-cyan-300 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#0b101c] text-slate-200" value="trabajo">Trabajo</option>
                  <option className="bg-[#0b101c] text-slate-200" value="finanzas">Finanzas</option>
                  <option className="bg-[#0b101c] text-slate-200" value="personal">Personal</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div className="relative flex items-center frosted-pill border border-cyan-500/25 px-2.5 py-1 rounded-xl text-slate-300">
                <span className="material-symbols-outlined text-[16px] mr-1 text-cyan-400">priority_high</span>
                <select
                  value={quickPriority}
                  onChange={(e) => setQuickPriority(e.target.value as any)}
                  className="bg-transparent text-[11px] font-bold text-cyan-300 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#0b101c] text-slate-200" value="normal">Normal</option>
                  <option className="bg-[#0b101c] text-slate-200" value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            {/* Add Button */}
            <button
              type="submit"
              className="btn-cyan-glow flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-[13px] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Añadir</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Visual Delight Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex items-center space-x-2 px-4 py-2 rounded-full bg-surface-container-highest text-secondary shadow-[0_8px_30px_rgba(78,222,163,0.3)] animate-in fade-in zoom-in duration-200">
          <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
          <span className="text-[10px] font-semibold text-on-surface">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
