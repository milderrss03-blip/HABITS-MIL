import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  CheckSquare,
  Save,
  Trash2,
  Clock,
  Tag,
  Calendar,
  Bell,
  Volume2,
  Sliders,
  Sparkles,
  MessageSquare,
  Smartphone,
  Palette
} from 'lucide-react';
import { DailyTask } from '../types';
import { triggerTaskReminderTest } from './TaskReminderNotification';
import {
  ReminderSoundType,
  ReminderIconType,
  ReminderColorType,
  REMINDER_SOUND_LABELS,
  REMINDER_COLOR_CONFIG,
  playTaskReminderChime
} from '../utils/taskNotification';
import { ICON_OPTIONS } from './CustomNotificationModal';

interface EditTaskModalProps {
  task: DailyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<DailyTask>) => void;
  onDelete?: (id: string) => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete
}: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'urgente' | 'normal'>('normal');
  const [category, setCategory] = useState<'trabajo' | 'finanzas' | 'personal'>('trabajo');
  const [tag, setTag] = useState('');
  const [reminder, setReminder] = useState(true);
  const [reminderCustomText, setReminderCustomText] = useState('');
  const [reminderSound, setReminderSound] = useState<ReminderSoundType>('crystal');
  const [reminderIcon, setReminderIcon] = useState<ReminderIconType>('check');
  const [reminderColor, setReminderColor] = useState<ReminderColorType>('cyan');
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(task.date || '');
      setTime(task.time || '');
      setPriority(task.priority);
      setCategory(task.category);
      setTag(task.tag || '');
      setReminder(task.reminder ?? true);
      setReminderCustomText(task.reminderCustomText || '');
      setReminderSound(task.reminderSound || 'crystal');
      setReminderIcon(task.reminderIcon || 'check');
      setReminderColor(task.reminderColor || 'cyan');
      setShowCustomizer(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(task.id, {
      title: title.trim(),
      date: date.trim() ? date.trim() : undefined,
      time: time.trim() ? time.trim() : undefined,
      priority,
      category,
      tag: tag.trim() ? tag.trim() : undefined,
      reminder,
      reminderCustomText: reminderCustomText.trim() ? reminderCustomText.trim() : undefined,
      reminderSound,
      reminderIcon,
      reminderColor
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0a0f1d] border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Editar Tarea</h3>
              <p className="text-[10px] text-cyan-400 font-mono">Actualizar pendiente o entrega</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Título */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Descripción de la tarea
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Revisar estados financieros"
              className="w-full h-9.5 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Nivel de prioridad
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'normal'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Normal</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('urgente')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'urgente'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🔥 Urgente</span>
              </button>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'trabajo', label: 'Trabajo' },
                { id: 'finanzas', label: 'Finanzas' },
                { id: 'personal', label: 'Personal' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as typeof category)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition capitalize cursor-pointer ${
                    category === cat.id
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50'
                      : 'bg-[#070a12] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha, Horario & Etiqueta */}
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Fecha asignada</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Hora límite</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ej. 16:30 hrs"
                className="w-full h-9 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Etiqueta</span>
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Ej. +$5K o Clave"
                className="w-full h-9 px-3 rounded-xl bg-[#070a12] border border-cyan-500/25 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Notificación & Recordatorio Personalizado en Móvil */}
          <div className="p-3 rounded-2xl bg-[#071329]/90 border border-cyan-500/35 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
                    <span>Alerta en este Celular</span>
                    {reminder && (
                      <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-cyan-500/25 text-cyan-200 font-extrabold border border-cyan-400/30">
                        Personalizada
                      </span>
                    )}
                  </span>
                  <span className="text-[9.5px] text-slate-400">
                    Sale en la pantalla del móvil con sonido & vibración
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    triggerTaskReminderTest({
                      ...task,
                      title: title || task.title,
                      time: time || task.time,
                      priority,
                      category,
                      tag: tag || task.tag,
                      reminderCustomText,
                      reminderSound,
                      reminderIcon,
                      reminderColor
                    });
                  }}
                  className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:text-white hover:bg-cyan-500/30 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Probar notificación en la pantalla de este celular"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Probar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReminder(!reminder)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 border ${
                    reminder ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      reminder ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Toggle to expand personalization controls */}
            {reminder && (
              <div className="pt-1 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className="w-full py-1 text-[10.5px] text-cyan-300 hover:text-cyan-200 font-bold flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-cyan-400" />
                    <span>Personalizar sonido, icono y mensaje</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                    {showCustomizer ? 'Ocultar ▲' : 'Configurar ▼'}
                  </span>
                </button>

                {showCustomizer && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 text-xs">
                    {/* Mensaje Personalizado */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                        <MessageSquare className="w-3 h-3 text-cyan-400" />
                        <span>Mensaje motivacional en la notificación:</span>
                      </label>
                      <input
                        type="text"
                        value={reminderCustomText}
                        onChange={(e) => setReminderCustomText(e.target.value)}
                        placeholder="Ej: ¡Momento de enfoque total!"
                        className="w-full h-8 px-2.5 rounded-lg bg-[#050914] border border-cyan-500/30 text-white placeholder:text-slate-500 text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    {/* Sonido */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-amber-400" />
                          <span>Tono de campana / alarma:</span>
                        </span>
                        <span className="text-[9px] text-amber-300 font-mono">
                          {REMINDER_SOUND_LABELS[reminderSound].name}
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        {(Object.keys(REMINDER_SOUND_LABELS) as ReminderSoundType[]).map((sndKey) => {
                          const snd = REMINDER_SOUND_LABELS[sndKey];
                          const isSel = reminderSound === sndKey;
                          return (
                            <button
                              key={sndKey}
                              type="button"
                              onClick={() => {
                                setReminderSound(sndKey);
                                playTaskReminderChime(sndKey);
                              }}
                              className={`p-1.5 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                                isSel
                                  ? 'bg-amber-500/20 border-amber-400 text-white'
                                  : 'bg-[#050914] border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span className="text-[10px] font-bold truncate">{snd.icon} {snd.name}</span>
                              <Volume2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Icono de Tarea */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                        <CheckSquare className="w-3 h-3 text-cyan-400" />
                        <span>Icono en la notificación:</span>
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {ICON_OPTIONS.map((opt) => {
                          const IconComp = opt.icon;
                          const isSel = reminderIcon === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setReminderIcon(opt.id)}
                              className={`py-1.5 px-1 rounded-lg border flex flex-col items-center gap-0.5 transition cursor-pointer ${
                                isSel
                                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                                  : 'bg-[#050914] border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span className="text-[8.5px] font-medium leading-none">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color de Resplandor */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                        <Palette className="w-3 h-3 text-purple-400" />
                        <span>Color de la alerta:</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        {(Object.keys(REMINDER_COLOR_CONFIG) as ReminderColorType[]).map((clrKey) => {
                          const cfg = REMINDER_COLOR_CONFIG[clrKey];
                          const isSel = reminderColor === clrKey;
                          return (
                            <button
                              key={clrKey}
                              type="button"
                              onClick={() => setReminderColor(clrKey)}
                              className={`flex-1 py-1 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                                isSel ? `bg-white/10 ${cfg.border}` : 'bg-[#050914] border-slate-800'
                              }`}
                              title={cfg.name}
                            >
                              <div
                                className="w-3.5 h-3.5 rounded-full"
                                style={{ backgroundColor: cfg.hex.replace('%23', '#') }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="pt-2 flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                className="h-10 px-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-400 transition flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Eliminar esta tarea"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            )}

            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
