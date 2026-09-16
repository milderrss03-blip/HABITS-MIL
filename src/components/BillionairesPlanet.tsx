import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BILLIONAIRE_TITANS } from '../data/billionaires';
import { BillionaireTitan, Habit } from '../types';
import { Sparkles, Trophy, Check, ArrowRight, ChevronLeft, ChevronRight, X, Flame } from 'lucide-react';

interface BillionairesPlanetProps {
  onAdoptHabit?: (habit: Omit<Habit, 'id' | 'completed' | 'streak'>) => void;
}

export function BillionairesPlanet({ onAdoptHabit }: BillionairesPlanetProps) {
  const [activeTitanIndex, setActiveTitanIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [selectedTitanModal, setSelectedTitanModal] = useState<BillionaireTitan | null>(null);
  const [adoptedTitanId, setAdoptedTitanId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentTitan = BILLIONAIRE_TITANS[activeTitanIndex];

  // Auto-spin orbit
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.007) % (Math.PI * 2));
    }, 24);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  // Handle manual drag on the planet
  const handleTouchStart = (clientX: number) => {
    setIsAutoSpinning(false);
    setDragStartX(clientX);
  };

  const handleTouchMove = (clientX: number) => {
    if (dragStartX === null) return;
    const deltaX = clientX - dragStartX;
    setRotationAngle((prev) => prev + deltaX * 0.008);
    setDragStartX(clientX);
  };

  const handleTouchEnd = () => {
    setDragStartX(null);
    // Resume auto spin after a delay
    setTimeout(() => {
      setIsAutoSpinning(true);
    }, 2500);
  };

  const handleSelectTitan = (index: number) => {
    setActiveTitanIndex(index);
    setSelectedTitanModal(BILLIONAIRE_TITANS[index]);
  };

  const handleAdopt = (titan: BillionaireTitan) => {
    if (onAdoptHabit) {
      onAdoptHabit({
        title: titan.goldenHabit.title,
        subtitle: `${titan.name} — ${titan.goldenHabit.subtitle}`,
        category: titan.goldenHabit.category,
        timeBlock: titan.goldenHabit.timeBlock,
        icon: titan.goldenHabit.icon
      });
      setAdoptedTitanId(titan.id);
      setTimeout(() => setAdoptedTitanId(null), 3000);
    }
  };

  const nextTitan = useCallback(() => {
    setActiveTitanIndex((prev) => (prev + 1) % BILLIONAIRE_TITANS.length);
  }, []);

  const prevTitan = useCallback(() => {
    setActiveTitanIndex((prev) => (prev - 1 + BILLIONAIRE_TITANS.length) % BILLIONAIRE_TITANS.length);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none my-1"
      onPointerDown={(e) => handleTouchStart(e.clientX)}
      onPointerMove={(e) => handleTouchMove(e.clientX)}
      onPointerUp={handleTouchEnd}
      onPointerLeave={handleTouchEnd}
    >
      {/* Interactive Planet Stage */}
      <div className="relative w-full max-w-[340px] h-[260px] flex items-center justify-center">
        {/* Orbital Trajectory Rings in 3D Perspective */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[120px] rounded-[50%] border border-cyan-400/25 rotate-[-14deg] pointer-events-none shadow-[0_0_20px_rgba(6,182,212,0.15)]" />
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[140px] rounded-[50%] border border-dashed border-indigo-400/20 rotate-[-14deg] pointer-events-none" />
        <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-[95px] rounded-[50%] border border-amber-400/20 rotate-[12deg] pointer-events-none" />

        {/* Central 3D Celestial Planet Sphere ("Planeta Millonarios") */}
        <div className="relative w-36 h-36 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10">
          {/* Atmospheric Corona & Plasma Glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-cyan-400/30 via-indigo-600/20 to-amber-500/25 blur-xl pointer-events-none animate-pulse-glow" />
          <div className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md pointer-events-none" />

          {/* Planet Spherical Body with Realistic Specular Lighting */}
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_-16px_-16px_36px_rgba(0,0,0,0.9),inset_10px_10px_25px_rgba(34,211,238,0.5),0_0_35px_rgba(6,182,212,0.4)] bg-gradient-to-br from-slate-900 via-[#0a192f] to-[#040814] border border-cyan-300/40 flex items-center justify-center">
            {/* Latitude & Longitude Dynamic Coordinate Grid Lines */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none transition-transform"
              style={{
                background:
                  'radial-gradient(circle, rgba(34,211,238,0.2) 20%, transparent 70%), repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(34,211,238,0.15) 15px), repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(99,102,241,0.15) 19px)',
                transform: `rotate(${rotationAngle * 25}deg)`
              }}
            />

            {/* Glowing Golden Continental Auroras */}
            <div
              className="absolute -inset-2 rounded-full opacity-60 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 35% 30%, rgba(254,240,138,0.45) 0%, rgba(6,182,212,0.3) 40%, transparent 70%)'
              }}
            />

            {/* Planet Core Emblem & Tag */}
            <div className="relative z-10 flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-cyan-300 p-0.5 shadow-lg shadow-cyan-500/50 mb-0.5 animate-bounce">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-300" />
                </div>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-200 drop-shadow">
                MUNDO
              </span>
              <span className="text-[8px] font-bold text-amber-300 tracking-wider">
                MILLONARIO
              </span>
            </div>

            {/* Specular Glare Reflection on Spherical Rim */}
            <div className="absolute top-1.5 left-2 w-14 h-7 rounded-[50%] bg-gradient-to-b from-white/60 to-transparent rotate-[-35deg] blur-[1px] pointer-events-none" />
          </div>

          {/* Planetary Ring Edge Projection */}
          <div
            className="absolute -inset-x-8 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent rotate-[-14deg] pointer-events-none blur-[0.5px]"
          />
        </div>

        {/* Orbiting Billionaire Satellites in Elliptical Orbit */}
        {BILLIONAIRE_TITANS.map((titan, index) => {
          // Compute orbital angular position
          const baseAngle = (index / BILLIONAIRE_TITANS.length) * (Math.PI * 2);
          const angle = baseAngle + rotationAngle;

          // 3D Ellipse projection (tilted orbit)
          const rx = 135; // horizontal radius
          const ry = 58;  // vertical radius for perspective
          const x = Math.cos(angle) * rx;
          const y = Math.sin(angle) * ry;

          // Depth estimation: sin(angle) > 0 is front, < 0 is behind
          const depth = Math.sin(angle);
          const scale = 0.72 + (depth + 1) * 0.22; // 0.72 to 1.16
          const zIndex = depth > 0 ? 25 : 5;
          const opacity = depth > 0 ? 1 : 0.65;
          const isCurrent = activeTitanIndex === index;

          return (
            <div
              key={titan.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectTitan(index);
              }}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                zIndex,
                opacity
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-75 group"
            >
              {/* Satellite Node / Titan Portrait Card */}
              <div
                className={`relative flex items-center gap-1.5 px-1.5 py-1 rounded-full backdrop-blur-md transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/90 border-2 border-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.8)] scale-110'
                    : 'bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400/60 shadow-md'
                }`}
              >
                {/* Titan Avatar */}
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-cyan-400/50 shadow-sm flex-shrink-0">
                  <img
                    src={titan.avatarUrl}
                    alt={titan.name}
                    className="w-full h-full object-cover"
                  />
                  {isCurrent && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-ping" />
                  )}
                </div>

                {/* Micro Label (visible on closer/front nodes) */}
                <div className="flex flex-col pr-1 text-left whitespace-nowrap">
                  <span className="text-[9px] font-bold text-white leading-tight">
                    {titan.name.split(' ')[0]}
                  </span>
                  <span className="text-[7.5px] font-mono font-medium text-amber-300">
                    {titan.netWorth.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Orbital Glow Connection Line towards planet center */}
              {isCurrent && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-cyan-400/40 pointer-events-none animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Controller & Active Titan Spotlight Card */}
      <div className="w-full px-1 mt-1">
        <div className="frosted-glass rounded-2xl p-3 border border-cyan-500/30 relative overflow-hidden shadow-xl">
          {/* Subtle top neon accent line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Header with Switchers & Titan Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                TITÁN EN ÓRBITA ({activeTitanIndex + 1}/{BILLIONAIRE_TITANS.length})
              </span>
            </div>

            {/* Next / Prev Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTitan}
                className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/60 active:scale-90 transition cursor-pointer"
                aria-label="Titán anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextTitan}
                className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/60 active:scale-90 transition cursor-pointer"
                aria-label="Titán siguiente"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Titan Main Info Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400/60 shadow-md shadow-cyan-500/20 flex-shrink-0">
                <img
                  src={currentTitan.avatarUrl}
                  alt={currentTitan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[13px] font-bold text-white tracking-tight">
                    {currentTitan.name}
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                    {currentTitan.netWorth}
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300 font-medium">
                  {currentTitan.empire} • <span className="text-slate-400">{currentTitan.title}</span>
                </p>
              </div>
            </div>

            {/* Adopt / View Button */}
            <button
              onClick={() => setSelectedTitanModal(currentTitan)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[10.5px] flex items-center gap-1 shadow-md shadow-cyan-500/30 active:scale-95 transition cursor-pointer whitespace-nowrap"
            >
              <span>Ver Hábitos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Golden Habit Snippet */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5 text-slate-300 truncate">
              <span className="text-cyan-400 font-bold">Hábito de Oro:</span>
              <span className="text-white font-medium truncate">{currentTitan.goldenHabit.title}</span>
            </div>
            <button
              onClick={() => handleAdopt(currentTitan)}
              disabled={adoptedTitanId === currentTitan.id}
              className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold flex items-center gap-1 transition ${
                adoptedTitanId === currentTitan.id
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 cursor-pointer active:scale-95'
              }`}
            >
              {adoptedTitanId === currentTitan.id ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>¡Adoptado!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Copiar Hábito</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Titans Carousel Indicator Puffs */}
      <div className="flex items-center gap-1.5 mt-2 px-2 overflow-x-auto no-scrollbar py-1">
        {BILLIONAIRE_TITANS.map((titan, idx) => (
          <button
            key={titan.id}
            onClick={() => setActiveTitanIndex(idx)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTitanIndex === idx
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTitanIndex === idx ? 'bg-cyan-400' : 'bg-slate-600'}`} />
            <span>{titan.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Detailed Modal / Bottom Sheet for Selected Titan */}
      <AnimatePresence>
        {selectedTitanModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[420px] bg-slate-950 border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative overflow-hidden max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              {/* Background ambient aurora */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedTitanModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Titan Header Card */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  <img
                    src={selectedTitanModal.avatarUrl}
                    alt={selectedTitanModal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white tracking-tight">
                      {selectedTitanModal.name}
                    </h2>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-400/40">
                      {selectedTitanModal.netWorth}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-300">
                    {selectedTitanModal.empire}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {selectedTitanModal.title}
                  </p>
                </div>
              </div>

              {/* Quote Banner */}
              <blockquote className="frosted-glass rounded-xl p-3 border-l-4 border-cyan-400 text-xs italic text-slate-200 mb-4 leading-relaxed">
                «{selectedTitanModal.quote}»
              </blockquote>

              {/* Golden Habit Card */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-cyan-400/30 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                      HÁBITO DE ORO DE {selectedTitanModal.name.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono uppercase">
                    {selectedTitanModal.goldenHabit.timeBlock === 'morning' ? 'Bloque Matutino' : 'Bloque Nocturno'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {selectedTitanModal.goldenHabit.title}
                </h4>
                <p className="text-xs text-cyan-300/90 mb-2 font-medium">
                  {selectedTitanModal.goldenHabit.subtitle}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedTitanModal.goldenHabit.description}
                </p>

                {/* Titan Routine Principle */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-300">
                  <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Principio Clave:</strong> {selectedTitanModal.routineKey}
                  </span>
                </div>
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
                  <span className="text-[9px] block text-slate-400 uppercase font-mono">Disciplina</span>
                  <span className="text-sm font-extrabold text-cyan-300">{selectedTitanModal.stats.disciplineScore}/100</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
                  <span className="text-[9px] block text-slate-400 uppercase font-mono">Sueño Diario</span>
                  <span className="text-sm font-extrabold text-indigo-300">{selectedTitanModal.stats.hoursSleep}</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
                  <span className="text-[9px] block text-slate-400 uppercase font-mono">Lectura Diaria</span>
                  <span className="text-sm font-extrabold text-amber-300">{selectedTitanModal.stats.dailyReadingTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAdopt(selectedTitanModal)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Adoptar este Hábito en mi Rutina</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
