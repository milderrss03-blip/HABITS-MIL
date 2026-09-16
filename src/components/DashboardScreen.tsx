import { useState, useEffect, type FormEvent } from 'react';
import { Habit, Goal, DailyTask, DashboardTab, UserProfile, CalendarEvent } from '../types';
import { binauralSound } from '../utils/audio';
import { HoyTab } from './HoyTab';
import { TareasTab } from './TareasTab';
import { MetasTab } from './MetasTab';
import { MetricasTab } from './MetricasTab';
import { CalendarioTab } from './CalendarioTab';
import { AsistenteTab } from './AsistenteTab';
import { BottomNav } from './BottomNav';
import { EditHabitModal } from './EditHabitModal';
import { EditTaskModal } from './EditTaskModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ShareModal } from './ShareModal';
import {
  Bell,
  Plus,
  X,
  Sparkles,
  LogOut,
  ShieldCheck,
  User,
  CheckCircle2,
  Calendar,
  Flame,
  Sun,
  Moon,
  Check,
  Crown,
  Clock,
  Mail,
  Share2
} from 'lucide-react';
import { GoogleIcon } from './GoogleIcon';
import { getWisdomForDate, getDayNameSpanish } from '../data/millionaireWisdom';

interface DashboardScreenProps {
  onBackToWelcome: () => void;
  habits: Habit[];
  goals: Goal[];
  tasks: DailyTask[];
  onToggleHabit: (id: string) => void;
  onToggleTask: (id: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completed' | 'streak'>) => void;
  onEditHabit?: (id: string, updated: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onAddTask: (newTask: Omit<DailyTask, 'id' | 'completed'>) => void;
  onEditTask?: (id: string, updated: Partial<DailyTask>) => void;
  onDeleteTask?: (id: string) => void;
  onUpdateGoalProgress: (id: string, amount: number) => void;
  onAddNewGoal: (goal: Omit<Goal, 'id'>) => void;
  onEditGoal?: (id: string, updated: Partial<Goal>) => void;
  onDeleteGoal?: (id: string) => void;
  events?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEditEvent?: (id: string, updated: Partial<CalendarEvent>) => void;
  onDeleteEvent?: (id: string) => void;
  onToggleEvent?: (id: string) => void;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  onOpenGoogleLogin?: () => void;
  onLogout?: () => void;
}

export function DashboardScreen({
  onBackToWelcome,
  habits,
  goals,
  tasks,
  onToggleHabit,
  onToggleTask,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateGoalProgress,
  onAddNewGoal,
  onEditGoal,
  onDeleteGoal,
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleEvent,
  currentUser,
  onOpenLogin,
  onOpenGoogleLogin,
  onLogout
}: DashboardScreenProps) {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('hoy');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitBlock, setNewHabitBlock] = useState<'morning' | 'night'>('morning');

  // Modals for editing & deletion
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    title: string;
    type: 'hábito' | 'tarea' | 'meta' | 'evento';
  } | null>(null);

  const displayName = currentUser?.fullName || 'Mi Cuenta';
  const displayInitials = currentUser?.initials || 'MC';
  const displayUsername = currentUser?.username || 'invitado';

  useEffect(() => {
    const unsub = binauralSound.subscribe((playing) => setIsPlayingAudio(playing));
    return () => unsub();
  }, []);

  const handleToggleSound = () => {
    binauralSound.toggle();
  };

  const handleCreateHabitSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    onAddHabit({
      title: newHabitTitle.trim(),
      subtitle: newHabitBlock === 'morning' ? 'Enfoque matutino' : 'Cierre nocturno',
      category: 'mind',
      timeBlock: newHabitBlock,
      icon: newHabitBlock === 'morning' ? 'wb_sunny' : 'nights_stay'
    });
    setNewHabitTitle('');
    setQuickAddModalOpen(false);
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-[#070a11] text-on-surface antialiased font-sans select-none pb-20 max-w-[430px] mx-auto shadow-2xl overflow-x-hidden">
      {/* Ambient Orbital Background Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-to-b from-cyan-600/15 via-blue-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-cyan-500/10 rounded-full blur-2xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top App Bar with Name & Notification only as requested */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2 relative z-20">
        {/* User Identity: Name only */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[17px] font-black text-white tracking-tight leading-none">
              {displayName}
            </span>
          </div>
        </div>

        {/* Notifications Button only */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-10 h-10 rounded-full frosted-pill border border-cyan-500/30 hover:border-cyan-400/60 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] active:scale-95"
            title="Ver notificaciones"
          >
            <Bell className="w-5 h-5 text-cyan-300" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#070a11] animate-pulse" />
          </button>
        </div>
      </header>

      {/* User Profile Menu Dropdown */}
      {profileMenuOpen && (
        <div className="mx-4 my-2 p-4 rounded-2xl frosted-card border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col gap-3 z-30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold text-xs">
                {displayInitials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-white">{displayName}</span>
                  {currentUser?.provider === 'gmail' ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-red-950/80 text-red-300 border border-red-500/40 text-[9px] font-bold shadow-sm" title="Cuenta verificada con Gmail">
                      <Mail className="w-2.5 h-2.5 text-red-400" />
                      <span>Gmail</span>
                    </span>
                  ) : currentUser?.provider === 'google' ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-white text-slate-900 text-[9px] font-bold shadow-sm" title="Cuenta verificada por Google">
                      <GoogleIcon className="w-2.5 h-2.5" />
                      <span>Google</span>
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] text-cyan-400 font-mono block">
                  {currentUser?.email || `@${displayUsername}`}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(false)}
              className="w-7 h-7 rounded-lg frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-[12px]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs py-1">
            <div className="p-2.5 rounded-xl bg-[#090d16] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 block">Racha Activa</span>
              <span className="text-sm font-bold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                {currentUser?.streakDays || 14} Días
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090d16] border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 block">Nivel de Bóveda</span>
              <span className="text-sm font-bold text-cyan-300 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                Apex Tier 1
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 border-t border-cyan-500/15">
            {/* Share button in menu */}
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(false);
                setShareModalOpen(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/50 border border-cyan-400/40 text-cyan-200 text-[11.5px] font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compartir App con Amigos</span>
            </button>

            {onOpenGoogleLogin && (
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(false);
                  onOpenGoogleLogin();
                }}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-[11.5px] font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-slate-200"
              >
                <GoogleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{currentUser?.provider === 'gmail' || currentUser?.provider === 'google' ? 'Cambiar Cuenta Google' : 'Continuar con Google'}</span>
              </button>
            )}

            <div className="flex gap-2">
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold hover:bg-cyan-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Usuario / Clave</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="py-2 px-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-[11px] font-bold hover:bg-red-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer if open */}
      {notificationsOpen && (() => {
        const activeWisdom = getWisdomForDate(new Date());
        const dayName = getDayNameSpanish(new Date().getDay());
        return (
          <div className="mx-4 my-2 p-4 rounded-2xl frosted-card border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col gap-2.5 z-30 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                Sabiduría & Notificaciones
              </span>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="w-7 h-7 rounded-lg frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-[12px]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Contextual Millionaire Quote for Current Schedule */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/15 via-[#0b101c] to-cyan-500/10 border border-amber-400/35 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{dayName} • {activeWisdom.slotLabel}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 font-extrabold border border-amber-400/30">
                  {activeWisdom.tag}
                </span>
              </div>
              <p className="text-[12px] font-medium italic text-slate-100 leading-snug">
                {activeWisdom.quote}
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <span className="font-bold text-amber-300">{activeWisdom.author}</span>
                <span className="text-cyan-300 font-semibold">{activeWisdom.habitTitle}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[12px]">
              <div className="p-3 rounded-xl frosted-pill border border-cyan-500/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white block">Momento de Meditación</span>
                  <span className="text-slate-400 text-[11px]">15 min para calmar ondas cerebrales antes de la jornada.</span>
                </div>
              </div>
              <div className="p-3 rounded-xl frosted-pill border border-amber-500/20 flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white block">Aporte a Fondo de Ahorro</span>
                  <span className="text-slate-400 text-[11px]">Meta mensual al 82%. ¡Estás a $550 de tu hito!</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-2 flex flex-col">
        {currentTab === 'hoy' && (
          <HoyTab
            habits={habits}
            goals={goals}
            tasks={tasks}
            onToggleHabit={onToggleHabit}
            onToggleTask={onToggleTask}
            onNavigateToTareas={() => setCurrentTab('tareas')}
            onNavigateToMetas={() => setCurrentTab('metas')}
            onEditHabit={(h) => setEditingHabit(h)}
            onDeleteHabit={(h) => setDeletingItem({ id: h.id, title: h.title, type: 'hábito' })}
            onEditTask={(t) => setEditingTask(t)}
            onDeleteTask={(t) => setDeletingItem({ id: t.id, title: t.title, type: 'tarea' })}
          />
        )}

        {currentTab === 'tareas' && (
          <TareasTab
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onEditTask={(t) => setEditingTask(t)}
            onDeleteTask={(t) => setDeletingItem({ id: t.id, title: t.title, type: 'tarea' })}
          />
        )}

        {currentTab === 'metas' && (
          <MetasTab
            goals={goals}
            onAddNewGoal={onAddNewGoal}
            onQuickProgress={onUpdateGoalProgress}
            onEditGoal={(g) => onEditGoal?.(g.id, g)}
            onDeleteGoal={(g) => setDeletingItem({ id: g.id, title: g.title, type: 'meta' })}
          />
        )}

        {currentTab === 'metricas' && (
          <MetricasTab />
        )}

        {currentTab === 'calendario' && (
          <CalendarioTab
            events={events}
            onAddEvent={onAddEvent || (() => {})}
            onEditEvent={onEditEvent || (() => {})}
            onDeleteEvent={(id) => {
              const ev = events.find((e) => e.id === id);
              if (ev) {
                setDeletingItem({ id: ev.id, title: ev.title, type: 'evento' });
              } else {
                onDeleteEvent?.(id);
              }
            }}
            onToggleEvent={onToggleEvent}
          />
        )}

        {currentTab === 'asistente' && (
          <AsistenteTab
            tasks={tasks}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleTask={onToggleTask}
          />
        )}
      </main>

      {/* Bottom Navigation with 6 Apex Tabs */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(t) => setCurrentTab(t)}
        onOpenZen={onBackToWelcome}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Quick Add Modal */}
      {quickAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md frosted-card sm:rounded-3xl rounded-t-3xl p-5 space-y-4 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-[18px] font-bold text-white tracking-tight">Añadir Nuevo Hábito</h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickAddModalOpen(false)}
                className="w-8 h-8 rounded-full frosted-pill text-slate-400 hover:text-white hover:border-cyan-400/50 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabitSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider" htmlFor="quick-habit-title">
                  Nombre del Hábito
                </label>
                <input
                  id="quick-habit-title"
                  type="text"
                  required
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="Ej. Caminata 20 min, Lectura 15 pág..."
                  className="w-full h-12 px-3.5 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                  Bloque del Día
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewHabitBlock('morning')}
                    className={`py-2.5 px-3 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newHabitBlock === 'morning'
                        ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold'
                        : 'frosted-pill text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Mañana</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewHabitBlock('night')}
                    className={`py-2.5 px-3 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newHabitBlock === 'night'
                        ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                        : 'frosted-pill text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-cyan-400" />
                    <span>Noche</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl btn-cyan-glow font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
              >
                <span>Guardar Hábito</span>
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Hábito */}
      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          isOpen={!!editingHabit}
          onClose={() => setEditingHabit(null)}
          onSave={(id, updated) => {
            onEditHabit?.(id, updated);
            setEditingHabit(null);
          }}
          onDelete={(id) => {
            onDeleteHabit(id);
            setEditingHabit(null);
          }}
        />
      )}

      {/* Modal Editar Tarea */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(id, updated) => {
            onEditTask?.(id, updated);
            setEditingTask(null);
          }}
          onDelete={(id) => {
            onDeleteTask?.(id);
            setEditingTask(null);
          }}
        />
      )}

      {/* Modal Compartir con Amigos */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        currentUserEmail={currentUser?.email}
        onSwitchAccount={onOpenGoogleLogin}
      />

      {/* Modal Confirmar Eliminación Rápida */}
      {deletingItem && (
        <ConfirmDeleteModal
          isOpen={!!deletingItem}
          title={deletingItem.title}
          itemType={deletingItem.type}
          onClose={() => setDeletingItem(null)}
          onConfirm={() => {
            if (deletingItem.type === 'hábito') {
              onDeleteHabit(deletingItem.id);
            } else if (deletingItem.type === 'tarea') {
              onDeleteTask?.(deletingItem.id);
            } else if (deletingItem.type === 'meta') {
              onDeleteGoal?.(deletingItem.id);
            } else if (deletingItem.type === 'evento') {
              onDeleteEvent?.(deletingItem.id);
            }
            setDeletingItem(null);
          }}
        />
      )}
    </div>
  );
}
