export interface MillionaireWisdomItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  habitTitle: string;
  habitDescription: string;
  slot: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  slotLabel: string;
  dayBadge: string;
  suggestedHabitName: string;
  suggestedHabitCategory: 'health' | 'finance' | 'mind' | 'productivity';
  suggestedDuration: string;
  tag: string;
}

export const MILLIONAIRE_WISDOM: MillionaireWisdomItem[] = [
  // --- DAWN / MADRUGADA (05:00 - 08:59) ---
  {
    id: 'dawn-buffett',
    quote: '«Invierte en ti mismo tanto como puedas; tú eres con diferencia tu propio mayor activo.»',
    author: 'Warren Buffett',
    role: 'Uno de los inversionistas más exitosos de la historia',
    habitTitle: 'La Hora Sagrada de Lectura',
    habitDescription: 'Warren Buffett dedica el 80% de su mañana a leer y pensar sin el teléfono cerca. El conocimiento acumulado funciona como el interés compuesto.',
    slot: 'dawn',
    slotLabel: 'Amanecer de Élite (05:00 - 09:00)',
    dayBadge: 'Ritual Matutino',
    suggestedHabitName: '30 min de lectura de alto valor',
    suggestedHabitCategory: 'finance',
    suggestedDuration: '30 min',
    tag: 'INTERÉS COMPUESTO'
  },
  {
    id: 'dawn-cook',
    quote: '«Despertar a las 4:30 AM me devuelve el control de mi día antes de que el mundo empiece a exigir mi energía.»',
    author: 'Tim Cook',
    role: 'CEO de Apple',
    habitTitle: 'Ganar la Mañana Antes del Amanecer',
    habitDescription: 'Inicia con entrenamiento físico y revisión de prioridades estratégicas antes de responder un solo correo o mensaje reactivo.',
    slot: 'dawn',
    slotLabel: 'Amanecer de Élite (05:00 - 09:00)',
    dayBadge: 'Dominio del Tiempo',
    suggestedHabitName: 'Entrenamiento y activación matutina',
    suggestedHabitCategory: 'health',
    suggestedDuration: '45 min',
    tag: 'DISCIPLINA DE TITANES'
  },
  {
    id: 'dawn-jobs',
    quote: '«Si hoy fuera el último día de tu vida, ¿querrías hacer lo que vas a hacer hoy? Si la respuesta es no durante muchos días seguidos, cambia algo.»',
    author: 'Steve Jobs',
    role: 'Co-fundador de Apple & Pixar',
    habitTitle: 'Claridad Radical Frente al Espejo',
    habitDescription: 'Audita tus intenciones del día con una sola pregunta implacable: elimina lo superfluo y concéntrate exclusivamente en lo que trasciende.',
    slot: 'dawn',
    slotLabel: 'Amanecer de Élite (05:00 - 09:00)',
    dayBadge: 'Visión Inflexible',
    suggestedHabitName: 'Definir 1 prioridad no negociable del día',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '10 min',
    tag: 'FOCO RADICAL'
  },
  {
    id: 'dawn-naval',
    quote: '«Si no eres dueño de tu tiempo y de tu propiedad intelectual, nunca alcanzarás la libertad financiera real.»',
    author: 'Naval Ravikant',
    role: 'Inversor ángel y pensador de Silicon Valley',
    habitTitle: 'Construir Activos Antes de Consumir',
    habitDescription: 'La primera hora del día debe ser de creación (estudio, código, proyectos), jamás de consumo pasivo de redes sociales.',
    slot: 'dawn',
    slotLabel: 'Amanecer de Élite (05:00 - 09:00)',
    dayBadge: 'Libertad Financiera',
    suggestedHabitName: 'Bloque creativo sin redes ni notificaciones',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '45 min',
    tag: 'APALANCAMIENTO'
  },

  // --- MORNING / MAÑANA (09:00 - 12:59) ---
  {
    id: 'morning-bezos',
    quote: '«Como ejecutivo, te pagan por tomar pocas decisiones de alta calidad, no miles de decisiones apresuradas.»',
    author: 'Jeff Bezos',
    role: 'Fundador de Amazon',
    habitTitle: 'Ventana de Máxima Claridad Cognitiva',
    habitDescription: 'Jeff Bezos agenda sus reuniones más trascendentales entre las 10:00 AM y las 12:00 PM. Tu energía mental es un recurso escaso.',
    slot: 'morning',
    slotLabel: 'Bloque de Alto Juicio (09:00 - 13:00)',
    dayBadge: 'Toma de Decisiones',
    suggestedHabitName: 'Resolver la tarea más difícil primero',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '60 min',
    tag: 'ENERGÍA COGNITIVA'
  },
  {
    id: 'morning-munger',
    quote: '«Pasa cada día intentando ser un poco más sabio de lo que eras al levantarte. Día a día, paso a paso, llegarás lejos.»',
    author: 'Charlie Munger',
    role: 'Socio de Berkshire Hathaway',
    habitTitle: 'El Modelo Mental de la Inversión',
    habitDescription: 'Pregúntate: ¿Qué hábitos me llevarían a la quiebra o al estancamiento? Identifícalos e invierte tus esfuerzos en no cometerlos.',
    slot: 'morning',
    slotLabel: 'Bloque de Alto Juicio (09:00 - 13:00)',
    dayBadge: 'Modelos Mentales',
    suggestedHabitName: 'Anotar lección aprendida y revisión de errores',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '15 min',
    tag: 'PENSAMIENTO CRÍTICO'
  },
  {
    id: 'morning-musk',
    quote: '«Concéntrate en la señal frente al ruido. No gastes tiempo en cosas que en realidad no hacen que el producto sea mejor.»',
    author: 'Elon Musk',
    role: 'CEO de Tesla, SpaceX & xAI',
    habitTitle: 'Eliminación Quirúrgica del Ruido',
    habitDescription: 'Aplica el principio de los primeros principios: cuestiona todas las suposiciones y ataca el problema raíz sin perderte en burocracia.',
    slot: 'morning',
    slotLabel: 'Bloque de Alto Juicio (09:00 - 13:00)',
    dayBadge: 'Eficiencia Pura',
    suggestedHabitName: 'Sprint de trabajo profundo (Deep Work)',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '50 min',
    tag: 'PRIMEROS PRINCIPIOS'
  },

  // --- AFTERNOON / TARDE (13:00 - 18:59) ---
  {
    id: 'afternoon-gates',
    quote: '«La paciencia y la capacidad de decir que no a distracciones seductoras es el mayor secreto de la productividad.»',
    author: 'Bill Gates',
    role: 'Co-fundador de Microsoft',
    habitTitle: 'El Poder del «No» Estratégico',
    habitDescription: 'Los millonarios dicen «no» al 99% de las peticiones para proteger su atención. Si algo no suma a tus 3 metas principales, descártalo.',
    slot: 'afternoon',
    slotLabel: 'Enfoque & Blindaje (13:00 - 19:00)',
    dayBadge: 'Blindaje de Tiempo',
    suggestedHabitName: 'Bloquear 1 hora sin interrupciones',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '60 min',
    tag: 'ATENCIÓN SELECTIVA'
  },
  {
    id: 'afternoon-dalio',
    quote: '«El dolor más la reflexión equivale al progreso. Si te equivocas y aprendes, te estás haciendo imparable.»',
    author: 'Ray Dalio',
    role: 'Fundador de Bridgewater Associates',
    habitTitle: 'Auditoría de Calibración de la Tarde',
    habitDescription: 'A mitad de la jornada, haz una pausa de 3 minutos para evaluar si sigues en rumbo o caíste en la trampa de la procrastinación productiva.',
    slot: 'afternoon',
    slotLabel: 'Enfoque & Blindaje (13:00 - 19:00)',
    dayBadge: 'Mejora Continua',
    suggestedHabitName: 'Pausa de hidratación consciente y postura',
    suggestedHabitCategory: 'health',
    suggestedDuration: '5 min',
    tag: 'RADICAL TRANSPARENCY'
  },
  {
    id: 'afternoon-marcus',
    quote: '«Poco se necesita para una vida feliz; todo está en tu interior, en tu forma de pensar.»',
    author: 'Marco Aurelio',
    role: 'Emperador Romano & Filósofo Estoico',
    habitTitle: 'Dominio Emocional en la Presión',
    habitDescription: 'No reacciones con ira o estrés ante imprevistos del trabajo. Respira, asume el control interno y ejecuta serenamente.',
    slot: 'afternoon',
    slotLabel: 'Enfoque & Blindaje (13:00 - 19:00)',
    dayBadge: 'Ecuanimidad Estoica',
    suggestedHabitName: 'Respiración diafragmática 4-7-8',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '5 min',
    tag: 'FORTALEZA MENTAL'
  },

  // --- EVENING / NOCHE (19:00 - 22:59) ---
  {
    id: 'evening-rohn',
    quote: '«Nunca empieces un día hasta que lo hayas terminado en papel la noche anterior.»',
    author: 'Jim Rohn',
    role: 'Mentor de finanzas personales y éxito',
    habitTitle: 'Planificación de la Victoria Previa',
    habitDescription: 'Antes de acostarte, anota las 3 acciones decisivas de mañana. Tu mente subconsciente procesará las soluciones durante la noche.',
    slot: 'evening',
    slotLabel: 'Cierre Estratégico (19:00 - 23:00)',
    dayBadge: 'Arquitectura de Mañana',
    suggestedHabitName: 'Diseñar la agenda de mañana en 5 min',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '5 min',
    tag: 'ANTICIPACIÓN'
  },
  {
    id: 'evening-franklin',
    quote: '«¿Qué bien he hecho hoy? Esta era mi pregunta cada noche antes de cerrar los ojos.»',
    author: 'Benjamin Franklin',
    role: 'Polímata, inventor y Padre Fundador',
    habitTitle: 'Examen de Conciencia y Victorias',
    habitDescription: 'Cierra tu día reconociendo al menos 3 logros y una oportunidad de mejora. La autocrítica constructiva forja el carácter de liderazgo.',
    slot: 'evening',
    slotLabel: 'Cierre Estratégico (19:00 - 23:00)',
    dayBadge: 'Auditoría Nocturna',
    suggestedHabitName: 'Escribir 3 victorias y gratitudes de hoy',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '5 min',
    tag: 'EXCELENCIA PERSONAL'
  },
  {
    id: 'evening-oprah',
    quote: '«La verdadera riqueza es estar agradecido por lo que tienes mientras trabajas por lo que deseas.»',
    author: 'Oprah Winfrey',
    role: 'Filántropa y empresaria multimillonaria',
    habitTitle: 'El Diario de Gratitud de Alto Rendimiento',
    habitDescription: 'El agradecimiento desactiva el cortisol y programa la mente en modo de abundancia y apertura hacia nuevas oportunidades.',
    slot: 'evening',
    slotLabel: 'Cierre Estratégico (19:00 - 23:00)',
    dayBadge: 'Mentalidad de Abundancia',
    suggestedHabitName: 'Desconexión digital 45 min antes de dormir',
    suggestedHabitCategory: 'health',
    suggestedDuration: '45 min',
    tag: 'PAZ MENTAL'
  },

  // --- NIGHT / REPOSO (23:00 - 04:59) ---
  {
    id: 'night-bezos-sleep',
    quote: '«Ocho horas de sueño son la mejor inversión para un líder. Si recortas el sueño, tomas peores decisiones y el daño es incalculable.»',
    author: 'Jeff Bezos',
    role: 'Fundador de Amazon',
    habitTitle: 'El Sueño como Ventaja Asimétrica',
    habitDescription: 'Los millonarios tratan el sueño como medicina de alta precisión: habitación oscura, temperatura fresca y cero pantallas en la cama.',
    slot: 'night',
    slotLabel: 'Regeneración Profunda (23:00 - 05:00)',
    dayBadge: 'Ventaja Biológica',
    suggestedHabitName: 'Dormir 7 a 8 horas continuas en oscuridad',
    suggestedHabitCategory: 'health',
    suggestedDuration: '8 horas',
    tag: 'REGENERACIÓN CELULAR'
  },
  {
    id: 'night-naval-calm',
    quote: '«La mente tranquila es la máxima forma de riqueza. Si no puedes estar sentado en una habitación solo en silencio, no eres libre.»',
    author: 'Naval Ravikant',
    role: 'Inversor & Filósofo',
    habitTitle: 'Silencio Interior y Desapego',
    habitDescription: 'Suelta todas las cargas del día. Nada de lo pendiente puede resolverse ahora. Duerme sabiendo que mañana atacarás con energía renovada.',
    slot: 'night',
    slotLabel: 'Regeneración Profunda (23:00 - 05:00)',
    dayBadge: 'Serenidad Absoluta',
    suggestedHabitName: 'Meditación o respiración profunda nocturna',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '10 min',
    tag: 'PAZ INTERIOR'
  },
  {
    id: 'dawn-huang',
    quote: '«Las expectativas muy altas son enemigas de la resiliencia. Lo que te hace exitoso no es la suerte, sino la capacidad de soportar la dificultad con entusiasmo.»',
    author: 'Jensen Huang',
    role: 'Fundador y CEO de NVIDIA',
    habitTitle: 'La Resiliencia como Superpoder',
    habitDescription: 'Empieza la jornada recordando que cada obstáculo técnico o financiero es una barrera de entrada que tus competidores no tolerarán.',
    slot: 'dawn',
    slotLabel: 'Amanecer de Élite (05:00 - 09:00)',
    dayBadge: 'Tenacidad Imparable',
    suggestedHabitName: 'Afrontar el desafío más incómodo de primero',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '30 min',
    tag: 'TOLERANCIA A LA PRESIÓN'
  },
  {
    id: 'morning-cuban',
    quote: '«El trabajo no se mide en horas en la oficina, sino en la preparación obsessiva para ser más inteligente que tu competencia.»',
    author: 'Mark Cuban',
    role: 'Inversionista multimillonario y dueño de los Dallas Mavericks',
    habitTitle: 'Curiosidad Implacable Diaria',
    habitDescription: 'Dedica cada mañana a aprender las nuevas tendencias de tu industria antes de que se conviertan en consenso general.',
    slot: 'morning',
    slotLabel: 'Bloque de Alto Juicio (09:00 - 13:00)',
    dayBadge: 'Ventaja Competitiva',
    suggestedHabitName: '20 min de investigación de tendencias y mercado',
    suggestedHabitCategory: 'finance',
    suggestedDuration: '20 min',
    tag: 'VENTAJA ASIMÉTRICA'
  },
  {
    id: 'morning-kobe',
    quote: '«Los grandes resultados son el resultado inevitable de hacer lo que debes hacer sin importar cómo te sientas en ese momento.»',
    author: 'Kobe Bryant',
    role: 'Leyenda del deporte e inversor de capital de riesgo',
    habitTitle: 'La Mentalidad Mamba',
    habitDescription: 'Elimina las negociaciones contigo mismo. Si tu plan dice que debes entrenar o avanzar a las 10:00 AM, ejecútalo al instante.',
    slot: 'morning',
    slotLabel: 'Bloque de Alto Juicio (09:00 - 13:00)',
    dayBadge: 'Cero Excusas',
    suggestedHabitName: 'Bloque de disciplina estricta sin postergación',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '45 min',
    tag: 'MENTALIDAD MAMBA'
  },
  {
    id: 'afternoon-blakely',
    quote: '«No tengas miedo de lo que no sabes; ese puede ser tu mayor activo para hacer las cosas de una forma completamente diferente.»',
    author: 'Sara Blakely',
    role: 'Fundadora multimillonaria de Spanx',
    habitTitle: 'Celebrar el Fracaso Diario',
    habitDescription: 'Pregúntate en la tarde: ¿En qué fallé hoy por intentar algo audaz? Si no fallaste en nada, no te estás exigiendo lo suficiente.',
    slot: 'afternoon',
    slotLabel: 'Enfoque & Blindaje (13:00 - 19:00)',
    dayBadge: 'Audacia e Innovación',
    suggestedHabitName: 'Identificar 1 acción audaz fuera de la zona de confort',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '15 min',
    tag: 'INNOVACIÓN PURA'
  },
  {
    id: 'afternoon-arnault',
    quote: '«El dinero es solo una consecuencia de la excelencia obsesiva. Concéntrate en la perfección del detalle y el éxito vendrá solo.»',
    author: 'Bernard Arnault',
    role: 'Presidente y CEO de LVMH',
    habitTitle: 'El Culto a la Calidad Absoluta',
    habitDescription: 'Revisa tu trabajo vespertino con la lupa de un artesano de lujo: la pulcritud y el estándar elevado atraen grandes oportunidades.',
    slot: 'afternoon',
    slotLabel: 'Enfoque & Blindaje (13:00 - 19:00)',
    dayBadge: 'Estándar Mundial',
    suggestedHabitName: 'Revisión y pulido de entregables críticos',
    suggestedHabitCategory: 'productivity',
    suggestedDuration: '30 min',
    tag: 'EXCELENCIA OBSESIVA'
  },
  {
    id: 'evening-rockefeller',
    quote: '«Aquel que trabaja todo el día no tiene tiempo para ganar dinero. Debes reservar tiempo para reflexionar sobre tu estrategia financiera.»',
    author: 'John D. Rockefeller',
    role: 'El primer multimillonario moderno de la historia',
    habitTitle: 'La Hora Semanal del Estratega',
    habitDescription: 'Cierra la tarde auditando tus números: ingresos, egresos e inversiones. El orden en tus números es la madre de la riqueza duradera.',
    slot: 'evening',
    slotLabel: 'Cierre Estratégico (19:00 - 23:00)',
    dayBadge: 'Riqueza Sistemática',
    suggestedHabitName: 'Auditoría de 5 minutos de flujo financiero',
    suggestedHabitCategory: 'finance',
    suggestedDuration: '10 min',
    tag: 'MAESTRÍA FINANCIERA'
  },
  {
    id: 'evening-seneca',
    quote: '«No es que tengamos poco tiempo, sino que perdemos mucho. La vida es suficientemente larga si sabemos emplearla.»',
    author: 'Séneca',
    role: 'Filósofo estoico, estadista y uno de los hombres más ricos de Roma',
    habitTitle: 'La Auditoría Nocturna del Tiempo',
    habitDescription: 'Antes de dormir, revisa cuántas horas invertiste en actividades que construyen tu futuro versus distracciones que solo te entretuvieron.',
    slot: 'evening',
    slotLabel: 'Cierre Estratégico (19:00 - 23:00)',
    dayBadge: 'Filosofía del Tiempo',
    suggestedHabitName: 'Balance de uso del tiempo diario en libreta',
    suggestedHabitCategory: 'mind',
    suggestedDuration: '5 min',
    tag: 'VALOR DEL TIEMPO'
  }
];

export function getSlotByHour(hour: number): 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 13) return 'morning';
  if (hour >= 13 && hour < 19) return 'afternoon';
  if (hour >= 19 && hour < 23) return 'evening';
  return 'night';
}

export function getDayNameSpanish(dayIndex: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayIndex] || 'Hoy';
}

export function getDayContext(dayIndex: number): string {
  switch (dayIndex) {
    case 1:
      return 'Lunes de Enfoque y Metas Implacables';
    case 2:
      return 'Martes de Ejecución y Cero Excusas';
    case 3:
      return 'Miércoles de Calibración Estratégica';
    case 4:
      return 'Jueves de Aceleración y Disciplina';
    case 5:
      return 'Viernes de Cierre de Victorias y Finanzas';
    case 6:
      return 'Sábado de Expansión Mental y Físico';
    case 0:
      return 'Domingo de Planificación y la Regla del 1%';
    default:
      return 'Día de Consistencia y Maestría';
  }
}

export function getWisdomForDate(date: Date = new Date(), preferredId?: string): MillionaireWisdomItem {
  if (preferredId) {
    const found = MILLIONAIRE_WISDOM.find((w) => w.id === preferredId);
    if (found) return found;
  }

  const hour = date.getHours();
  const slot = getSlotByHour(hour);
  const matching = MILLIONAIRE_WISDOM.filter((w) => w.slot === slot);

  if (matching.length > 0) {
    // Pick based on day + hour to have consistent yet varied items
    const index = (date.getDate() + hour) % matching.length;
    return matching[index];
  }

  return MILLIONAIRE_WISDOM[0];
}

export function getRandomWisdom(currentId?: string): MillionaireWisdomItem {
  const candidates = MILLIONAIRE_WISDOM.filter((w) => w.id !== currentId);
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx] || MILLIONAIRE_WISDOM[0];
}
