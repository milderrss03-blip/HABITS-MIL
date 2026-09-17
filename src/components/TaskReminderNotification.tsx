import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckSquare,
  Clock,
  Volume2,
  X,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  DollarSign,
  User,
  RotateCcw,
  Smartphone,
  Zap,
  Flame,
  Diamond,
  Star,
  Target,
  Sliders
} from 'lucide-react';
import { DailyTask } from '../types';
import {
  ReminderSoundType,
  ReminderIconType,
  ReminderColorType,
  REMINDER_SOUND_LABELS,
  REMINDER_COLOR_CONFIG,
  playTaskReminderChime,
  triggerSystemTaskNotification,
  requestTaskNotificationPermission,
} from '../utils/taskNotification';
import { CustomNotificationModal, ICON_OPTIONS } from './CustomNotificationModal';

interface TaskReminderNotificationProps {
  tasks: DailyTask[];
  onToggleTask?: (taskId: string) => void;
  onNavigateToTasks?: () => void;
  onOpenCustomizer?: () => void;
}

// Global function to trigger a manual test reminder from any button or component
export function triggerTaskReminderTest(task?: Partial<DailyTask>) {
  const event = new CustomEvent('habits-test-task-reminder', {
    detail: task,
  });
  window.dispatchEvent(event);
}

export function TaskReminderNotification({
  tasks,
  onToggleTask,
  onNavigateToTasks,
  onOpenCustomizer,
}: TaskReminderNotificationProps) {
  // In-app active reminder banner state
  const [activeReminder, setActiveReminder] = useState<{
    task: DailyTask;
    triggeredAt: string;
  } | null>(null);

  // Modal to customize notifications
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Auto-dismiss countdown progress (0 to 100)
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // Track fired task reminders to prevent multi-triggering in the same minute
  const firedRemindersRef = useRef<Set<string>>(new Set());

  // Handle firing a task reminder
  const fireReminder = useCallback((task: DailyTask) => {
    // 1. Resolve custom preferences (from task or localStorage)
    const savedSound = (localStorage.getItem('habits_mil_reminder_sound') as ReminderSoundType) || 'crystal';
    const savedIcon = (localStorage.getItem('habits_mil_reminder_icon') as ReminderIconType) || 'check';
    const savedColor = (localStorage.getItem('habits_mil_reminder_color') as ReminderColorType) || 'cyan';
    const savedText = localStorage.getItem('habits_mil_reminder_custom_text') || '¡Hora de avanzar hacia tu objetivo!';

    const resolvedSound: ReminderSoundType = task.reminderSound || savedSound;
    const resolvedIcon: ReminderIconType = task.reminderIcon || savedIcon;
    const resolvedColor: ReminderColorType = task.reminderColor || savedColor;
    const resolvedText = task.reminderCustomText || savedText;

    const enrichedTask: DailyTask = {
      ...task,
      reminderSound: resolvedSound,
      reminderIcon: resolvedIcon,
      reminderColor: resolvedColor,
      reminderCustomText: resolvedText
    };

    // 2. Play Web Audio Chime
    playTaskReminderChime(resolvedSound);

    // 3. Fire System / Mobile Push Notification
    triggerSystemTaskNotification(enrichedTask);

    // 4. Display in-app mobile phone heads-up card
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActiveReminder({
      task: enrichedTask,
      triggeredAt: nowStr,
    });
    setProgress(100);
  }, []);

  // Countdown timer to auto-dismiss
  useEffect(() => {
    if (!activeReminder || isPaused) return;

    const duration = 9000; // 9 seconds
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          setActiveReminder(null);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeReminder, isPaused]);

  // Background interval: checks pending tasks against current time (HH:MM)
  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeKey = `${currentHours}:${currentMins}`;
      const todayDateKey = now.toISOString().split('T')[0];

      tasks.forEach((t) => {
        if (t.completed) return;
        if (!t.time) return;
        if (t.reminder === false) return;

        // Clean time format like "09:00", "9:00", etc.
        const [tH, tM] = t.time.split(':');
        if (!tH || !tM) return;
        const normalizedTaskTime = `${tH.trim().padStart(2, '0')}:${tM.trim().padStart(2, '0')}`;

        // Verify date matching
        if (t.date && t.date !== todayDateKey) return;

        // Unique key for this minute trigger
        const reminderKey = `${t.id}-${todayDateKey}-${currentTimeKey}`;

        if (normalizedTaskTime === currentTimeKey && !firedRemindersRef.current.has(reminderKey)) {
          firedRemindersRef.current.add(reminderKey);
          fireReminder(t);
        }
      });
    };

    const interval = setInterval(checkTasks, 15000); // check every 15s
    return () => clearInterval(interval);
  }, [tasks, fireReminder]);

  // Expose global manual test event listener
  useEffect(() => {
    const handleManualTest = (e: CustomEvent<DailyTask | undefined>) => {
      const taskToTest: DailyTask = e.detail || {
        id: 'test-reminder-task',
        title: 'Revisión Estratégica y Métricas Clave',
        completed: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: 'urgente',
        category: 'trabajo',
        tag: 'Alta Prioridad',
        reminder: true,
      };
      fireReminder(taskToTest);
    };

    window.addEventListener('habits-test-task-reminder' as any, handleManualTest as any);
    return () => {
      window.removeEventListener('habits-test-task-reminder' as any, handleManualTest as any);
    };
  }, [fireReminder]);

  // Handle Snooze (+5 minutes)
  const handleSnooze = () => {
    if (!activeReminder) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const snoozedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setActiveReminder(null);
    // Trigger again in 5 minutes
    setTimeout(() => {
      fireReminder({
        ...activeReminder.task,
        time: snoozedTime,
      });
    }, 5 * 60 * 1000);
  };

  // Resolve Icon Component for the reminder
  const getIconComponent = (iconId?: ReminderIconType) => {
    const found = ICON_OPTIONS.find((o) => o.id === iconId);
    return found ? found.icon : CheckSquare;
  };

  const currentTask = activeReminder?.task;
  const isUrgent = currentTask?.priority === 'urgente';

  // Resolved colors
  const activeColorKey: ReminderColorType = currentTask?.reminderColor || (isUrgent ? 'rose' : 'cyan');
  const colorCfg = REMINDER_COLOR_CONFIG[activeColorKey] || REMINDER_COLOR_CONFIG.cyan;
  const ActiveIconComp = getIconComponent(currentTask?.reminderIcon);

  return (
    <>
      {/* Dynamic Notification on the Mobile Screen */}
      {activeReminder && currentTask && (
        <div
          className="sticky top-2 z-50 px-2.5 mx-auto w-full max-w-[395px] pointer-events-auto transition-all duration-300 animate-in slide-in-from-top-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Simulated Mobile Dynamic Island / Heads-Up Push Notification */}
          <div
            className={`relative overflow-hidden rounded-[26px] p-3.5 backdrop-blur-2xl border shadow-[0_12px_45px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#0e1628]/98 via-[#090e1c]/98 to-[#050812]/98 ${colorCfg.border} ${colorCfg.glow}`}
          >
            {/* Top Phone Dynamic Island Capsule */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1 font-mono">
                  <span>HÁBITOS MILLONARIOS</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-300">AHORA</span>
                </span>
              </div>

              {/* Status Time & Sound replay */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => playTaskReminderChime(currentTask.reminderSound || 'crystal')}
                  className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                  title="Volver a escuchar sonido"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReminder(null)}
                  className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Cerrar notificación"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Notification Core Content */}
            <div className="flex items-start gap-3">
              {/* Glowing Icon Container */}
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-2xl border ${colorCfg.border} ${colorCfg.glow} bg-white/5 flex-shrink-0`}
              >
                <ActiveIconComp className="w-5 h-5 text-white stroke-[2.5]" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#090e1c] flex items-center justify-center">
                  <CheckCircle2 className="w-2 h-2 text-slate-950 stroke-[3]" />
                </span>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 truncate">
                    {currentTask.category} • {currentTask.priority}
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white font-bold flex-shrink-0">
                    {currentTask.time || activeReminder.triggeredAt}
                  </span>
                </div>

                {/* Task Title */}
                <h4 className="text-[13.5px] font-black text-white tracking-tight leading-snug truncate mt-0.5">
                  {currentTask.title}
                </h4>

                {/* Custom Personalized Phrase */}
                {currentTask.reminderCustomText && (
                  <p className="text-[10px] text-amber-300/90 font-medium italic truncate mt-0.5 flex items-center gap-1">
                    <span>💡</span>
                    <span>"{currentTask.reminderCustomText}"</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons on the Mobile Screen */}
            <div className="flex items-center gap-1.5 pt-2.5 mt-2 border-t border-white/10">
              {onToggleTask && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleTask(currentTask.id);
                    setActiveReminder(null);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[11px] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Hecho</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSnooze}
                className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-bold text-[10.5px] active:scale-95 transition flex items-center gap-1 cursor-pointer"
                title="Posponer 5 minutos"
              >
                <Clock className="w-3 h-3 text-cyan-300" />
                <span>+5m</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveReminder(null);
                  setIsCustomizeOpen(true);
                }}
                className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-[10.5px] active:scale-95 transition flex items-center gap-1 cursor-pointer"
                title="Personalizar esta notificación"
              >
                <Sliders className="w-3 h-3" />
                <span>Personalizar</span>
              </button>
            </div>

            {/* Progress Bar Timer */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal to customize notifications anytime */}
      <CustomNotificationModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        tasks={tasks}
      />
    </>
  );
}
