import { useState, useRef, type FormEvent, type TouchEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  RotateCcw,
  Clock,
  Plus,
  Check,
  Pencil,
  Trash2,
  AlertCircle,
  Briefcase,
  DollarSign,
  User,
  Tag,
  Flame,
  Zap,
  CheckCircle2,
  ListTodo,
  Bell,
  Sliders
} from 'lucide-react';
import { DailyTask } from '../types';
import { triggerTaskReminderTest } from './TaskReminderNotification';
import { CustomNotificationModal } from './CustomNotificationModal';

interface TareasTabProps {
  tasks: DailyTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (newTask: Omit<DailyTask, 'id' | 'completed'>) => void;
  onEditTask?: (task: DailyTask) => void;
  onDeleteTask?: (task: DailyTask) => void;
}

// Helper date utilities
const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const formatDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getMondayOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
};

const addWeeks = (date: Date, weeks: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
};

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MONTH_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const DAY_NAMES_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAY_NAMES_FULL_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function TareasTab({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask
}: TareasTabProps) {
  // Weekly date navigation state
  const today = getTodayDate();
  const todayKey = formatDateKey(today);

  const [weekStartDate, setWeekStartDate] = useState<Date>(() => getMondayOfWeek(today));
  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [viewScope, setViewScope] = useState<'day' | 'week'>('day');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'urgente' | 'trabajo' | 'finanzas' | 'personal'>('all');

  // Quick add form state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTime, setQuickTime] = useState('Sin hora');
  const [quickCat, setQuickCat] = useState<'trabajo' | 'finanzas' | 'personal'>('trabajo');
  const [quickPriority, setQuickPriority] = useState<'urgente' | 'normal'>('normal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Touch swipe support for week container
  const touchStartXRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  // Week calculations
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(weekStartDate);
    dayDate.setDate(weekStartDate.getDate() + i);
    const dateKey = formatDateKey(dayDate);
    const isToday = dateKey === todayKey;
    const isSelected = dateKey === formatDateKey(selectedDate);

    // Filter tasks for this day
    const dayTasks = tasks.filter((t) => {
      if (t.date) return t.date === dateKey;
      return isToday;
    });
    const completedTasksCount = dayTasks.filter((t) => t.completed).length;

    return {
      date: dayDate,
      dateKey,
      dayName: DAY_NAMES_ES[i],
      dayNameFull: DAY_NAMES_FULL_ES[i],
      dayNum: dayDate.getDate(),
      isToday,
      isSelected,
      taskCount: dayTasks.length,
      completedCount: completedTasksCount
    };
  });

  const sundayDate = weekDays[6].date;
  const isCurrentWeek = formatDateKey(getMondayOfWeek(today)) === formatDateKey(weekStartDate);
  const currentWeekNumber = getWeekNumber(weekStartDate);

  // Header month text
  const weekMonthText =
    weekStartDate.getMonth() === sundayDate.getMonth()
      ? `${MONTH_NAMES_ES[weekStartDate.getMonth()]} ${weekStartDate.getFullYear()}`
      : `${MONTH_SHORT_ES[weekStartDate.getMonth()]} - ${MONTH_SHORT_ES[sundayDate.getMonth()]} ${sundayDate.getFullYear()}`;

  const weekRangeText = `${weekStartDate.getDate()} ${MONTH_SHORT_ES[weekStartDate.getMonth()]} al ${sundayDate.getDate()} ${MONTH_SHORT_ES[sundayDate.getMonth()]}`;

  // Week navigation handlers
  const handlePrevWeek = () => {
    const newWeekStart = addWeeks(weekStartDate, -1);
    setWeekStartDate(newWeekStart);
    // Maintain corresponding day of week
    const currentDayIndex = (selectedDate.getDay() + 6) % 7;
    const newSelected = new Date(newWeekStart);
    newSelected.setDate(newWeekStart.getDate() + currentDayIndex);
    setSelectedDate(newSelected);
    showToast(`Semana ${getWeekNumber(newWeekStart)}`);
  };

  const handleNextWeek = () => {
    const newWeekStart = addWeeks(weekStartDate, 1);
    setWeekStartDate(newWeekStart);
    const currentDayIndex = (selectedDate.getDay() + 6) % 7;
    const newSelected = new Date(newWeekStart);
    newSelected.setDate(newWeekStart.getDate() + currentDayIndex);
    setSelectedDate(newSelected);
    showToast(`Semana ${getWeekNumber(newWeekStart)}`);
  };

  const handleGoToToday = () => {
    const monday = getMondayOfWeek(today);
    setWeekStartDate(monday);
    setSelectedDate(today);
    showToast('Regresaste a Hoy');
  };

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    setViewScope('day');
  };

  // Touch swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 50) {
      handlePrevWeek();
    } else if (diff < -50) {
      handleNextWeek();
    }
    touchStartXRef.current = null;
  };

  // Filter tasks based on viewScope and selectedDate
  const selectedDateKey = formatDateKey(selectedDate);
  const weekDateKeys = new Set(weekDays.map((d) => d.dateKey));

  const tasksForCurrentScope = tasks.filter((t) => {
    if (viewScope === 'week') {
      if (t.date) return weekDateKeys.has(t.date);
      return isCurrentWeek;
    }
    // viewScope === 'day'
    if (t.date) return t.date === selectedDateKey;
    return selectedDateKey === todayKey;
  });

  const filteredTasks = tasksForCurrentScope.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'urgente') return t.priority === 'urgente';
    return t.category === selectedCategory;
  });

  const urgentTasks = filteredTasks.filter((t) => t.priority === 'urgente' && !t.completed);
  const normalTasks = filteredTasks.filter((t) => t.priority === 'normal' && !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const completedCount = tasksForCurrentScope.filter((t) => t.completed).length;
  const totalCount = tasksForCurrentScope.length;
  const pacingPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle.trim(),
      date: selectedDateKey,
      priority: quickPriority,
      category: quickCat,
      time: quickTime !== 'Sin hora' ? `${quickTime} hrs` : undefined
    });

    const dayName = DAY_NAMES_FULL_ES[(selectedDate.getDay() + 6) % 7];
    showToast(`Tarea guardada para el ${dayName} ${selectedDate.getDate()}`);
    setQuickTitle('');
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Interactive Week Displacement & Navigation Header */}
      <div
        className="flex flex-col space-y-2 p-3 rounded-2xl frosted-card border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.12)]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Month, Week Badge & Navigation Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[15px] font-bold text-white tracking-tight leading-tight">
                  {weekMonthText}
                </span>
                <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                  Semana {currentWeekNumber}
                </span>
              </div>
              <span className="text-[10.5px] text-slate-400 font-medium">
                {weekRangeText}
              </span>
            </div>
          </div>

          {/* Week Shift Action Buttons (< > Hoy) */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/30 hover:border-cyan-400/70 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Semana anterior (desplazar atrás)"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleGoToToday}
              className={`px-2.5 h-8 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                isCurrentWeek && selectedDateKey === todayKey
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'frosted-pill border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400/60'
              }`}
              title="Ir a fecha de hoy"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Hoy</span>
            </button>

            <button
              type="button"
              onClick={handleNextWeek}
              className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/30 hover:border-cyan-400/70 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Semana siguiente (desplazar adelante)"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Micro-Snap Horizontal Carousel with Real Dynamic Dates */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1.5 -mx-1 px-1 scrollbar-none">
          {weekDays.map((d) => {
            const isSelected = d.isSelected && viewScope === 'day';
            return (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => handleSelectDay(d.date)}
                className={`day-chip flex flex-col items-center justify-between min-w-[50px] flex-1 h-[74px] py-1.5 px-1 rounded-2xl transition-all cursor-pointer relative ${
                  isSelected
                    ? 'btn-cyan-glow shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-300/90 scale-[1.03] z-10'
                    : 'frosted-card text-slate-400 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                {/* Is Today Dot Badge */}
                {d.isToday && (
                  <span
                    className={`absolute -top-1 right-1 px-1 py-0.2 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                      isSelected ? 'bg-black text-cyan-300' : 'bg-cyan-400 text-black shadow-[0_0_6px_#22d3ee]'
                    }`}
                  >
                    HOY
                  </span>
                )}

                <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'font-black text-black' : 'opacity-75 font-semibold'}`}>
                  {d.dayName}
                </span>

                <span className={`text-[17px] font-extrabold leading-none ${isSelected ? 'text-[20px] text-black' : 'text-white'}`}>
                  {d.dayNum}
                </span>

                <div className="flex items-center space-x-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-black'
                        : d.taskCount > 0
                        ? d.completedCount === d.taskCount
                          ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                          : 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                        : 'bg-slate-700'
                    }`}
                  />
                  <span className={`text-[9.5px] font-bold ${isSelected ? 'text-black' : 'text-slate-400'}`}>
                    {d.taskCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* View Scope Selector: Day vs Full Week */}
        <div className="flex items-center justify-between pt-1 border-t border-cyan-500/15">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewScope('day')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                viewScope === 'day'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Día: {DAY_NAMES_ES[(selectedDate.getDay() + 6) % 7]} {selectedDate.getDate()}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewScope('week')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                viewScope === 'week'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3 h-3 text-cyan-400" />
              <span>Toda la semana ({totalCount})</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-400 italic">
            Desliza para cambiar de semana
          </span>
        </div>
      </div>

      {/* Telemetry Pacing & Speed Action */}
      <div className="relative overflow-hidden rounded-2xl frosted-card p-4 border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[15px] font-bold text-white tracking-tight">
                {viewScope === 'day'
                  ? `Ritmo del ${DAY_NAMES_FULL_ES[(selectedDate.getDay() + 6) % 7]} ${selectedDate.getDate()}`
                  : 'Ritmo Semanal'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                {pacingPercentage}%
              </span>
            </div>
            <span className="text-[11.5px] text-slate-400 truncate">
              {completedCount} de {totalCount} completadas · {totalCount - completedCount} pendientes
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                const sample = urgentTasks[0] || normalTasks[0] || {
                  id: 'task-rem-sample',
                  title: 'Prioridad del Día: Enfoque Ininterrumpido',
                  completed: false,
                  time: '14:30',
                  priority: 'urgente',
                  category: 'trabajo'
                };
                triggerTaskReminderTest(sample);
                showToast('🔔 Recordatorio móvil con sonido e icono activado');
              }}
              className="frosted-pill px-2.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Probar notificación en la pantalla de este celular"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Alerta 🔔</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="frosted-pill px-2.5 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Personalizar mensaje, icono, sonido y color de la notificación"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Personalizar 🎨</span>
            </button>

            <a
              href="#quick-task-tray"
              className="btn-cyan-glow flex items-center space-x-1 px-3.5 py-1.5 rounded-xl font-bold text-[12px] active:scale-95 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nueva</span>
            </a>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#090d16] overflow-hidden p-0.5 border border-cyan-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            style={{ width: `${pacingPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter Chips */}
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
          <span className="text-[10px] px-1.5 rounded-full bg-black/20">{tasksForCurrentScope.length}</span>
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

      {/* Empty State when no tasks match */}
      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl frosted-card border border-cyan-500/20 my-2">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ListTodo className="w-6 h-6" />
          </div>
          <span className="text-[14px] font-bold text-white mb-1">
            {viewScope === 'day'
              ? `Sin tareas para el ${DAY_NAMES_FULL_ES[(selectedDate.getDay() + 6) % 7]} ${selectedDate.getDate()}`
              : 'Sin tareas programadas para esta semana'}
          </span>
          <p className="text-[12px] text-slate-400 max-w-xs mb-3">
            Programa un nuevo pendiente abajo y mantén tu ritmo imparable.
          </p>
          <a
            href="#quick-task-tray"
            className="btn-cyan-glow px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Crear tarea para este día</span>
          </a>
        </div>
      )}

      {/* Task Timeline Section */}
      <div className="flex flex-col space-y-4">
        {/* Section: Prioridad Inmediata */}
        {urgentTasks.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Prioridad Inmediata</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Límite 18:00</span>
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
                            <Clock className="w-3 h-3 text-rose-300" />
                            <span>{t.time}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                          <Briefcase className="w-3 h-3 text-cyan-300" />
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
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  st.completed ? 'border-cyan-400 text-cyan-400' : 'border-slate-500'
                                }`}
                              >
                                {st.completed && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <span className="truncate">{st.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mini Action Buttons: Recordatorio Móvil, Editar & Eliminar */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerTaskReminderTest(t);
                        showToast(`🔔 Alerta móvil lanzada: "${t.title}"`);
                      }}
                      className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-amber-500/35 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-amber-500/20 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Lanzar recordatorio móvil con sonido e icono"
                    >
                      <Bell className="w-3 h-3" />
                    </button>
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

        {/* Section: Bloque Regular */}
        {normalTasks.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-cyan-300" />
                <span>Pendientes Regulares</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{normalTasks.length} activos</span>
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
                            <Clock className="w-3 h-3 text-cyan-300" />
                            <span>{t.time}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                          {t.category === 'finanzas' ? (
                            <DollarSign className="w-3 h-3 text-emerald-300" />
                          ) : t.category === 'personal' ? (
                            <User className="w-3 h-3 text-emerald-300" />
                          ) : (
                            <Briefcase className="w-3 h-3 text-emerald-300" />
                          )}
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

                  {/* Mini Action Buttons: Recordatorio Móvil, Editar & Eliminar */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerTaskReminderTest(t);
                        showToast(`🔔 Alerta móvil lanzada: "${t.title}"`);
                      }}
                      className="w-6.5 h-6.5 rounded-lg bg-[#070a12]/90 border border-amber-500/35 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-amber-500/20 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Lanzar recordatorio móvil con sonido e icono"
                    >
                      <Bell className="w-3 h-3" />
                    </button>
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

        {/* Section: Completadas */}
        {completedTasks.length > 0 && (
          <div className="flex flex-col space-y-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
                          <Check className="w-3 h-3 text-cyan-400" />
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
            <Zap className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[15px] font-bold text-white tracking-tight">Captura Rápida de Pendiente</span>
          </div>
          <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full frosted-pill border border-cyan-500/30">
            Para: {DAY_NAMES_ES[(selectedDate.getDay() + 6) % 7]} {selectedDate.getDate()} {MONTH_SHORT_ES[selectedDate.getMonth()]}
          </span>
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
              placeholder={`¿Qué pendiente resuelves el ${DAY_NAMES_FULL_ES[(selectedDate.getDay() + 6) % 7]}?`}
              className="w-full h-12 px-4 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all shadow-inner"
            />
          </div>

          {/* Micro Controls Bar (Time, Category, Priority, Date Shift) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Time Picker Chip */}
              <div className="relative flex items-center frosted-pill border border-cyan-500/25 px-2.5 py-1 rounded-xl text-slate-300">
                <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                <select
                  value={quickTime}
                  onChange={(e) => setQuickTime(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-cyan-300 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#0b101c] text-slate-200" value="Sin hora">Sin hora</option>
                  <option className="bg-[#0b101c] text-slate-200" value="09:00">09:00 AM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="12:00">12:00 PM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="15:30">15:30 PM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="18:00">18:00 PM</option>
                  <option className="bg-[#0b101c] text-slate-200" value="20:00">20:00 PM</option>
                </select>
              </div>

              {/* Category Selector */}
              <div className="relative flex items-center frosted-pill border border-cyan-500/25 px-2.5 py-1 rounded-xl text-slate-300">
                <Tag className="w-3.5 h-3.5 mr-1 text-cyan-400" />
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
                <Flame className="w-3.5 h-3.5 mr-1 text-rose-400" />
                <select
                  value={quickPriority}
                  onChange={(e) => setQuickPriority(e.target.value as any)}
                  className="bg-transparent text-[11px] font-bold text-cyan-300 focus:outline-none cursor-pointer"
                >
                  <option className="bg-[#0b101c] text-slate-200" value="normal">Normal</option>
                  <option className="bg-[#0b101c] text-slate-200" value="urgente">Urgente 🔥</option>
                </select>
              </div>
            </div>

            {/* Add Button */}
            <button
              type="submit"
              className="btn-cyan-glow flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-[13px] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Añadir Tarea</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal para Personalizar la Notificación */}
      <CustomNotificationModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        tasks={tasks}
        onSaved={() => showToast('✨ Notificación personalizada guardada')}
      />

      {/* Bottom Visual Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0b1322] border border-cyan-400/40 text-cyan-300 shadow-[0_8px_30px_rgba(6,182,212,0.3)] animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-semibold text-white">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
