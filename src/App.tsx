import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Monitor, Sparkles, CheckCircle2, Database, Cloud, Share2 } from 'lucide-react';
import { Habit, Goal, DailyTask, ActiveScreen, UserProfile, CalendarEvent } from './types';
import { INITIAL_HABITS, INITIAL_GOALS, INITIAL_TASKS, INITIAL_EVENTS } from './data/initialData';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { LoginModal } from './components/LoginModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ShareModal } from './components/ShareModal';
import { GoogleIcon } from './components/GoogleIcon';
import {
  syncUserProfileToFirestore,
  subscribeToUserHabits,
  saveHabitToFirestore,
  deleteHabitFromFirestore,
  subscribeToUserTasks,
  saveTaskToFirestore,
  deleteTaskFromFirestore,
  subscribeToUserGoals,
  saveGoalToFirestore,
  deleteGoalFromFirestore,
  subscribeToUserEvents,
  saveEventToFirestore,
  deleteEventFromFirestore
} from './services/firestoreService';

const STORAGE_KEY_HABITS = 'habits_mil_habits_v2';
const STORAGE_KEY_GOALS = 'habits_mil_goals_v2';
const STORAGE_KEY_TASKS = 'habits_mil_tasks_v2';
const STORAGE_KEY_EVENTS = 'habits_mil_events_v2';
const STORAGE_KEY_USER = 'habits_mil_user_v1';

export default function App() {
  const [screen, setScreen] = useState<ActiveScreen>('welcome');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User session state - starts completely from zero (null) until user logs in
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isAuthenticated && parsed?.email && parsed.id !== 'usr-apex-01' && parsed.id !== 'usr-milder-01') {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Load persistent state or fall back to defaults
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HABITS);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch {
      // ignore
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Real-time Firestore sync when a user is authenticated
  useEffect(() => {
    if (!currentUser?.id) return;

    // Sync user profile
    syncUserProfileToFirestore(currentUser);

    // Subscribe to Habits
    const unsubHabits = subscribeToUserHabits(currentUser.id, (remoteHabits) => {
      if (remoteHabits && remoteHabits.length > 0) {
        setHabits(remoteHabits);
      }
    });

    // Subscribe to Tasks
    const unsubTasks = subscribeToUserTasks(currentUser.id, (remoteTasks) => {
      if (remoteTasks && remoteTasks.length > 0) {
        setTasks(remoteTasks);
      }
    });

    // Subscribe to Goals
    const unsubGoals = subscribeToUserGoals(currentUser.id, (remoteGoals) => {
      if (remoteGoals && remoteGoals.length > 0) {
        setGoals(remoteGoals);
      }
    });

    // Subscribe to Events
    const unsubEvents = subscribeToUserEvents(currentUser.id, (remoteEvents) => {
      if (remoteEvents && remoteEvents.length > 0) {
        setEvents(remoteEvents);
      }
    });

    return () => {
      unsubHabits();
      unsubTasks();
      unsubGoals();
      unsubEvents();
    };
  }, [currentUser?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setScreen('dashboard');
    syncUserProfileToFirestore(user);
    showToast(`¡Sesión iniciada con éxito! Bienvenido, ${user.fullName}`);
  };

  const handleGoogleSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsGoogleAuthOpen(false);
    setIsLoginModalOpen(false);
    setScreen('dashboard');
    syncUserProfileToFirestore(user);
    const providerLabel = user.provider === 'gmail' ? 'Gmail' : 'Google';
    showToast(`¡Conectado con ${providerLabel}! Sincronizado con Firebase Cloud`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('welcome');
    showToast('Has cerrado sesión correctamente');
  };

  // Handlers
  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const willComplete = !h.completed;
          const updatedHabit: Habit = {
            ...h,
            completed: willComplete,
            streak: willComplete ? h.streak + 1 : Math.max(1, h.streak - 1)
          };
          if (currentUser?.id) {
            saveHabitToFirestore(currentUser.id, updatedHabit);
          }
          return updatedHabit;
        }
        return h;
      })
    );
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, completed: !t.completed };
          if (currentUser?.id) {
            saveTaskToFirestore(currentUser.id, updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'completed' | 'streak'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `custom-${Date.now()}`,
      completed: false,
      streak: 1
    };
    setHabits((prev) => [...prev, newHabit]);
    if (currentUser?.id) {
      saveHabitToFirestore(currentUser.id, newHabit);
    }
    showToast(`Hábito añadido y guardado en Firestore: "${newHabitData.title}"`);
  };

  const handleDeleteHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    if (currentUser?.id) {
      deleteHabitFromFirestore(id);
    }
    showToast(habit ? `Hábito "${habit.title}" eliminado` : 'Hábito eliminado');
  };

  const handleEditHabit = (id: string, updated: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const full = { ...h, ...updated };
          if (currentUser?.id) {
            saveHabitToFirestore(currentUser.id, full);
          }
          return full;
        }
        return h;
      })
    );
    showToast('Hábito actualizado con éxito');
  };

  const handleAddTask = (taskData: string | Omit<DailyTask, 'id' | 'completed'>) => {
    const newTask: DailyTask =
      typeof taskData === 'string'
        ? {
            id: `task-${Date.now()}`,
            title: taskData,
            completed: false,
            priority: 'normal',
            category: 'trabajo'
          }
        : {
            ...taskData,
            id: `task-${Date.now()}`,
            completed: false
          };
    setTasks((prev) => [newTask, ...prev]);
    if (currentUser?.id) {
      saveTaskToFirestore(currentUser.id, newTask);
    }
    showToast(`Tarea guardada en la base de datos: "${newTask.title}"`);
  };

  const handleEditTask = (id: string, updated: Partial<DailyTask>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const full = { ...t, ...updated };
          if (currentUser?.id) {
            saveTaskToFirestore(currentUser.id, full);
          }
          return full;
        }
        return t;
      })
    );
    showToast('Tarea actualizada con éxito');
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (currentUser?.id) {
      deleteTaskFromFirestore(id);
    }
    showToast(task ? `Tarea "${task.title}" eliminada` : 'Tarea eliminada');
  };

  const handleUpdateGoalProgress = (id: string, increment: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newCurrent = Math.min(g.target * 1.5, Math.round((g.current + increment) * 10) / 10);
          const updated: Goal = {
            ...g,
            current: newCurrent,
            badge: increment > 0 ? `+${g.prefix}${increment}${g.unit} hoy` : g.badge
          };
          if (currentUser?.id) {
            saveGoalToFirestore(currentUser.id, updated);
          }
          return updated;
        }
        return g;
      })
    );
  };

  const handleAddNewGoal = (newGoalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `goal-${Date.now()}`
    };
    setGoals((prev) => [...prev, newGoal]);
    if (currentUser?.id) {
      saveGoalToFirestore(currentUser.id, newGoal);
    }
    showToast(`Meta guardada en base de datos: "${newGoalData.title}"`);
  };

  const handleEditGoal = (id: string, updated: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const full = { ...g, ...updated };
          if (currentUser?.id) {
            saveGoalToFirestore(currentUser.id, full);
          }
          return full;
        }
        return g;
      })
    );
    showToast('Meta actualizada con éxito');
  };

  const handleDeleteGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (currentUser?.id) {
      deleteGoalFromFirestore(id);
    }
    showToast(goal ? `Meta "${goal.title}" eliminada` : 'Meta eliminada');
  };

  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `ev-${Date.now()}`
    };
    setEvents((prev) => [newEvent, ...prev]);
    if (currentUser?.id) {
      saveEventToFirestore(currentUser.id, newEvent);
    }
    showToast(`Evento añadido a Firebase: "${newEvent.title}"`);
  };

  const handleEditEvent = (id: string, updated: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          const full = { ...ev, ...updated };
          if (currentUser?.id) {
            saveEventToFirestore(currentUser.id, full);
          }
          return full;
        }
        return ev;
      })
    );
    showToast('Evento actualizado con éxito');
  };

  const handleDeleteEvent = (id: string) => {
    const ev = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (currentUser?.id) {
      deleteEventFromFirestore(id);
    }
    showToast(ev ? `Evento "${ev.title}" eliminado` : 'Evento eliminado');
  };

  const handleToggleEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          const updated = { ...ev, completed: !ev.completed };
          if (currentUser?.id) {
            saveEventToFirestore(currentUser.id, updated);
          }
          return updated;
        }
        return ev;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      {/* Platform-wide Cosmic Background Glows */}
      <div className="absolute -top-40 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-cyan-600/15 via-blue-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 z-50 px-4 py-2 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Helper Bar with screen switcher & view mode */}
      <div className="w-full max-w-[480px] hidden sm:flex items-center justify-between px-3 py-2 text-xs text-slate-400 mb-2 relative z-30">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-semibold">HÁBITS MIL</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-400">Cinematic Wisdom</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0f1422]/90 backdrop-blur-md p-1 rounded-xl border border-cyan-500/20">
          <button
            onClick={() => setScreen('welcome')}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
              screen === 'welcome'
                ? 'bg-cyan-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bienvenida
          </button>
          <button
            onClick={() => setScreen('dashboard')}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
              screen === 'dashboard'
                ? 'bg-cyan-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard Hoy
          </button>
          <button
            onClick={() => setIsGoogleAuthOpen(true)}
            className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white text-slate-900 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 shadow-sm"
            title="Continuar con Google"
          >
            <GoogleIcon className="w-2.5 h-2.5" />
            <span>Google</span>
          </button>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-cyan-300 hover:text-white hover:bg-cyan-900/30 transition cursor-pointer"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-300 hover:text-cyan-300 hover:bg-cyan-900/20 transition cursor-pointer flex items-center gap-1"
            title="Compartir con amigos"
          >
            <Share2 className="w-2.5 h-2.5 text-cyan-400" />
            <span>Compartir</span>
          </button>
          <span className="w-px h-3 bg-[#1f2942] mx-0.5" />
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 transition cursor-pointer"
            title={isMobileFrame ? 'Cambiar a vista expandida' : 'Cambiar a marco móvil iPhone (390px)'}
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Main Container - Supports Simulated iPhone Mobile Frame (390px) as requested or Expanded */}
      <main
        className={`w-full transition-all duration-300 relative bg-[#070a11] ${
          isMobileFrame
            ? 'max-w-[390px] min-h-screen sm:min-h-[844px] sm:max-h-[860px] sm:rounded-[44px] sm:border sm:border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.18)] overflow-hidden'
            : 'max-w-2xl min-h-screen sm:min-h-[844px] sm:rounded-3xl sm:border sm:border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.18)] overflow-hidden'
        }`}
      >
        <AnimatePresence mode="wait">
          {screen === 'welcome' ? (
            <motion.div
              key="screen-welcome"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <WelcomeScreen
                onEnter={() => setScreen('dashboard')}
                onSkip={() => setScreen('dashboard')}
                onAdoptHabit={handleAddHabit}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onOpenGoogleLogin={() => setIsGoogleAuthOpen(true)}
                onOpenShare={() => setIsShareModalOpen(true)}
                currentUser={currentUser}
              />
            </motion.div>
          ) : (
            <motion.div
              key="screen-dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <DashboardScreen
                onBackToWelcome={() => setScreen('welcome')}
                habits={habits}
                goals={goals}
                tasks={tasks}
                events={events}
                onToggleHabit={handleToggleHabit}
                onToggleTask={handleToggleTask}
                onAddHabit={handleAddHabit}
                onEditHabit={handleEditHabit}
                onDeleteHabit={handleDeleteHabit}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onUpdateGoalProgress={handleUpdateGoalProgress}
                onAddNewGoal={handleAddNewGoal}
                onEditGoal={handleEditGoal}
                onDeleteGoal={handleDeleteGoal}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onToggleEvent={handleToggleEvent}
                currentUser={currentUser}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onOpenGoogleLogin={() => setIsGoogleAuthOpen(true)}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Animated Biometric & Password Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenGoogle={() => {
          setIsLoginModalOpen(false);
          setIsGoogleAuthOpen(true);
        }}
        currentUser={currentUser}
      />

      {/* High-Performance Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        onGoogleSuccess={handleGoogleSuccess}
        currentUser={currentUser}
      />

      {/* Share with Friends Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentUserEmail={currentUser?.email}
        onSwitchAccount={() => {
          setIsShareModalOpen(false);
          setIsGoogleAuthOpen(true);
        }}
      />
    </div>
  );
}
