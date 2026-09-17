import { DashboardTab } from '../types';
import {
  Flame,
  CheckSquare,
  Target,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

interface BottomNavProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenZen?: () => void;
  pendingTasksCount?: number;
}

export function BottomNav({
  currentTab,
  onSelectTab,
  onOpenZen,
  pendingTasksCount = 2,
}: BottomNavProps) {
  const tabs = [
    {
      id: 'hoy' as DashboardTab,
      label: 'Hoy',
      Icon: Flame,
      glowColor: 'rgba(34, 211, 238, 0.7)'
    },
    {
      id: 'tareas' as DashboardTab,
      label: 'Tareas',
      Icon: CheckSquare,
      badge: pendingTasksCount,
      glowColor: 'rgba(52, 211, 153, 0.7)'
    },
    {
      id: 'metas' as DashboardTab,
      label: 'Metas',
      Icon: Target,
      glowColor: 'rgba(250, 204, 21, 0.7)'
    },
    {
      id: 'metricas' as DashboardTab,
      label: 'Métricas',
      Icon: TrendingUp,
      glowColor: 'rgba(129, 140, 248, 0.7)'
    },
    {
      id: 'calendario' as DashboardTab,
      label: 'Agenda',
      Icon: CalendarDays,
      glowColor: 'rgba(56, 189, 248, 0.7)'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070a11]/92 backdrop-blur-2xl border-t border-cyan-500/25 px-2 py-1.5 flex items-center justify-around max-w-[430px] mx-auto shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const IconComponent = tab.Icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 rounded-2xl cursor-pointer group select-none ${
              isActive
                ? 'text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            {/* Animated Glow Pill behind active item */}
            {isActive && (
              <span
                className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-transparent border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.25)] pointer-events-none"
              />
            )}

            {/* Icon Wrapper with glowing badge */}
            <div className="relative flex items-center justify-center w-8 h-7 z-10">
              <IconComponent
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? 'scale-110 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] stroke-[2.4]'
                    : 'text-slate-400 group-hover:text-cyan-300 group-hover:scale-105 stroke-[1.8]'
                }`}
              />

              {/* Dynamic Task Badge */}
              {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_#22d3ee] animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-[10px] tracking-tight z-10 transition-colors ${
                isActive ? 'font-extrabold text-cyan-200' : 'font-medium text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {tab.label}
            </span>

            {/* Active luminous indicator point */}
            {isActive ? (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
