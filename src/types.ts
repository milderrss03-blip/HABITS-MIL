export interface Habit {
  id: string;
  title: string;
  subtitle: string;
  streak: number;
  completed: boolean;
  category: 'mind' | 'health' | 'finance' | 'productivity';
  timeBlock: 'morning' | 'night';
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'finance' | 'fitness' | 'mind' | 'custom';
  categoryLabel: string;
  badge: string;
  current: number;
  target: number;
  unit: string;
  prefix?: string;
  color?: 'emerald' | 'cyan' | 'indigo' | 'amber';
  image?: string;
  timeline?: string;
  period?: 'mensual' | 'anual';
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  date?: string; // Formato YYYY-MM-DD para asignación precisa por semana y día
  priority: 'urgente' | 'normal';
  category: 'trabajo' | 'finanzas' | 'personal';
  subtasks?: { title: string; completed: boolean }[];
  tag?: string;
  reminder?: boolean;
  reminderCustomText?: string;
  reminderSound?: 'crystal' | 'cyber' | 'zen' | 'victory' | 'chime';
  reminderIcon?: 'check' | 'zap' | 'flame' | 'diamond' | 'briefcase' | 'star' | 'target' | 'bell';
  reminderColor?: 'cyan' | 'gold' | 'rose' | 'emerald' | 'purple';
}

export interface Quote {
  text: string;
  author: string;
  tag?: string;
}

export interface BillionaireTitan {
  id: string;
  name: string;
  empire: string;
  netWorth: string;
  title: string;
  avatarUrl: string;
  quote: string;
  goldenHabit: {
    title: string;
    subtitle: string;
    description: string;
    category: 'mind' | 'health' | 'finance' | 'productivity';
    timeBlock: 'morning' | 'night';
    icon: string;
  };
  routineKey: string;
  stats: {
    disciplineScore: number;
    hoursSleep: string;
    dailyReadingTime: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'event' | 'habit' | 'task' | 'goal';
  date: string; // e.g. "2026-09-12" or day number string
  timeStart: string; // e.g. "09:00"
  timeEnd: string; // e.g. "10:30"
  allDay?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan';
  desc?: string;
  tag?: string;
  location?: string;
  completed?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  role: string;
  streakDays: number;
  isAuthenticated: boolean;
  provider?: 'google' | 'gmail' | 'password';
}

export type ActiveScreen = 'welcome' | 'dashboard' | 'login';
export type DashboardTab = 'hoy' | 'tareas' | 'calendario' | 'metas' | 'metricas';
