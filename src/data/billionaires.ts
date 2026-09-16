import { BillionaireTitan } from '../types';

export const BILLIONAIRE_TITANS: BillionaireTitan[] = [
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    empire: 'Tesla & SpaceX',
    netWorth: '$248,000 M',
    title: 'Arquitecto de Futuros',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    quote: 'Si algo es lo suficientemente importante, debes intentarlo incluso si el resultado probable es el fracaso.',
    goldenHabit: {
      title: 'Time-Boxing de 5 Minutos',
      subtitle: 'Foco de ingeniería extrema',
      description: 'Divide su agenda diaria en bloques de 5 minutos. Si una reunión o tarea no agrega valor técnico o de producto, se elimina de inmediato.',
      category: 'productivity',
      timeBlock: 'morning',
      icon: 'bolt'
    },
    routineKey: 'Regla de Primeros Principios & Cero reuniones vacías',
    stats: {
      disciplineScore: 99,
      hoursSleep: '6.0 hrs',
      dailyReadingTime: '2.5 hrs'
    }
  },
  {
    id: 'warren-buffett',
    name: 'Warren Buffett',
    empire: 'Berkshire Hathaway',
    netWorth: '$138,000 M',
    title: 'El Oráculo del Interés Compuesto',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    quote: 'El interés compuesto no solo aplica al dinero; aplica al conocimiento y a los hábitos que repites a diario.',
    goldenHabit: {
      title: 'Regla 5/25 & 500 Páginas',
      subtitle: 'Lectura voraz y paciencia infinita',
      description: 'Dedica el 80% de su jornada laboral únicamente a leer y pensar. Selecciona 25 metas, marca las 5 principales y evita las otras 20 a toda costa.',
      category: 'mind',
      timeBlock: 'morning',
      icon: 'auto_stories'
    },
    routineKey: 'Paciencia implacable & Círculo de competencia',
    stats: {
      disciplineScore: 98,
      hoursSleep: '8.0 hrs',
      dailyReadingTime: '5.0 hrs'
    }
  },
  {
    id: 'jeff-bezos',
    name: 'Jeff Bezos',
    empire: 'Amazon & Blue Origin',
    netWorth: '$204,000 M',
    title: 'Visionario del Día 1',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote: 'Si tomas tres buenas decisiones de alta calidad al día, es suficiente. La calidad supera con creces a la cantidad.',
    goldenHabit: {
      title: '3 Decisiones Clave & 8h de Sueño',
      subtitle: 'Mañanas de reflexión sin prisa',
      description: 'Protege sus mañanas para pensar con calma ("puttering time"). Programa sus reuniones de máxima exigencia intelectual a las 10:00 AM antes de almorzar.',
      category: 'productivity',
      timeBlock: 'morning',
      icon: 'psychology'
    },
    routineKey: 'Filosofía del Día 1 & Pensamiento a 10 años',
    stats: {
      disciplineScore: 96,
      hoursSleep: '8.0 hrs',
      dailyReadingTime: '1.5 hrs'
    }
  },
  {
    id: 'steve-jobs',
    name: 'Steve Jobs',
    empire: 'Apple Inc.',
    netWorth: 'Legado Eterno',
    title: 'Genio de la Simplicidad Radical',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    quote: 'La innovación consiste en decir no a mil cosas para concentrar toda tu energía en la única que importa.',
    goldenHabit: {
      title: 'Caminatas de Enfoque & Eliminación Radical',
      subtitle: 'Foco obsesivo en el diseño esencial',
      description: 'Hacía caminatas diarias de 45 minutos para resolver problemas complejos y usaba el mismo atuendo diario para eliminar la fatiga de decisión.',
      category: 'mind',
      timeBlock: 'morning',
      icon: 'directions_walk'
    },
    routineKey: 'Simplicidad obsesiva & Búsqueda de la excelencia',
    stats: {
      disciplineScore: 99,
      hoursSleep: '7.0 hrs',
      dailyReadingTime: '2.0 hrs'
    }
  },
  {
    id: 'jensen-huang',
    name: 'Jensen Huang',
    empire: 'NVIDIA Corporation',
    netWorth: '$118,000 M',
    title: 'Titán de la Inteligencia Artificial',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    quote: 'La grandeza no viene de la inteligencia, viene del carácter. Y el carácter se forja a través de la perseverancia.',
    goldenHabit: {
      title: 'Cero Complacencia Diaria',
      subtitle: 'Planificación plana y sin jerarquías',
      description: 'Revisa problemas desde los principios de la física cada mañana a primera hora. No tiene oficina formal fija; camina por los laboratorios de innovación.',
      category: 'productivity',
      timeBlock: 'morning',
      icon: 'memory'
    },
    routineKey: 'Cultura de primeros principios y humildad operativa',
    stats: {
      disciplineScore: 97,
      hoursSleep: '6.5 hrs',
      dailyReadingTime: '2.0 hrs'
    }
  },
  {
    id: 'bill-gates',
    name: 'Bill Gates',
    empire: 'Microsoft & Gates Ventures',
    netWorth: '$126,000 M',
    title: 'Arquitecto de Sistemas Globales',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    quote: 'La mayoría sobrestima lo que puede hacer en un año y subestima lo que puede lograr en una década de constancia.',
    goldenHabit: {
      title: 'Semana de Pensamiento (Think Week)',
      subtitle: 'Aislamiento estratégico y lectura',
      description: 'Se aísla periódicamente sin dispositivos para reflexionar y leer monografías complejas. Lee mínimo 50 libros al año tomando notas al margen.',
      category: 'mind',
      timeBlock: 'night',
      icon: 'menu_book'
    },
    routineKey: 'Lectura analítica profunda & Mapeo de soluciones',
    stats: {
      disciplineScore: 95,
      hoursSleep: '7.0 hrs',
      dailyReadingTime: '3.0 hrs'
    }
  },
  {
    id: 'bernard-arnault',
    name: 'Bernard Arnault',
    empire: 'LVMH Moët Hennessy',
    netWorth: '$192,000 M',
    title: 'Emperador del Lujo y Perfección',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    quote: 'No me preocupo por los próximos cinco años; me preocupo por que nuestras marcas sean deseadas dentro de un siglo.',
    goldenHabit: {
      title: 'Paseo de Perfección en Tiendas',
      subtitle: 'Inspección de calidad al milímetro',
      description: 'Cada sábado por la mañana visita personalmente las boutiques de sus marcas para inspeccionar la iluminación, atención y detalles artesanales.',
      category: 'finance',
      timeBlock: 'morning',
      icon: 'diamond'
    },
    routineKey: 'Paciencia a escala centenaria & Estándar supremo',
    stats: {
      disciplineScore: 96,
      hoursSleep: '7.5 hrs',
      dailyReadingTime: '1.5 hrs'
    }
  },
  {
    id: 'charlie-munger',
    name: 'Charlie Munger',
    empire: 'Berkshire & Daily Journal',
    netWorth: 'Legado de Sabiduría',
    title: 'Filósofo de los Modelos Mentales',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    quote: 'Todos los días intenta acostarte siendo un poco más sabio de lo que eras al levantarte.',
    goldenHabit: {
      title: 'Inversión Mental ("Invert, Always Invert")',
      subtitle: 'Evitar la estupidez antes de buscar el genio',
      description: 'En vez de preguntarse cómo tener éxito, analiza qué causa el fracaso catastrófico en cualquier situación y se asegura de evitarlo rigurosamente.',
      category: 'mind',
      timeBlock: 'night',
      icon: 'swap_calls'
    },
    routineKey: 'Red de celosía de modelos mentales multidisciplinarios',
    stats: {
      disciplineScore: 99,
      hoursSleep: '8.0 hrs',
      dailyReadingTime: '6.0 hrs'
    }
  }
];
