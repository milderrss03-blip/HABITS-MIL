import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Sparkles,
  Clock,
  RefreshCw,
  X,
  Plus,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Bell,
  BellRing,
  Play,
  Pause,
  Zap,
  Timer,
  Pin,
  PinOff
} from 'lucide-react';
import {
  MillionaireWisdomItem,
  getWisdomForDate,
  getRandomWisdom,
  getDayNameSpanish,
  getDayContext
} from '../data/millionaireWisdom';
import { binauralSound } from '../utils/audio';
import { Habit } from '../types';

interface MillionaireWisdomNotificationProps {
  onAddHabit?: (habit: Omit<Habit, 'id' | 'completed' | 'streak'>) => void;
  onShowToast?: (message: string) => void;
}

const DEFAULT_INTERVAL_MINUTES = 60;
const DEFAULT_AUTO_DISMISS_SECONDS = 1;

export function MillionaireWisdomNotification({
  onAddHabit,
  onShowToast
}: MillionaireWisdomNotificationProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentWisdom, setCurrentWisdom] = useState<MillionaireWisdomItem>(() =>
    getWisdomForDate(new Date())
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // 1-second visibility auto-dismiss state
  const [visibleDurationSeconds, setVisibleDurationSeconds] = useState<number>(DEFAULT_AUTO_DISMISS_SECONDS);
  const [dismissTimeLeft, setDismissTimeLeft] = useState<number>(DEFAULT_AUTO_DISMISS_SECONDS);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  // 1-hour (60 min) auto appearance timer state
  const [intervalMinutes, setIntervalMinutes] = useState<number>(DEFAULT_INTERVAL_MINUTES);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(DEFAULT_INTERVAL_MINUTES * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [browserNotificationStatus, setBrowserNotificationStatus] = useState<NotificationPermission | 'unsupported'>('default');

  const currentWisdomIdRef = useRef<string>(currentWisdom.id);
  currentWisdomIdRef.current = currentWisdom.id;

  // Check browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserNotificationStatus(Notification.permission);
    } else {
      setBrowserNotificationStatus('unsupported');
    }
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setBrowserNotificationStatus(permission);
        if (permission === 'granted') {
          onShowToast?.('🔔 Notificaciones del sistema activadas cada 1 hora');
          binauralSound.playChime();
        }
      } catch (err) {
        console.error('Error requesting notification permission:', err);
      }
    }
  };

  // 1-second visibility auto-dismiss timer countdown
  useEffect(() => {
    if (!isOpen || isPinned) return;

    const stepMs = 100;
    const timer = setInterval(() => {
      // Pause 1s countdown when cursor is over the card so the user can comfortably interact if hovered
      if (isHovered) return;

      setDismissTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setIsOpen(false);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isOpen, isPinned, isHovered, visibleDurationSeconds]);

  // Trigger next wisdom (every 1 hour or on demand)
  const triggerNextWisdom = useCallback((isAutomatic = false) => {
    binauralSound.playChime();
    const next = getRandomWisdom(currentWisdomIdRef.current);
    setCurrentWisdom(next);
    setAdded(false);
    setCopied(false);

    // Make visible for exactly 1 second
    setIsOpen(true);
    setIsMinimized(false);
    setDismissTimeLeft(visibleDurationSeconds);

    // Pulse highlight effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 1200);

    // Native browser notification if allowed
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`👑 ${next.author} • Hábito Millonario (${next.tag})`, {
          body: `${next.quote}\n\n🎯 Hábito Clave: ${next.habitTitle} (${next.suggestedDuration})`,
          icon: '/favicon.ico',
          silent: true
        });
      } catch {
        // Ignore native notification errors
      }
    }

    if (isAutomatic) {
      onShowToast?.(`👑 Frase Millonaria (visible 1s): ${next.author}`);
    }
  }, [visibleDurationSeconds, onShowToast]);

  // Main countdown effect for every second
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          // Time expired! Trigger next wisdom and reset timer
          triggerNextWisdom(true);
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, intervalMinutes, triggerNextWisdom]);

  // Update real-time clock every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown mm:ss
  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time (e.g. "06:42 AM")
  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const dayName = getDayNameSpanish(currentDate.getDay());
  const dayTheme = getDayContext(currentDate.getDay());

  // Handle Shuffle manual
  const handleShuffle = () => {
    triggerNextWisdom(false);
    setTimeLeftSeconds(intervalMinutes * 60);
  };

  // Open notification manually with 5-second countdown
  const handleOpenNotification = () => {
    setDismissTimeLeft(visibleDurationSeconds);
    setIsOpen(true);
    setIsMinimized(false);
    binauralSound.playChime();
  };

  // Handle Copy
  const handleCopyQuote = async () => {
    try {
      const textToCopy = `${currentWisdom.quote} — ${currentWisdom.author}\n\nHábito Millonario: ${currentWisdom.habitTitle}\n${currentWisdom.habitDescription}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onShowToast?.('Frase y hábito millonario copiados al portapapeles');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle Add Habit to the User's Real Habits
  const handleAddAsHabit = () => {
    if (!onAddHabit) return;
    binauralSound.playChime();
    onAddHabit({
      title: currentWisdom.suggestedHabitName,
      subtitle: `Hábito de ${currentWisdom.author} (${currentWisdom.suggestedDuration})`,
      category: currentWisdom.suggestedHabitCategory,
      timeBlock: currentWisdom.slot === 'evening' || currentWisdom.slot === 'night' ? 'night' : 'morning',
      icon: currentWisdom.slot === 'evening' || currentWisdom.slot === 'night' ? 'nights_stay' : 'wb_sunny'
    });
    setAdded(true);
    onShowToast?.(`¡Hábito millonario añadido a tu lista: "${currentWisdom.suggestedHabitName}"!`);
  };

  // Percentage for the 30-min timer progress bar
  const progressPercent = Math.max(
    0,
    Math.min(100, (1 - timeLeftSeconds / (intervalMinutes * 60)) * 100)
  );

  // Percentage for the 5-second visibility progress bar
  const dismissPercent = Math.max(
    0,
    Math.min(100, (dismissTimeLeft / visibleDurationSeconds) * 100)
  );

  return (
    <>
      {/* Floating Widget Container: Placed in the upper right corner, slightly below the header where there is clean space */}
      <div className="fixed top-20 right-3 sm:top-24 sm:right-6 lg:right-8 z-50 max-w-[92vw] sm:max-w-[400px] pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Minimized Floating Trigger Pill with 30-min Countdown */
            <motion.button
              key="minimized-pill"
              initial={{ scale: 0.8, opacity: 0, y: -16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -16 }}
              onClick={handleOpenNotification}
              className="relative overflow-hidden flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-[#0d1424]/95 to-cyan-500/25 border border-amber-400/50 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.28)] backdrop-blur-xl hover:border-amber-300 hover:scale-[1.02] active:scale-95 transition cursor-pointer group"
            >
              {/* Mini progress bar on bottom edge */}
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />

              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-inner group-hover:rotate-12 transition-transform flex-shrink-0">
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Frases Millonarias
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-200 font-bold border border-amber-400/30">
                    1s
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                  <span>{dayName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-300 flex items-center gap-1 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {formatCountdown(timeLeftSeconds)}
                  </span>
                </div>
              </div>
            </motion.button>
          ) : (
            /* Full Floating Notification Card with 1-Second Auto-Dismiss */
            <motion.div
              key="floating-card"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                boxShadow: isFlashing
                  ? '0 0 50px rgba(245, 158, 11, 0.45), 0 0 30px rgba(6, 182, 212, 0.4)'
                  : '0 10px 40px rgba(0,0,0,0.7), 0 0 30px rgba(245,158,11,0.15)'
              }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`relative overflow-hidden rounded-3xl bg-[#090e1a]/95 border transition-colors duration-500 backdrop-blur-2xl ${
                isFlashing
                  ? 'border-amber-300 ring-2 ring-amber-400/50'
                  : 'border-amber-500/35'
              }`}
            >
              {/* 1-Second Visibility Drain Bar */}
              {!isPinned && (
                <div className="h-1 w-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 transition-all duration-100 ease-linear"
                    style={{ width: `${dismissPercent}%` }}
                  />
                </div>
              )}
              {isPinned && (
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-500" />
              )}

              {/* Dynamic 1-Hour Cycle Progress Bar */}
              <div className="h-0.5 w-full bg-white/5 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 1-Second Notice & Pin Bar */}
              <div className="px-3.5 py-1 bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-cyan-500/15 border-b border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
                  <span className="font-semibold text-amber-200">
                    {isPinned ? 'Fijado en pantalla' : isHovered ? 'Pausado (leyendo...)' : 'Visible por 1 segundo:'}
                  </span>
                  {!isPinned && (
                    <span className="font-mono font-black text-amber-300 bg-amber-500/25 px-1.5 py-0.2 rounded border border-amber-400/40 text-[10px]">
                      {dismissTimeLeft > 0 ? `${dismissTimeLeft.toFixed(1)}s` : '0.0s'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer ${
                      isPinned
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={isPinned ? 'Desanclar (auto-ocultar en 1 segundo)' : 'Fijar en pantalla (sin auto-ocultar)'}
                  >
                    {isPinned ? <PinOff className="w-2.5 h-2.5" /> : <Pin className="w-2.5 h-2.5" />}
                    <span>{isPinned ? 'Fijado' : 'Fijar'}</span>
                  </button>
                </div>
              </div>

              {/* Card Header */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm flex-shrink-0">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-black tracking-tight text-amber-300 uppercase">
                        Sabiduría de Millonarios
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-200 font-bold">
                        {currentWisdom.tag}
                      </span>
                    </div>

                    {/* Live Day & Schedule context */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate mt-0.5">
                      <Clock className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span className="text-cyan-300 font-semibold">{dayName}, {formattedTime}</span>
                      <span className="text-slate-600">•</span>
                      <span className="truncate text-slate-300 font-medium">{currentWisdom.slotLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 pl-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="w-7 h-7 rounded-xl frosted-pill border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20 flex items-center justify-center transition active:scale-90 cursor-pointer"
                    title="Rotar frase ahora (reinicia 1s)"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-7 h-7 rounded-xl frosted-pill border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                    title={isMinimized ? 'Expandir' : 'Minimizar'}
                  >
                    {isMinimized ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-xl frosted-pill border border-slate-700 text-slate-400 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
                    title="Cerrar (reaparecerá en la próxima hora)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1-Hour Cycle Bar (Countdown & Frequency control) */}
              <div className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/15 via-cyan-950/40 to-slate-900 border-b border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-amber-200 font-medium">
                  <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Aparece cada {intervalMinutes >= 60 ? `${intervalMinutes / 60}h` : `${intervalMinutes}m`}:</span>
                  <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {formatCountdown(timeLeftSeconds)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Test button to immediately see the 1-hour appearance */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerNextWisdom(false);
                      setTimeLeftSeconds(intervalMinutes * 60);
                      onShowToast?.('⚡ Probando rotación de frase (visible 1 segundo)');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer text-[9px]"
                    title="Probar rotación instantánea de frase y hábito"
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span>Probar</span>
                  </button>

                  {/* Pause / Resume auto-timer */}
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                    title={isTimerRunning ? 'Pausar ciclo de 1 hora' : 'Reanudar ciclo de 1 hora'}
                  >
                    {isTimerRunning ? (
                      <Pause className="w-3 h-3 text-slate-400 hover:text-amber-300" />
                    ) : (
                      <Play className="w-3 h-3 text-emerald-400" />
                    )}
                  </button>

                  {/* Interval selector dropdown / toggle */}
                  <select
                    value={intervalMinutes}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setIntervalMinutes(val);
                      setTimeLeftSeconds(val * 60);
                      onShowToast?.(`Frecuencia actualizada a ${val >= 60 ? `${val / 60} hora` : `${val} minutos`}`);
                    }}
                    className="bg-[#0b1220] border border-white/10 rounded-lg text-[9px] text-cyan-300 px-1.5 py-0.5 focus:outline-none cursor-pointer"
                    title="Intervalo de rotación"
                  >
                    <option value={60}>1 hora (Predeterminado)</option>
                    <option value={30}>30 min</option>
                    <option value={15}>15 min</option>
                    <option value={5}>5 min</option>
                    <option value={1}>1 min (Frecuente)</option>
                  </select>
                </div>
              </div>

              {/* Day Theme Banner */}
              <div className="px-4 py-1.5 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-transparent flex items-center justify-between text-[10px] text-amber-200/90 font-medium border-b border-white/5">
                <div className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{dayTheme}</span>
                </div>

                {/* System Browser Notification button */}
                {browserNotificationStatus !== 'granted' && browserNotificationStatus !== 'unsupported' && (
                  <button
                    type="button"
                    onClick={requestNotificationPermission}
                    className="flex-shrink-0 text-[9px] text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 cursor-pointer"
                    title="Recibir notificaciones del navegador incluso si cambias de pestaña"
                  >
                    <Bell className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Activar avisos</span>
                  </button>
                )}
                {browserNotificationStatus === 'granted' && (
                  <span className="flex-shrink-0 text-[9px] text-emerald-400 flex items-center gap-0.5">
                    <BellRing className="w-2.5 h-2.5" />
                    <span>Avisos PC</span>
                  </span>
                )}
              </div>

              {/* Main Body (Collapsible) */}
              {!isMinimized && (
                <div className="p-4 flex flex-col gap-3">
                  {/* Quote Box */}
                  <div className="relative pl-3 border-l-2 border-amber-400/60 py-0.5">
                    <p className="text-[13px] sm:text-[14px] leading-snug font-medium text-slate-100 italic">
                      {currentWisdom.quote}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-bold text-amber-300">
                        {currentWisdom.author}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        • {currentWisdom.role}
                      </span>
                    </div>
                  </div>

                  {/* Habit Section */}
                  <div className="rounded-2xl bg-cyan-950/30 border border-cyan-500/25 p-3 flex flex-col gap-1.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                        <span className="text-[11px] font-black tracking-tight text-cyan-300 uppercase">
                          Hábito Clave: {currentWisdom.habitTitle}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/20">
                        {currentWisdom.suggestedDuration}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {currentWisdom.habitDescription}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={handleAddAsHabit}
                      disabled={added}
                      className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer ${
                        added
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 cursor-default'
                          : 'btn-cyan-glow text-slate-900 font-extrabold'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¡Hábito Añadido!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Añadir a mis Hábitos</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyQuote}
                      className="px-3 py-2 rounded-xl frosted-pill border border-slate-700 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 text-[11px] font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                      title="Copiar frase al portapapeles"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px]">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px]">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

