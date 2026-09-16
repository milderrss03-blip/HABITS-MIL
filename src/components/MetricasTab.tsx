import { useState } from 'react';

export function MetricasTab() {
  const [period, setPeriod] = useState<'semana' | 'mes' | 'ano'>('mes');

  return (
    <div className="flex flex-col w-full pb-6 space-y-4">
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

      {/* Apex Score Metric Card */}
      <div className="relative overflow-hidden rounded-2xl frosted-card border border-cyan-500/30 p-4.5 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
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
              <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +8% este mes
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Percentil 96%</span>
            </div>
          </div>

          {/* Futuristic Circular Gauge */}
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
                className="text-cyan-400 drop-shadow-[0_0_12px_#22d3ee]"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="20.1"
                strokeLinecap="round"
                strokeWidth="7"
              />
              <circle
                className="text-cyan-600/30"
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
              <span className="text-[32px] font-extrabold text-white tracking-tighter leading-none drop-shadow-[0_0_10px_#22d3ee]">92</span>
              <span className="text-[10px] text-cyan-300 font-bold tracking-widest mt-0.5">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Chart: Habitos vs Finanzas */}
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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-slate-300">Ahorro Diario ($)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            <span className="text-slate-300">Hábitos de Autocontrol</span>
          </div>
        </div>

        {/* Combined Chart Container */}
        <div className="relative w-full h-44 pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 140">
            <defs>
              <linearGradient id="metricPrimaryGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line className="text-slate-800" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="320" y1="20" y2="20" />
            <line className="text-slate-800" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="320" y1="60" y2="60" />
            <line className="text-slate-800" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="320" y1="100" y2="100" />
            
            <rect className="text-emerald-500/40" fill="currentColor" height="55" rx="3" width="16" x="15" y="65" />
            <rect className="text-emerald-500/50" fill="currentColor" height="72" rx="3" width="16" x="58" y="48" />
            <rect className="text-emerald-500/35" fill="currentColor" height="42" rx="3" width="16" x="101" y="78" />
            <rect className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="currentColor" height="88" rx="3" width="16" x="144" y="32" />
            <rect className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="currentColor" height="96" rx="3" width="16" x="187" y="24" />
            <rect className="text-emerald-500/50" fill="currentColor" height="65" rx="3" width="16" x="230" y="55" />
            <rect className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" fill="currentColor" height="102" rx="3" width="16" x="273" y="18" />

            <path d="M 23 70 Q 66 45, 109 72 T 152 35 T 195 25 T 238 52 T 281 18 L 281 120 L 23 120 Z" fill="url(#metricPrimaryGradient)" />
            <path className="drop-shadow-[0_0_10px_#22d3ee]" d="M 23 70 Q 66 45, 109 72 T 152 35 T 195 25 T 238 52 T 281 18" fill="none" stroke="#22d3ee" strokeLinecap="round" strokeWidth="2.5" />

            <circle className="text-cyan-400 fill-[#090d16] stroke-cyan-400" cx="23" cy="70" r="3.5" strokeWidth="2" />
            <circle className="text-cyan-400 fill-[#090d16] stroke-cyan-400" cx="66" cy="45" r="3.5" strokeWidth="2" />
            <circle className="text-cyan-400 fill-[#090d16] stroke-cyan-400" cx="109" cy="72" r="3.5" strokeWidth="2" />
            <circle className="text-cyan-400 fill-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" cx="152" cy="35" r="4" />
            <circle className="text-cyan-400 fill-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" cx="195" cy="25" r="4" />
            <circle className="text-cyan-400 fill-[#090d16] stroke-cyan-400" cx="238" cy="52" r="3.5" strokeWidth="2" />
            <circle className="text-cyan-400 fill-cyan-300 drop-shadow-[0_0_10px_#22d3ee]" cx="281" cy="18" r="4.5" />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between px-2 text-slate-400 text-[10px] font-bold">
          <span>Sem 1</span>
          <span>Sem 2</span>
          <span>Sem 3</span>
          <span>Sem 4</span>
          <span>Sem 5</span>
        </div>

        {/* AI Intelligence Discovery Banner */}
        <div className="mt-2 rounded-xl frosted-pill border border-amber-500/25 p-3 flex items-start gap-2.5 shadow-inner">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              insights
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Descubrimiento Inteligente</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-[12px] text-slate-300 mt-0.5 leading-snug">
              En los días que registraste tus gastos y meditaste, tu tasa de ahorro aumentó un{' '}
              <strong className="text-emerald-400 font-bold">+34%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Habit Heatmap (GitHub Style 30-Day Matrix) */}
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
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-900/60" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </div>
        </div>

        {/* Matrix Grid: 5 rows x 6 columns = 30 days */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {Array.from({ length: 29 }).map((_, idx) => {
            const dayNum = String(idx + 1).padStart(2, '0');
            const isGreen = [1, 2, 4, 7, 8, 9, 11, 12, 14, 15, 17, 18, 19, 20, 22, 23, 24, 26, 27, 28, 29].includes(idx + 1);
            const isIndigo = [3, 6, 10, 16, 21, 25].includes(idx + 1);
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 rounded-xl frosted-pill border border-cyan-500/15 text-center"
              >
                <span className="text-[10px] text-slate-400 font-bold">{dayNum}</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1 ${
                    isGreen
                      ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                      : isIndigo
                      ? 'bg-cyan-700/60'
                      : 'bg-slate-800'
                  }`}
                />
              </div>
            );
          })}
          {/* Day 30 / HOY */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl frosted-pill border-2 border-cyan-400 text-center shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <span className="text-[10px] text-cyan-300 font-extrabold">HOY</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 mt-1 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>
      </div>

      {/* Daily Task Performance (Donut Chart & Metrics) */}
      <div className="rounded-2xl frosted-card border border-cyan-500/20 p-4.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Distribución Operativa
            </span>
            <h3 className="text-[16px] font-bold text-white tracking-tight">Rendimiento de Tareas</h3>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full frosted-pill border border-cyan-500/25 text-cyan-300 font-bold">
            48 Completadas
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Donut Chart */}
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
              {/* Canceladas: 4% */}
              <circle
                className="text-rose-500"
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="229.2"
                strokeLinecap="round"
                strokeWidth="9"
              />
              {/* Pospuestas: 12% */}
              <circle
                className="text-amber-400"
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="210.1"
                strokeLinecap="round"
                strokeWidth="9"
                transform="rotate(14.4 50 50)"
              />
              {/* A tiempo: 84% */}
              <circle
                className="text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]"
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="38.2"
                strokeLinecap="round"
                strokeWidth="9"
                transform="rotate(57.6 50 50)"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[26px] font-extrabold text-white leading-none drop-shadow-[0_0_8px_#22d3ee]">84%</span>
              <span className="text-[10px] text-cyan-300 font-bold mt-0.5">A tiempo</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                <span className="text-white font-medium">A tiempo</span>
              </div>
              <span className="text-cyan-300 font-bold">84%</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                <span className="text-slate-300">Pospuestas</span>
              </div>
              <span className="text-slate-400 font-semibold">12%</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                <span className="text-slate-300">Canceladas</span>
              </div>
              <span className="text-slate-400 font-semibold">4%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-1">
              <div className="bg-cyan-400 h-full" style={{ width: '84%' }} />
              <div className="bg-amber-400 h-full" style={{ width: '12%' }} />
              <div className="bg-rose-500 h-full" style={{ width: '4%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Desbloqueados */}
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
          <span className="text-[10px] text-cyan-300 font-bold">3/3 este mes</span>
        </div>

        <div className="flex flex-col space-y-2.5 pt-1">
          {/* Badge 1 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl frosted-pill border border-emerald-500/25 transition-transform active:scale-[0.98] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(52,211,153,0.3)]">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-white tracking-tight truncate">Máster de Finanzas</h4>
                <span className="text-[10px] font-bold text-emerald-300">Nivel III</span>
              </div>
              <p className="text-[12px] text-slate-400 truncate">Ahorro constante 3 meses seguidos</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl frosted-pill border border-amber-500/25 transition-transform active:scale-[0.98] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(251,191,36,0.3)]">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-white tracking-tight truncate">Racha Imparable</h4>
                <span className="text-[10px] font-bold text-amber-300">14 Días</span>
              </div>
              <p className="text-[12px] text-slate-400 truncate">Completando todos los hábitos diarios</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl frosted-pill border border-cyan-500/25 transition-transform active:scale-[0.98] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(34,211,238,0.3)]">
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-white tracking-tight truncate">Eficiencia Total</h4>
                <span className="text-[10px] font-bold text-cyan-300">100% Hit</span>
              </div>
              <p className="text-[12px] text-slate-400 truncate">5 días seguidos sin tareas pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Live Status Indicator */}
      <div className="flex items-center justify-center gap-2 pt-2 text-slate-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_6px_#22d3ee]" />
        <span className="text-[10px] font-bold tracking-wide text-cyan-300">Motor de análisis predictivo activo</span>
      </div>
    </div>
  );
}
