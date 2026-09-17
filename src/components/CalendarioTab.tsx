import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Check,
  RefreshCw,
  Tag
} from 'lucide-react';
import { CalendarEvent } from '../types';
import { GoogleCalendarModal } from './GoogleCalendarModal';

interface CalendarioTabProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onEditEvent: (id: string, updated: Partial<CalendarEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleEvent?: (id: string) => void;
}

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  blue: { border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-300', dot: 'bg-blue-400 shadow-[0_0_6px_#60a5fa]' },
  emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-300', dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]' },
  amber: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-300', dot: 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' },
  indigo: { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-300', dot: 'bg-indigo-400 shadow-[0_0_6px_#818cf8]' },
  rose: { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-300', dot: 'bg-rose-400 shadow-[0_0_6px_#fb7185]' },
  cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-300', dot: 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' }
};

export function CalendarioTab({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleEvent
}: CalendarioTabProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1);
  const months = ['Agosto 2026', 'Septiembre 2026', 'Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'];
  const [activeView, setActiveView] = useState<'month' | 'week' | 'agenda'>('month');
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate() || 12);
  const [agendaFilter, setAgendaFilter] = useState<'all' | 'event' | 'task' | 'habit' | 'goal'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('Sincronizar Google Calendar');

  // Google Calendar Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setSyncStatusText('Sincronizando con Google Calendar...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatusText('¡Sincronizado con Google Calendar!');
      setTimeout(() => setSyncStatusText('Sincronizar Google Calendar'), 2500);
    }, 1200);
  };

  const openCreateModal = (day?: number) => {
    if (day) setSelectedDay(day);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Helper to parse day from formats like "17" or "2026-09-17"
  const getEventDay = (dateStr?: string): number => {
    if (!dateStr) return new Date().getDate();
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        const d = parseInt(parts[2], 10);
        if (!isNaN(d)) return d;
      }
    }
    const parsed = parseInt(dateStr, 10);
    return isNaN(parsed) ? new Date().getDate() : parsed;
  };

  // Filter events by selected day or view
  const eventsForSelectedDay = events.filter((e) => {
    const eventDay = getEventDay(e.date);
    return eventDay === selectedDay;
  });

  const displayEvents = activeView === 'agenda' ? events : eventsForSelectedDay;

  const filteredEvents = displayEvents.filter((item) => {
    if (agendaFilter === 'all') return true;
    return item.type === agendaFilter;
  });

  // Events count map per day for dots
  const dayEventsMap = events.reduce((acc, ev) => {
    const d = getEventDay(ev.date);
    if (!isNaN(d)) {
      if (!acc[d]) acc[d] = [];
      acc[d].push(ev);
    }
    return acc;
  }, {} as Record<number, CalendarEvent[]>);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Top Header Bar with Google Calendar Style "+ Crear" */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
            <span className="text-[13px] font-extrabold tracking-tight">Google Calendar</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {events.length === 0 ? 'Agenda vacía' : `${events.length} eventos`}
          </span>
        </div>

        {/* Google Calendar "+ Crear" Button */}
        <button
          type="button"
          onClick={() => openCreateModal(selectedDay)}
          className="px-3.5 py-1.5 rounded-xl btn-cyan-glow text-[12px] font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Crear</span>
        </button>
      </div>

      {/* Month Navigation & View Pills */}
      <section className="flex flex-col gap-3 frosted-card border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[16px] font-extrabold text-white tracking-tight px-1 select-none">
              {months[currentMonthIndex]}
            </span>
            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => setCurrentMonthIndex((prev) => Math.min(months.length - 1, prev + 1))}
              className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentMonthIndex(1);
              setSelectedDay(new Date().getDate());
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-xl btn-cyan-glow text-[11px] font-bold active:scale-95 transition-transform cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Hoy</span>
          </button>
        </div>

        {/* Segmented View Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-xl frosted-pill border border-cyan-500/20 gap-1">
          {(['month', 'week', 'agenda'] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
              className={`py-1.5 rounded-lg text-[12px] font-bold text-center transition-all cursor-pointer ${
                activeView === view
                  ? 'btn-cyan-glow shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Agenda'}
            </button>
          ))}
        </div>

        {/* Interactive Monthly Grid */}
        <div className="flex flex-col pt-1">
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 pb-1.5">
            <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[12px] text-center">
            {/* Trailing days */}
            <div className="py-1 flex flex-col items-center justify-center rounded-xl text-slate-700">
              <span>29</span>
            </div>
            <div className="py-1 flex flex-col items-center justify-center rounded-xl text-slate-700">
              <span>30</span>
            </div>

            {/* Days 1 to 31 */}
            {Array.from({ length: 31 }).map((_, i) => {
              const d = i + 1;
              const isSelected = selectedDay === d;
              const dayEvents = dayEventsMap[d] || [];
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  onDoubleClick={() => openCreateModal(d)}
                  className={`day-cell relative py-1.5 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 font-extrabold shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                      : 'hover:bg-cyan-500/10 text-slate-200'
                  }`}
                >
                  <span className="relative z-10">{d}</span>
                  <div className="flex gap-0.5 mt-0.5 z-10 h-1.5">
                    {hasEvents &&
                      dayEvents.slice(0, 3).map((ev, idx) => {
                        const style = COLOR_MAP[ev.color || 'blue'] || COLOR_MAP.blue;
                        return (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          />
                        );
                      })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Legend */}
          <div className="flex items-center justify-center gap-4 pt-3 mt-1 border-t border-cyan-500/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_4px_#60a5fa]" />
              <span className="text-[10px] font-bold text-slate-400">Evento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
              <span className="text-[10px] font-bold text-slate-400">Tarea</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee]" />
              <span className="text-[10px] font-bold text-slate-400">Hábito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
              <span className="text-[10px] font-bold text-slate-400">Recordatorio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Day Header Card */}
      <section className="relative overflow-hidden rounded-2xl frosted-card border border-cyan-500/25 p-4 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-white">
              Día {selectedDay} de {months[currentMonthIndex]}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
              {eventsForSelectedDay.length} {eventsForSelectedDay.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>
          <span className="text-[12px] text-slate-400 mt-0.5">
            {eventsForSelectedDay.length === 0
              ? 'Sin actividades registradas para este día'
              : 'Tus actividades y citas programadas'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal(selectedDay)}
          className="px-3 py-1.5 rounded-xl btn-cyan-glow text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir</span>
        </button>
      </section>

      {/* Filter Chips */}
      {events.length > 0 && (
        <section className="flex items-center gap-2 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-none">
          <button
            type="button"
            onClick={() => setAgendaFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex-shrink-0 transition-all cursor-pointer ${
              agendaFilter === 'all'
                ? 'btn-cyan-glow'
                : 'frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <span>Todos ({displayEvents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setAgendaFilter('event')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all cursor-pointer ${
              agendaFilter === 'event'
                ? 'btn-cyan-glow'
                : 'frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Eventos</span>
          </button>
          <button
            type="button"
            onClick={() => setAgendaFilter('task')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all cursor-pointer ${
              agendaFilter === 'task'
                ? 'btn-cyan-glow'
                : 'frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Tareas</span>
          </button>
          <button
            type="button"
            onClick={() => setAgendaFilter('habit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all cursor-pointer ${
              agendaFilter === 'habit'
                ? 'btn-cyan-glow'
                : 'frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Hábitos</span>
          </button>
          <button
            type="button"
            onClick={() => setAgendaFilter('goal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all cursor-pointer ${
              agendaFilter === 'goal'
                ? 'btn-cyan-glow'
                : 'frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Recordatorios</span>
          </button>
        </section>
      )}

      {/* Events List / Clean Zero State */}
      <section className="flex flex-col space-y-2.5">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl frosted-card border border-cyan-500/20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <CalendarIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-[15px] font-bold text-white">
              {events.length === 0
                ? 'Agenda en Cero'
                : `Sin eventos para el Día ${selectedDay}`}
            </p>
            <p className="text-[12px] text-slate-400 mt-1 max-w-[280px]">
              {events.length === 0
                ? 'No tienes eventos agendados. Pulsa el botón para programar reuniones, tareas o hábitos como en Google Calendar.'
                : 'No tienes actividades registradas para esta fecha. Puedes añadir un evento nuevo fácilmente.'}
            </p>
            <button
              type="button"
              onClick={() => openCreateModal(selectedDay)}
              className="mt-4 px-4 py-2 rounded-xl btn-cyan-glow text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Crear Evento</span>
            </button>
          </div>
        ) : (
          filteredEvents.map((item) => {
            const colorStyle = COLOR_MAP[item.color || 'blue'] || COLOR_MAP.blue;
            const isDone = item.completed || false;

            return (
              <div key={item.id} className="agenda-item flex gap-3 group">
                {/* Time Indicator Column */}
                <div className="flex flex-col items-center w-12 flex-shrink-0 pt-1">
                  <span className="text-[11px] font-bold text-cyan-300">{item.timeStart}</span>
                  <span className="text-[9px] text-slate-500 font-semibold">{item.timeEnd}</span>
                  <div className="w-0.5 flex-1 bg-cyan-500/20 mt-1 mb-1" />
                </div>

                {/* Event Card (Google Calendar Inspired) */}
                <div
                  className={`flex-1 p-3.5 rounded-2xl frosted-card border-2 transition-all flex flex-col gap-2 relative overflow-hidden ${
                    isDone
                      ? 'bg-[#091522]/95 border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.2)]'
                      : `${colorStyle.border} hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.08)]`
                  }`}
                >
                  {/* Left Accent Stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorStyle.dot}`} />

                  {/* Header badges */}
                  <div className="flex items-center justify-between pl-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorStyle.border} ${colorStyle.bg} ${colorStyle.text}`}>
                        {item.tag || (item.type === 'habit' ? 'Hábito' : item.type === 'task' ? 'Tarea' : item.type === 'goal' ? 'Recordatorio' : 'Evento')}
                      </span>
                      {item.allDay && (
                        <span className="px-2 py-0.5 rounded-full frosted-pill text-[10px] font-bold text-slate-400 border border-slate-700">
                          Todo el día
                        </span>
                      )}
                    </div>

                    {/* Action buttons: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="w-7 h-7 rounded-lg frosted-pill border border-cyan-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer transition hover:scale-105"
                        title="Editar evento"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEvent(item.id)}
                        className="w-7 h-7 rounded-lg frosted-pill border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition hover:scale-105"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="pl-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-[14px] font-bold text-white ${isDone ? 'line-through text-cyan-200 opacity-80' : ''}`}>
                        {item.title}
                      </h3>
                      {onToggleEvent && (
                        <button
                          type="button"
                          onClick={() => onToggleEvent(item.id)}
                          className="cursor-pointer flex-shrink-0 transition-transform active:scale-90"
                          title={isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          {isDone ? (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black border-2 border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.85)] flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-cyan-500/50 hover:border-cyan-300 flex items-center justify-center transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                          )}
                        </button>
                      )}
                    </div>
                    {item.desc && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    )}
                  </div>

                  {/* Location / Meta info */}
                  {item.location && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-1 pt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Connected Accounts Section */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Cuentas Vinculadas
          </span>
          <span className="text-[10px] text-cyan-300 font-bold">Google Workspace</span>
        </div>

        {/* Provider: Google Calendar */}
        <div className="rounded-2xl frosted-card border border-cyan-500/20 p-3.5 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 shadow-inner text-cyan-300">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-white truncate">Google Calendar</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                </div>
                <span className="text-[11px] text-slate-400 truncate">Sincronización bidireccional activa</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Forzar sincronización Google"
              onClick={handleSyncAll}
              className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-transform active:rotate-180 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSyncAll}
          className="w-full h-11 rounded-xl btn-cyan-glow text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{syncStatusText}</span>
        </button>
      </div>

      {/* Google Calendar Create/Edit Modal */}
      {isModalOpen && (
        <GoogleCalendarModal
          isOpen={isModalOpen}
          eventToEdit={editingEvent}
          defaultDay={selectedDay}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={(eventData, id) => {
            if (id) {
              onEditEvent(id, eventData);
            } else {
              onAddEvent(eventData);
            }
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onDelete={(id) => {
            onDeleteEvent(id);
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}
