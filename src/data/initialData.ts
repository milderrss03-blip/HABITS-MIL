import { Habit, Goal, DailyTask, Quote, CalendarEvent } from '../types';

export const INITIAL_QUOTES: Quote[] = [
  {
    text: "«La motivación te hace empezar, el hábito te hace continuar.»",
    author: "Jim Ryun",
    tag: "CONTINUIDAD ABSOLUTA"
  },
  {
    text: "«Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.»",
    author: "Aristóteles",
    tag: "FILOSOFÍA CLÁSICA"
  },
  {
    text: "«No nos elevamos al nivel de nuestras metas. Caemos al nivel de nuestros sistemas.»",
    author: "James Clear",
    tag: "HÁBITOS ATÓMICOS"
  },
  {
    text: "«Primero formamos nuestros hábitos, y luego nuestros hábitos nos forman a nosotros.»",
    author: "John Dryden",
    tag: "ARQUITECTURA MENTAL"
  },
  {
    text: "«La disciplina es el puente invisible pero inquebrantable entre el deseo y el logro.»",
    author: "Jim Rohn",
    tag: "DISCIPLINA DIARIA"
  },
  {
    text: "«Tienes poder sobre tu mente, no sobre los acontecimientos. Comprende esto y hallarás la fuerza.»",
    author: "Marco Aurelio",
    tag: "ESTOICISMO APLICADO"
  }
];

export const INITIAL_HABITS: Habit[] = [];

export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_TASKS: DailyTask[] = [];

export const INITIAL_EVENTS: CalendarEvent[] = [];

