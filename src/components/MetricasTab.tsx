import { useState } from 'react';

export function MetricasTab() {
  const [period, setPeriod] = useState<'semana' | 'mes' | 'ano'>('mes');

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-between p-1 rounded-2xl frosted-pill border border-cyan-500/25 shadow-sm">
        <button
          type="button"
          onClick={() => setPeriod('semana')}
          className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-150 text-center cursor-pointer ${
            period === 'semana'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Semana
        </button>
        <button
          type="button"
          onClick={() => setPeriod('mes')}
          className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-150 text-center cursor-pointer ${
            period === 'mes'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Mes
        </button>
        <button
          type="button"
          onClick={() => setPeriod('ano')}
          className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-150 text-center cursor-pointer ${
            period === 'ano'
              ? 'btn-cyan-glow shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Año
        </button>
      </div>

      {/* Apex Score Metric Card - Zero State */}
      <div className="relative overflow-hidden rounded-2xl frosted-card border border-cyan-500/30 p-4.5 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[18px] text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                speed
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Índice de Consistencia
              </span>
            </div>
            <h2 className="text-[24px] font-extrabold text-white mt-1 tracking-tight">Apex Score</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Sinergia entre disciplina y resultados</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
                0% este mes
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Percentil 0%</span>
            </div>
          </div>

          {/* Circular Gauge at 0% */}
          <div className="relative flex items-center justify-center flex-shrink-0 w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-800"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
              />
              <circle
                className="text-cyan-400/40"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="251.2"
                strokeLinecap="round"
                strokeWidth="7"
              />
              <circle
                className="text-cyan-600/20"
                cx="50"
                cy="50"
                fill="none"
                r="32"
                stroke="currentColor"
                strokeDasharray="2 6"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[32px] font-extrabold text-white tracking-tighter leading-none">0</span>
              <span className="text-[10px] text-cyan-300/80 font-bold tracking-widest mt-0.5">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Chart: Habitos vs Finanzas - Zero State */}
      <div className="rounded-2xl frosted-card border border-cyan-500/20 p-4.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
              Correlación Multivariable
            </span>
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Hábitos vs. Capacidad de Ahorro
            </h3>
          </div>
          <div className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1 text-slate-400 text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/40" />
            <span className="text-slate-400">Ahorro Diario ($0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-cyan-400/40" />
            <span className="text-slate-400">Hábitos Registrados (0)</span>
          </div>
        </div>

        {/* Combined Chart Container at baseline */}
        <div className="relative w-full h-36 pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 140">
            <defs>
              <linearGradient id="metricPrimaryGradientZero" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line className="text-slate-800/80" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="320" y1="30" y2="30" />
            <line className="text-slate-800/80" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="320" y1="70" y2="70" />
            <line className="text-slate-800/80" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="320" y1="110" y2="110" />
            
            {/* Zero height bars */}
            {[15, 58, 101, 144, 187, 230, 273].map((x) => (
              <rect key={x} className="text-slate-800" fill="currentColor" height="4" rx="2" width="16" x={x} y="116" />
            ))}

            {/* Flat baseline curve */}
            <line className="text-cyan-500/40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" x1="20" x2="290" y1="118" y2="118" />

            {/* Baseline markers */}
            {[23, 66, 109, 152, 195, 238, 281].map((cx) => (
              <circle key={cx} className="text-slate-700 fill-[#090d16]" cx={cx} cy="118" r="3" stroke="currentColor" strokeWidth="1.5" />
            ))}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[11px] text-slate-500 font-medium">0 datos registrados en este período</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between px-2 text-slate-500 text-[10px] font-bold">
          <span>Sem 1</span>
          <span>Sem 2</span>
          <span>Sem 3</span>
          <span>Sem 4</span>
          <span>Sem 5</span>
        </div>

        {/* AI Intelligence Discovery Banner - Zero State */}
        <div className="mt-2 rounded-xl frosted-pill border border-cyan-500/20 p-3 flex items-start gap-2.5 shadow-inner">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">
              insights
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase">Descubrimiento Inteligente</span>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5 leading-snug">
              Registra tus hábitos diarios y tareas para activar el cálculo de correlación automática. Tasa inicial: <strong className="text-white font-bold">0%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Habit Heatmap (30-Day Matrix) - Zero State */}
      <div className="rounded-2xl frosted-card border border-cyan-500/20 p-4.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
              Densidad Temporal
            </span>
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Mapa de Calor (30 Días)
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 mr-1 font-bold">Nivel:</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800/80" />
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800/60" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/40" />
          </div>
        </div>

        {/* Matrix Grid: All 30 days in 0 state */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {Array.from({ length: 29 }).map((_, idx) => {
            const dayNum = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 rounded-xl frosted-pill border border-cyan-500/10 text-center"
              >
                <span className="text-[10px] text-slate-500 font-bold">{dayNum}</span>
                <span className="w-2.5 h-2.5 rounded-full mt-1 bg-slate-800" />
              </div>
            );
          })}
          {/* Day 30 / HOY */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl frosted-pill border border-cyan-400/30 text-center">
            <span className="text-[10px] text-cyan-400 font-bold">HOY</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 mt-1" />
          </div>
        </div>
      </div>

      {/* Daily Task Performance (Donut Chart & Metrics) - Zero State */}
      <div className="rounded-2xl frosted-card border border-cyan-500/20 p-4.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Distribución Operativa
            </span>
            <h3 className="text-[16px] font-bold text-white tracking-tight">Rendimiento de Tareas</h3>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full frosted-pill border border-cyan-500/25 text-cyan-300 font-bold">
            0 Completadas
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Donut Chart at 0% */}
          <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-800"
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="currentColor"
                strokeWidth="9"
              />
              <circle
                className="text-cyan-400/30"
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="238.76"
                strokeLinecap="round"
                strokeWidth="9"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[26px] font-extrabold text-white leading-none">0%</span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">Completado</span>
            </div>
          </div>

          {/* Donut Legend with 0% */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />
                <span className="text-slate-300 font-medium">A tiempo</span>
              </div>
              <span className="text-cyan-300 font-bold">0%</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                <span className="text-slate-400">Pospuestas</span>
              </div>
              <span className="text-slate-500 font-semibold">0%</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="text-slate-400">Canceladas</span>
              </div>
              <span className="text-slate-500 font-semibold">0%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-1">
              <div className="bg-cyan-400/20 h-full" style={{ width: '0%' }} />
              <div className="bg-amber-400/20 h-full" style={{ width: '0%' }} />
              <div className="bg-rose-500/20 h-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Badges / Insignias - Zero State */}
      <div className="rounded-2xl frosted-card border border-cyan-500/20 p-4.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
              Hitos & Reconocimiento
            </span>
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Insignias Desbloqueadas
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">0/3 este mes</span>
        </div>

        <div className="flex flex-col space-y-2.5 pt-1">
          {/* Badge 1 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl frosted-pill border border-slate-700/40 opacity-75">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">
                account_balance_wallet
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[15px] font-bold text-slate-300 tracking-tight truncate">Máster de Finanzas</h4>
                <span className="text-[10px] font-bold text-slate-400">Nivel 0</span>
              </div>
              <p className="text-[12px] text-slate-500 truncate">0 meses de ahorro registrados</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl frosted-pill border border-slate-700/40 opacity-75">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">
                local_fire_department
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[15px] font-bold text-slate-300 tracking-tight truncate">Racha Imparable</h4>
                <span className="text-[10px] font-bold text-slate-400">0 Días</span>
              </div>
              <p className="text-[12px] text-slate-500 truncate">Comienza completando tus hábitos diarios</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl frosted-pill border border-slate-700/40 opacity-75">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">
                task_alt
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[15px] font-bold text-slate-300 tracking-tight truncate">Eficiencia Total</h4>
                <span className="text-[10px] font-bold text-slate-400">0% Hit</span>
              </div>
              <p className="text-[12px] text-slate-500 truncate">0 tareas registradas aún</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 pt-2 text-slate-500">
        <span className="w-2 h-2 rounded-full bg-cyan-400/60" />
        <span className="text-[10px] font-bold tracking-wide text-slate-400">Listo para registrar tus primeras métricas</span>
      </div>
    </div>
  );
}
