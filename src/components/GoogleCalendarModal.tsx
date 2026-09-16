import { useState, useEffect, type FormEvent } from 'react';
import { X, Clock, MapPin, AlignLeft, Calendar as CalendarIcon, Tag, Trash2, Check } from 'lucide-react';
import { CalendarEvent } from '../types';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  eventToEdit?: CalendarEvent | null;
  defaultDay?: number;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>, id?: string) => void;
  onDelete?: (id: string) => void;
}

const GOOGLE_COLORS: { id: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan'; name: string; bg: string; ring: string }[] = [
  { id: 'blue', name: 'Azul Océano', bg: 'bg-blue-500', ring: 'ring-blue-400' },
  { id: 'emerald', name: 'Verde Salvia', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'amber', name: 'Ámbar Plátano', bg: 'bg-amber-500', ring: 'ring-amber-400' },
  { id: 'indigo', name: 'Amatista Uva', bg: 'bg-indigo-500', ring: 'ring-indigo-400' },
  { id: 'rose', name: 'Rubí Flamingo', bg: 'bg-rose-500', ring: 'ring-rose-400' },
  { id: 'cyan', name: 'Cian Pavo Real', bg: 'bg-cyan-500', ring: 'ring-cyan-400' }
];

export function GoogleCalendarModal({
  isOpen,
  eventToEdit,
  defaultDay = 14,
  onClose,
  onSave,
  onDelete
}: GoogleCalendarModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'event' | 'task' | 'habit' | 'goal'>('event');
  const [day, setDay] = useState(defaultDay);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState<'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan'>('blue');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setType(eventToEdit.type || 'event');
      const numDay = parseInt(eventToEdit.date, 10);
      setDay(isNaN(numDay) ? defaultDay : numDay);
      setTimeStart(eventToEdit.timeStart || '09:00');
      setTimeEnd(eventToEdit.timeEnd || '10:00');
      setAllDay(!!eventToEdit.allDay);
      setColor(eventToEdit.color || 'blue');
      setLocation(eventToEdit.location || '');
      setDesc(eventToEdit.desc || '');
      setTag(eventToEdit.tag || '');
    } else {
      setTitle('');
      setType('event');
      setDay(defaultDay);
      setTimeStart('09:00');
      setTimeEnd('10:00');
      setAllDay(false);
      setColor('blue');
      setLocation('');
      setDesc('');
      setTag('');
    }
  }, [eventToEdit, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        type,
        date: String(day),
        timeStart: allDay ? 'Todo el día' : timeStart,
        timeEnd: allDay ? 'Todo el día' : timeEnd,
        allDay,
        color,
        location: location.trim() || undefined,
        desc: desc.trim() || undefined,
        tag: tag.trim() || (type === 'habit' ? 'Hábito' : type === 'task' ? 'Tarea' : type === 'goal' ? 'Hito' : 'Evento')
      },
      eventToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0f1d] border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Top Header bar with Google Calendar style indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-cyan-500/15 border border-cyan-400/30 px-2.5 py-1 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_4px_#3b82f6]" />
              <span className="text-[12px] font-extrabold text-cyan-300">Google Calendar</span>
            </div>
            <span className="text-[12px] text-slate-400 font-medium">
              {eventToEdit ? 'Editar Evento' : 'Nuevo Evento'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {eventToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(eventToEdit.id);
                  onClose();
                }}
                className="w-8 h-8 rounded-xl frosted-pill border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-500/20 flex items-center justify-center cursor-pointer transition"
                title="Eliminar evento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 flex flex-col">
          {/* Main Title Input (Google Calendar Style) */}
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Añade un título"
              className="w-full text-[19px] font-bold text-white bg-transparent border-b-2 border-cyan-500/40 focus:border-cyan-400 pb-2 outline-none placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Event Type Switcher (Google Calendar chips) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'event', label: 'Evento', color: 'text-blue-300 bg-blue-500/15 border-blue-400/40' },
              { id: 'task', label: 'Tarea', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/40' },
              { id: 'habit', label: 'Hábito', color: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/40' },
              { id: 'goal', label: 'Recordatorio', color: 'text-amber-300 bg-amber-500/15 border-amber-400/40' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id as any)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                  type === t.id
                    ? `${t.color} shadow-sm ring-1 ring-white/20`
                    : 'frosted-pill border-cyan-500/15 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Date & Time Settings */}
          <div className="rounded-2xl frosted-card border border-cyan-500/20 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-[12px] font-bold">Día del mes</span>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="bg-[#090d16] border border-cyan-500/30 rounded-xl px-2.5 py-1 text-white text-[12px] font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Día {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-cyan-500/15">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-[12px] font-bold">Todo el día</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
              </label>
            </div>

            {/* Time Pickers (if not all day) */}
            {!allDay && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-2.5 py-1.5 text-white text-[12px] font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full bg-[#090d16] border border-cyan-500/25 rounded-xl px-2.5 py-1.5 text-white text-[12px] font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location & Tag */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 bg-[#090d16] border border-cyan-500/20 rounded-xl px-3 py-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Añade ubicación o enlace de reunión"
                className="w-full bg-transparent text-[12px] text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#090d16] border border-cyan-500/20 rounded-xl px-3 py-2">
              <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Etiqueta (ej. Trabajo, Finanzas, Salud)"
                className="w-full bg-transparent text-[12px] text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-2 bg-[#090d16] border border-cyan-500/20 rounded-xl px-3 py-2">
            <AlignLeft className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Añade una descripción o notas del evento..."
              className="w-full bg-transparent text-[12px] text-white placeholder:text-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Color de Google Calendar
            </label>
            <div className="flex items-center gap-2.5">
              {GOOGLE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-all cursor-pointer ${
                    color === c.id ? `ring-2 ring-white scale-110 shadow-lg` : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {color === c.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl frosted-pill border border-cyan-500/20 text-slate-300 hover:text-white text-[13px] font-bold cursor-pointer transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-3 rounded-xl btn-cyan-glow text-[13px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
            >
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
