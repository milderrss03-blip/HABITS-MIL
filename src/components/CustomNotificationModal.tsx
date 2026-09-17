import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Volume2,
  Bell,
  Sparkles,
  CheckSquare,
  Zap,
  Flame,
  Diamond,
  Briefcase,
  Star,
  Target,
  Palette,
  CheckCircle2,
  Sliders,
  MessageSquare
} from 'lucide-react';
import {
  ReminderSoundType,
  ReminderIconType,
  ReminderColorType,
  REMINDER_SOUND_LABELS,
  REMINDER_COLOR_CONFIG,
  playTaskReminderChime
} from '../utils/taskNotification';
import { triggerTaskReminderTest } from './TaskReminderNotification';
import { DailyTask } from '../types';

interface CustomNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: DailyTask[];
  onSaved?: () => void;
}

export const ICON_OPTIONS: { id: ReminderIconType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'check', label: 'Checklist', icon: CheckSquare },
  { id: 'zap', label: 'Rayo', icon: Zap },
  { id: 'flame', label: 'Fuego', icon: Flame },
  { id: 'diamond', label: 'Diamante', icon: Diamond },
  { id: 'briefcase', label: 'Negocios', icon: Briefcase },
  { id: 'star', label: 'Estrella', icon: Star },
  { id: 'target', label: 'Enfoque', icon: Target },
  { id: 'bell', label: 'Campana', icon: Bell },
];

const PRESET_MESSAGES = [
  '¡Hora de avanzar hacia tu primer millón!',
  '¡La disciplina supera al talento hoy y siempre!',
  '¡Enfoque total! Este bloque define tu día.',
  '¡Construyendo tu imperio paso a paso!',
  '¡Prioridad máxima! Haz que suceda ahora.'
];

export function CustomNotificationModal({
  isOpen,
  onClose,
  tasks = [],
  onSaved
}: CustomNotificationModalProps) {
  // Load saved preferences from localStorage
  const [sound, setSound] = useState<ReminderSoundType>(() => {
    return (localStorage.getItem('habits_mil_reminder_sound') as ReminderSoundType) || 'crystal';
  });

  const [icon, setIcon] = useState<ReminderIconType>(() => {
    return (localStorage.getItem('habits_mil_reminder_icon') as ReminderIconType) || 'check';
  });

  const [color, setColor] = useState<ReminderColorType>(() => {
    return (localStorage.getItem('habits_mil_reminder_color') as ReminderColorType) || 'cyan';
  });

  const [customText, setCustomText] = useState<string>(() => {
    return localStorage.getItem('habits_mil_reminder_custom_text') || '¡Hora de avanzar hacia tu objetivo!';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('habits_mil_reminder_sound', sound);
    localStorage.setItem('habits_mil_reminder_icon', icon);
    localStorage.setItem('habits_mil_reminder_color', color);
    localStorage.setItem('habits_mil_reminder_custom_text', customText);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved?.();
      onClose();
    }, 600);
  };

  const handleTestOnScreen = () => {
    // Play selected sound
    playTaskReminderChime(sound);

    // Find pending task or build demo
    const firstPending = tasks.find(t => !t.completed);
    const demoTask: DailyTask = {
      id: firstPending?.id || 'demo-screen-task',
      title: firstPending?.title || 'Completar hito estratégico y revisión de métricas',
      completed: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: firstPending?.priority || 'urgente',
      category: firstPending?.category || 'trabajo',
      tag: 'Alta Prioridad',
      reminder: true,
      reminderCustomText: customText,
      reminderSound: sound,
      reminderIcon: icon,
      reminderColor: color
    };

    triggerTaskReminderTest(demoTask);
  };

  const currentColorConfig = REMINDER_COLOR_CONFIG[color] || REMINDER_COLOR_CONFIG.cyan;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3">
      <div className="w-full max-w-[395px] max-h-[92vh] bg-gradient-to-b from-[#0c1224] via-[#090d1c] to-[#050813] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_60px_rgba(6,182,212,0.25)] relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 tracking-tight">
                <span>Personalizar Notificación</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  En Celular
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Aparece directamente en la pantalla de este móvil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs select-none">

          {/* 1. Mensaje Personalizado */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mensaje personalizado en la alerta:</span>
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ej: ¡Hora de avanzar hacia tu objetivo!"
              className="w-full h-9 px-3 rounded-xl bg-[#060a14] border border-cyan-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
            />
            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {PRESET_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCustomText(msg)}
                  className={`text-[9.5px] px-2 py-0.5 rounded-lg border transition text-left cursor-pointer ${
                    customText === msg
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-[#080e1e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Selector de Sonido */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Sonido de la alarma en el celular:</span>
              </span>
              <span className="text-[9.5px] text-amber-300 font-mono">
                {REMINDER_SOUND_LABELS[sound].name}
              </span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(REMINDER_SOUND_LABELS) as ReminderSoundType[]).map((sndKey) => {
                const snd = REMINDER_SOUND_LABELS[sndKey];
                const isSelected = sound === sndKey;
                return (
                  <div
                    key={sndKey}
                    onClick={() => {
                      setSound(sndKey);
                      playTaskReminderChime(sndKey);
                    }}
                    className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#060a14] border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{snd.icon}</span>
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-200' : 'text-slate-300'}`}>
                          {snd.name}
                        </span>
                        <span className="text-[9px] text-slate-400">{snd.desc}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSound(sndKey);
                        playTaskReminderChime(sndKey);
                      }}
                      className="p-1 rounded-lg bg-amber-500/20 text-amber-300 hover:text-white hover:bg-amber-500/30 transition cursor-pointer"
                      title="Escuchar sonido"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Selector de Icono */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Icono de tarea en la notificación:</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = icon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIcon(opt.id)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-[#060a14] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[9px] font-medium leading-none">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Color de Acento y Resplandor */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>Color de resplandor:</span>
              </span>
              <span className="text-[9.5px] text-purple-300 font-mono">
                {currentColorConfig.name}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(REMINDER_COLOR_CONFIG) as ReminderColorType[]).map((clrKey) => {
                const cfg = REMINDER_COLOR_CONFIG[clrKey];
                const isSelected = color === clrKey;
                return (
                  <button
                    key={clrKey}
                    type="button"
                    onClick={() => setColor(clrKey)}
                    className={`py-1.5 px-1 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? `bg-white/10 ${cfg.border} text-white ${cfg.glow}`
                        : 'bg-[#060a14] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: cfg.hex.replace('%23', '#') }}
                    />
                    <span className="text-[8.5px] font-medium truncate max-w-full leading-none">
                      {cfg.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Previsualización en Vivo de la Notificación en la Pantalla */}
          <div className="p-3 rounded-2xl bg-[#070e1e] border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-bold text-cyan-300">
                <Smartphone className="w-3 h-3" />
                <span>Vista Previa en Celular</span>
              </span>
              <span className="font-mono text-[9px] text-slate-500">
                9:41 AM • Dynamic Island
              </span>
            </div>

            {/* Mini mockup card */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#0c162d] to-[#091124] border border-cyan-400/40 shadow-md flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl bg-cyan-500/20 border ${currentColorConfig.border} flex items-center justify-center text-cyan-300 flex-shrink-0 ${currentColorConfig.glow}`}>
                {(() => {
                  const CurrentIcon = ICON_OPTIONS.find(o => o.id === icon)?.icon || CheckSquare;
                  return <CurrentIcon className="w-4 h-4 stroke-[2.5]" />;
                })()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-extrabold uppercase text-cyan-300 tracking-wider">
                    Recordatorio de Tarea
                  </span>
                  <span className="text-[8.5px] font-mono text-slate-400">Ahora</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {tasks[0]?.title || 'Hito Estratégico del Día'}
                </div>
                <div className="text-[9px] text-slate-300 italic truncate mt-0.5">
                  "{customText || '¡Hora de avanzar!'}"
                </div>
              </div>
            </div>

            {/* BOTÓN PROBAR DIRECTO EN EL CELULAR */}
            <button
              type="button"
              onClick={handleTestOnScreen}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-400 to-indigo-500 text-slate-950 font-black text-[11px] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Probar Notificación en este Celular</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guardar Ajustes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
