import { useState } from 'react';
import { Plus, Flame, Check, Sparkles } from 'lucide-react';
import { Habit } from '../types';

interface HabitsTabProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onOpenAddModal: () => void;
  onDeleteHabit: (id: string) => void;
}

export function HabitsTab({
  habits,
  onToggleHabit,
  onOpenAddModal,
  onDeleteHabit
}: HabitsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mind' | 'health' | 'finance'>('all');

  const filteredHabits = habits.filter(h => {
    if (selectedCategory === 'all') return true;
    return h.category === selectedCategory;
  });

  const totalCompleted = habits.filter(h => h.completed).length;
  const bestStreak = habits.reduce((max, h) => (h.streak > max ? h.streak : max), 0);
  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-4">
      {/* Header & Stats Banner */}
      <div className="p-4 rounded-3xl bg-[#0f1422] border border-[#1f2942] relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              SISTEMA NEURAL DE HÁBITOS
            </div>
            <h2 className="font-display font-bold text-lg text-white mt-1">Consistencia Mil</h2>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo</span>
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#1f2942]">
          <div className="p-2.5 rounded-2xl bg-[#141a2c] border border-[#1f2942]">
            <div className="text-[10px] text-slate-400">Racha Récord</div>
            <div className="font-display font-bold text-base text-amber-400 flex items-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              {bestStreak} días
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#141a2c] border border-[#1f2942]">
            <div className="text-[10px] text-slate-400">Completados Hoy</div>
            <div className="font-display font-bold text-base text-cyan-400 mt-0.5">
              {totalCompleted} / {habits.length}
            </div>
          </div>
        </div>

        {/* Weekly Consistency Visualizer */}
        <div className="mt-3 pt-3 border-t border-[#1f2942]">
          <div className="text-[10px] font-mono text-slate-400 mb-2 flex justify-between">
            <span>Rastreo Semanal</span>
            <span className="text-emerald-400 font-semibold">100% Semana Activa</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {daysOfWeek.map((day, idx) => {
              const isPastOrToday = idx <= todayDayIndex;
              const isToday = idx === todayDayIndex;
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isToday
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300'
                        : isPastOrToday
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#141a2c] text-slate-500 border border-[#1f2942]'
                    }`}
                  >
                    {isPastOrToday ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : day}
                  </div>
                  <span className={`text-[9px] font-mono ${isToday ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'mind', label: 'Mente' },
          { id: 'health', label: 'Cuerpo' },
          { id: 'finance', label: 'Finanzas' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                : 'bg-[#0f1422] text-slate-400 border border-[#1f2942] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-2">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 group ${
              habit.completed
                ? 'bg-[#091522]/95 border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.2)]'
                : 'bg-[#0f1422]/90 border-[#1f2942] hover:border-cyan-500/40'
            }`}
          >
            <div
              onClick={() => onToggleHabit(habit.id)}
              className="flex items-center gap-3 flex-1 cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                  habit.completed
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black border-2 border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_14px_rgba(34,211,238,0.85)]'
                    : 'bg-[#141a2c] border-2 border-cyan-500/40 hover:border-cyan-300 text-transparent hover:shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>

              <div>
                <div
                  className={`text-xs font-semibold transition ${
                    habit.completed ? 'text-cyan-200 line-through opacity-80' : 'text-slate-100'
                  }`}
                >
                  {habit.title}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{habit.subtitle}</span>
                  <span className="text-amber-400 font-mono">🔥 {habit.streak}d racha</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">{habit.icon}</span>
              {habit.id.startsWith('custom-') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteHabit(habit.id);
                  }}
                  className="text-slate-600 hover:text-red-400 text-xs px-1 opacity-0 group-hover:opacity-100 transition"
                  title="Eliminar hábito"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
