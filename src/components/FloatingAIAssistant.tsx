import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Calendar,
  Send,
  X,
  Check,
  Copy,
  ClipboardPaste,
  Trash2,
  CheckCircle2,
  CalendarCheck2,
  ArrowRight,
  AlertCircle,
  FileText,
  Zap,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  ListTodo,
  ChevronRight,
  Flame,
  MessageSquare,
  SlidersHorizontal,
  Settings,
  Music,
  Radio,
  Sliders,
  Cpu
} from 'lucide-react';
import { DailyTask, CalendarEvent, DashboardTab, Habit } from '../types';

interface ExtractedSchedule {
  hora: string;
  horaTexto?: string;
  motivo: string;
  fecha?: string;
}

export interface FloatingAIAssistantProps {
  tasks?: DailyTask[];
  habits?: Habit[];
  onAddTask: (task: Omit<DailyTask, 'id' | 'completed'>) => void;
  onEditTask?: (id: string, updated: Partial<DailyTask>) => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
  onNavigateToTab?: (tab: DashboardTab) => void;
}

const SAMPLE_LARGE_TEXTS = [
  {
    label: 'WhatsApp de Cliente / Constructora',
    text: `Hola Carlos, qué tal todo. Te escribo después de la llamada que tuvimos con los ingenieros de la constructora esta mañana. Nos comentaron que están muy preocupados por el presupuesto de la fase 2 y necesitan cuadrar los números de los materiales antes del cierre del viernes. Acordamos que sin falta nos vemos hoy a las 16:30 para revisar el avance financiero del proyecto y cerrar los números pendientes. Por favor trae la tabla de costos actualizada.`
  },
  {
    label: 'Correo de Coordinación de Equipo',
    text: `Estimado equipo, espero que se encuentren bien. Revisando los entregables de este sprint, notamos que faltan algunas validaciones de seguridad en el módulo de autenticación. Les pido que nos conectemos a las 11:00 am para alinear los entregables del sprint y asignar las tareas críticas restantes. Saludos a todos y buen día.`
  },
  {
    label: 'Nota de Voz / Rutina Personal',
    text: `Oye, recordatorio para mí mismo: hoy después de salir de la oficina tengo que pasar por la veterinaria a recoger las medicinas de Max y también quería ver si alcanzaba a entrenar. Quedé con el entrenador a las 19:15 para la sesión de fuerza y cardio en el gimnasio, no se me puede olvidar llevar la toalla y las zapatillas.`
  }
];

export function FloatingAIAssistant({
  tasks = [],
  habits = [],
  onAddTask,
  onEditTask,
  onToggleTask,
  onDeleteTask,
  onAddEvent,
  onNavigateToTab
}: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'asistente' | 'agente'>('asistente');

  // --- ASISTENTE IA (Textos Grandes) States ---
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<ExtractedSchedule[]>([]);
  const [scheduledIds, setScheduledIds] = useState<Record<number, boolean>>({});

  // --- AGENTE IA (Voz, Comandos y Configuraciones) States ---
  const [isListening, setIsListening] = useState(false);
  const [agentVoiceInput, setAgentVoiceInput] = useState('');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [agentResponse, setAgentResponse] = useState(
    '“¡Hola! Soy tu Agente IA. Dime por voz o escribe qué deseas programar, mover o completar en tu agenda.”'
  );
  const [isAgentExecuting, setIsAgentExecuting] = useState(false);
  const [agentTranscript, setAgentTranscript] = useState<string | null>(null);
  const [actionLogs, setActionLogs] = useState<Array<{ id: string; text: string; time: string; type: 'success' | 'info' }>>([
    { id: '1', text: 'Agente de voz inicializado y sincronizado con tu Calendario Agenda.', time: 'Ahora', type: 'info' }
  ]);

  // Configuraciones completas de Voz & Motor IA
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceRate, setVoiceRate] = useState<number>(() => {
    const saved = localStorage.getItem('habits_mil_voice_rate');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [voicePitch, setVoicePitch] = useState<number>(() => {
    const saved = localStorage.getItem('habits_mil_voice_pitch');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [voiceVolume, setVoiceVolume] = useState<number>(() => {
    const saved = localStorage.getItem('habits_mil_voice_volume');
    return saved ? parseInt(saved, 10) : 85;
  });
  const [voiceName, setVoiceName] = useState<string>(() => {
    return localStorage.getItem('habits_mil_voice_name') || '';
  });
  const [autoSpeakResponse, setAutoSpeakResponse] = useState<boolean>(() => {
    const saved = localStorage.getItem('habits_mil_auto_speak');
    return saved !== null ? saved === 'true' : true;
  });
  const [hapticSound, setHapticSound] = useState<'zen' | 'cyber' | 'breeze' | 'hype' | 'silent'>(() => {
    const saved = localStorage.getItem('habits_mil_haptic_sound') as any;
    return saved || 'zen';
  });
  const [agentPersona, setAgentPersona] = useState<'direct' | 'mentor' | 'minimal'>(() => {
    const saved = localStorage.getItem('habits_mil_agent_persona') as any;
    return saved || 'direct';
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Guardar configuraciones de voz en localStorage
  useEffect(() => {
    localStorage.setItem('habits_mil_voice_rate', voiceRate.toString());
  }, [voiceRate]);
  useEffect(() => {
    localStorage.setItem('habits_mil_voice_pitch', voicePitch.toString());
  }, [voicePitch]);
  useEffect(() => {
    localStorage.setItem('habits_mil_voice_volume', voiceVolume.toString());
  }, [voiceVolume]);
  useEffect(() => {
    localStorage.setItem('habits_mil_voice_name', voiceName);
  }, [voiceName]);
  useEffect(() => {
    localStorage.setItem('habits_mil_auto_speak', autoSpeakResponse.toString());
  }, [autoSpeakResponse]);
  useEffect(() => {
    localStorage.setItem('habits_mil_haptic_sound', hapticSound);
  }, [hapticSound]);
  useEffect(() => {
    localStorage.setItem('habits_mil_agent_persona', agentPersona);
  }, [agentPersona]);

  // Cargar voces del navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const rawVoices = window.speechSynthesis.getVoices();
        const seen = new Set<string>();
        const uniqueVoices = rawVoices.filter((v) => {
          const key = `${v.name}|${v.lang}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setAvailableVoices(uniqueVoices);
        if (!voiceName && uniqueVoices.length > 0) {
          const esVoice = uniqueVoices.find(v => v.lang.startsWith('es'));
          if (esVoice) setVoiceName(esVoice.name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [voiceName]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const playSynthesizedChime = (customFreq?: number, customDuration?: number, customType?: OscillatorType) => {
    if (hapticSound === 'silent') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      let freq = customFreq || 528;
      let duration = customDuration || 0.3;
      let type: OscillatorType = customType || 'sine';

      if (hapticSound === 'zen') {
        freq = 432;
        duration = 0.45;
        type = 'sine';
      } else if (hapticSound === 'cyber') {
        freq = 880;
        duration = 0.18;
        type = 'triangle';
      } else if (hapticSound === 'breeze') {
        freq = 320;
        duration = 0.5;
        type = 'sine';
      } else if (hapticSound === 'hype') {
        freq = 659;
        duration = 0.35;
        type = 'square';
      }

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime((voiceVolume / 100) * 0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio silent fallback
    }
  };

  const speakText = (text: string) => {
    if (isVoiceMuted || !autoSpeakResponse) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*_“"”]/g, '');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'es-ES';
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.volume = voiceVolume / 100;
        if (voiceName && availableVoices.length > 0) {
          const chosen = availableVoices.find(v => v.name === voiceName);
          if (chosen) utterance.voice = chosen;
        }
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback
      }
    }
  };

  const testVoiceSample = () => {
    playSynthesizedChime();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const testPhrase = '¡Hola! Soy tu Agente IA. Mi voz y velocidad están configuradas con éxito.';
        const utterance = new SpeechSynthesisUtterance(testPhrase);
        utterance.lang = 'es-ES';
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.volume = voiceVolume / 100;
        if (voiceName && availableVoices.length > 0) {
          const chosen = availableVoices.find(v => v.name === voiceName);
          if (chosen) utterance.voice = chosen;
        }
        window.speechSynthesis.speak(utterance);
        showNotification('Reproduciendo prueba de voz del Agente IA');
      } catch {
        showNotification('Error al reproducir audio');
      }
    }
  };

  // --- Voice Recognition Setup ---
  const toggleVoiceListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showNotification('Tu navegador no soporta el reconocimiento de voz directo.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        playSynthesizedChime(580, 0.25, 'sine');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAgentVoiceInput(transcript);
        setIsListening(false);
        handleExecuteAgentCommand(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      showNotification('No se pudo acceder al micrófono.');
    }
  };

  // --- Agent Action Engine ---
  const handleExecuteAgentCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    setIsAgentExecuting(true);
    setAgentTranscript(`“${cmd}”`);
    playSynthesizedChime(528, 0.3, 'sine');

    const lower = cmd.toLowerCase();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTimeout(() => {
      // 1. COMPLETAR TAREA
      if (lower.includes('completar') || lower.includes('marcar') || lower.includes('terminada') || lower.includes('hecho')) {
        const pending = tasks.find(t => !t.completed);
        if (pending && onToggleTask) {
          onToggleTask(pending.id);
          let reply = `He marcado como completada la tarea "${pending.title}". ¡Excelente trabajo!`;
          if (agentPersona === 'mentor') {
            reply = `¡Magnífico avance! He marcado como completada "${pending.title}". Cada compromiso cumplido fortalece tu mentalidad y racha de éxito.`;
          } else if (agentPersona === 'minimal') {
            reply = `✓ Tarea "${pending.title}" completada.`;
          }
          setAgentResponse(reply);
          speakText(reply);
          setActionLogs(prev => [
            { id: Date.now().toString(), text: `Tarea "${pending.title}" completada`, time: timestamp, type: 'success' },
            ...prev
          ]);
          showNotification(`Agente IA: Tarea completada con éxito`);
        } else {
          const reply = agentPersona === 'minimal' 
            ? 'No hay tareas pendientes.' 
            : `No tienes tareas pendientes por completar en este momento.`;
          setAgentResponse(reply);
          speakText(reply);
        }
      }
      // 2. CONSEJO / PRODUCTIVIDAD
      else if (lower.includes('consejo') || lower.includes('oráculo') || lower.includes('productividad') || lower.includes('racha')) {
        const completedCount = tasks.filter(t => t.completed).length;
        let reply = `Llevas ${completedCount} tareas realizadas hoy. Recuerda que la consistencia vence a la intensidad. Enfócate en tu siguiente bloque de trabajo sin distracciones.`;
        if (agentPersona === 'mentor') {
          reply = `Llevas ${completedCount} tareas completadas hoy. La disciplina diaria es el precio del dominio personal. Mantén el foco en tus prioridades de alto impacto.`;
        } else if (agentPersona === 'minimal') {
          reply = `${completedCount} tareas hechas hoy. Listo para el siguiente bloque.`;
        }
        setAgentResponse(reply);
        speakText(reply);
        setActionLogs(prev => [
          { id: Date.now().toString(), text: `Consejo de productividad (${agentPersona})`, time: timestamp, type: 'info' },
          ...prev
        ]);
      }
      // 3. AGENDAR / CREAR TAREA O EVENTO CON HORA
      else {
        // Extract time
        const timeMatch = cmd.match(/(\d{1,2}(?::\d{2})?)\s*(am|pm|hrs)?/i);
        let hora = '17:00';
        if (timeMatch) {
          let [hStr, mStr] = timeMatch[1].split(':');
          let h = parseInt(hStr, 10);
          let m = mStr ? parseInt(mStr, 10) : 0;
          if (timeMatch[2]?.toLowerCase().includes('pm') && h < 12) h += 12;
          hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }

        // Clean command to find title
        let title = cmd
          .replace(/(?:agendar|programar|crear|reunión|tarea|a las|para las|\d{1,2}(?::\d{2})?)\b/gi, '')
          .replace(/^(con|en|de)\s+/i, '')
          .trim();

        if (!title || title.length < 3) {
          title = 'Compromiso agendado con Agente IA';
        } else {
          title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        // Add to tasks
        onAddTask({
          title,
          time: hora,
          date: todayStr,
          priority: 'normal',
          category: 'trabajo'
        });

        // Add to calendar event
        if (onAddEvent) {
          const [h, m] = hora.split(':').map(Number);
          const endH = (h + 1) % 24;
          const timeEnd = `${String(endH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;

          onAddEvent({
            title,
            type: 'task',
            date: todayStr,
            timeStart: hora,
            timeEnd,
            tag: 'Agente IA',
            completed: false
          });
        }

        let reply = `He programado "${title}" a las ${hora} en tu Lista de Tareas y Calendario Agenda.`;
        if (agentPersona === 'mentor') {
          reply = `¡Excelente! He agendado "${title}" a las ${hora} sincronizado en tu Agenda y Lista de Tareas. Bloque protegido para máxima concentración.`;
        } else if (agentPersona === 'minimal') {
          reply = `✓ "${title}" agendado a las ${hora} en Agenda y Tareas.`;
        }
        setAgentResponse(reply);
        speakText(reply);
        playSynthesizedChime(660, 0.35, 'sine');
        setActionLogs(prev => [
          { id: Date.now().toString(), text: `Agendado "${title}" a las ${hora} en Calendario y Tareas`, time: timestamp, type: 'success' },
          ...prev
        ]);
        showNotification(`¡Agendado en Calendario a las ${hora}!`);
      }

      setIsAgentExecuting(false);
      setAgentVoiceInput('');
    }, 450);
  };

  // --- ASISTENTE IA (Textos Grandes) Methods ---
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText(text);
          setErrorMessage(null);
        }
      }
    } catch {
      // Fallback
    }
  };

  const handleLoadSample = (sampleText: string) => {
    setInputText(sampleText);
    setErrorMessage(null);
  };

  const handleAnalyzeText = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Por favor pega o escribe un texto para analizar.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setScheduledIds({});

    try {
      const todayIso = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/ai/parse-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          referenceDate: todayIso
        })
      });

      if (!res.ok) {
        throw new Error(`Servidor (${res.status})`);
      }

      const data = await res.json();
      if (data.schedules && Array.isArray(data.schedules) && data.schedules.length > 0) {
        setExtractedItems(data.schedules);
        playSynthesizedChime(660, 0.3, 'sine');
      } else {
        setErrorMessage('No se identificó una hora y motivo claros. Prueba con un texto más detallado.');
      }
    } catch (err: any) {
      // Smart client fallback
      const todayIso = new Date().toISOString().split('T')[0];
      const fallbackSchedule = fallbackExtractClient(inputText, todayIso);
      setExtractedItems(fallbackSchedule);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fallbackExtractClient = (text: string, todayIso: string): ExtractedSchedule[] => {
    const timeMatch = text.match(/(?:a\s+las\s+|a\s+la\s+|alas\s+)?(\b\d{1,2}(?::\d{2})?)\s*(am|pm|a\.m\.|p\.m\.|hrs|horas)?\b/i);
    let hora = '16:00';
    let horaTexto = '4:00 pm';
    if (timeMatch) {
      horaTexto = timeMatch[0].trim();
      const [hStr, mStr] = timeMatch[1].split(':');
      let h = parseInt(hStr, 10);
      const m = mStr ? parseInt(mStr, 10) : 0;
      const meridiem = (timeMatch[2] || '').toLowerCase().replace(/\./g, '');
      if (meridiem.includes('pm') && h < 12) {
        h += 12;
      } else if (meridiem.includes('am') && h === 12) {
        h = 0;
      } else if (!meridiem && h >= 1 && h <= 6) {
        h += 12;
      }
      hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    let fecha = todayIso;
    const lower = text.toLowerCase();
    const d = new Date();
    if (lower.includes('pasado mañana')) {
      d.setDate(d.getDate() + 2);
      fecha = d.toISOString().split('T')[0];
    } else if (lower.includes('mañana')) {
      d.setDate(d.getDate() + 1);
      fecha = d.toISOString().split('T')[0];
    }

    let motivo = '';
    const paraMatch = text.match(/(?:para|a fin de|con el fin de)\s+([^,.;\n]+)/i);
    if (paraMatch && paraMatch[1].trim().length > 5) {
      motivo = paraMatch[1].trim();
    } else {
      motivo = text
        .replace(/(?:hola|buenos días|buenas tardes|estimado|saludos)[^,.]*[,.]/gi, '')
        .replace(/(?:por favor|gracias|saludos cordiales|un abrazo).*/gi, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();
    }

    if (!motivo) motivo = 'Compromiso agendado';
    motivo = motivo.charAt(0).toUpperCase() + motivo.slice(1);
    if (motivo.length > 75) motivo = motivo.slice(0, 75) + '...';

    return [{
      hora,
      horaTexto,
      motivo,
      fecha
    }];
  };

  const handleUpdateExtracted = (index: number, field: 'hora' | 'motivo' | 'fecha', val: string) => {
    setExtractedItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleScheduleItem = (item: ExtractedSchedule, index: number) => {
    const hora = item.hora || '10:00';
    const motivo = item.motivo.trim() || 'Compromiso agendado';
    const fecha = item.fecha || new Date().toISOString().split('T')[0];

    // 1. Daily task
    onAddTask({
      title: motivo,
      time: hora,
      date: fecha,
      priority: 'normal',
      category: 'trabajo'
    });

    // 2. Calendar Event
    if (onAddEvent) {
      const [h, m] = hora.split(':').map(Number);
      const endH = (h + 1) % 24;
      const timeEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

      onAddEvent({
        title: motivo,
        type: 'task',
        date: fecha,
        timeStart: hora,
        timeEnd,
        tag: 'IA Asistente',
        completed: false
      });
    }

    setScheduledIds(prev => ({ ...prev, [index]: true }));
    playSynthesizedChime(660, 0.35, 'sine');
    showNotification(`¡Agendado en Calendario Agenda y Lista de Tareas a las ${hora}!`);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-cyan-950/95 border border-cyan-400/50 text-cyan-200 text-xs font-bold shadow-[0_0_30px_rgba(6,182,212,0.55)] flex items-center gap-2.5 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Single FAB for Both AIs */}
      <div className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-40 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#080f22] via-[#0c1936] to-[#1c1543] border-2 border-cyan-400/70 text-cyan-300 shadow-[0_0_28px_rgba(6,182,212,0.45)] hover:shadow-[0_0_38px_rgba(99,102,241,0.65)] hover:border-cyan-300 hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md"
          title="Centro de Inteligencia IA (Asistente & Agente)"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-600/25 blur-md pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

          {/* Single Unified Icon for both AIs */}
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
            {/* Real-time active status pulse indicator */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-[#09152a] animate-pulse" />
          </div>

          {/* Tooltip on hover */}
          <span className="absolute -top-8 right-0 px-2.5 py-0.5 rounded-lg bg-[#070b16]/95 border border-cyan-500/40 text-[10.5px] font-bold text-cyan-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Centro IA
          </span>
        </button>
      </div>

      {/* Unified AI Suite Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
          <div className="w-full max-w-xl frosted-card border-t sm:border border-cyan-500/35 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-[0_-10px_60px_rgba(6,182,212,0.35)] max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Top Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-indigo-600/25 to-purple-600/25 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-[17px] font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>Centro de Inteligencia IA</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Elige entre procesar <span className="text-cyan-300 font-bold">textos grandes</span> o usar tu <span className="text-indigo-300 font-bold">Agente de voz</span>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs (Asistente IA vs Agente IA) */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#080d1a] border border-cyan-500/25">
              <button
                type="button"
                onClick={() => setActiveTab('asistente')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                  activeTab === 'asistente'
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Asistente IA (Textos)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('agente')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                  activeTab === 'agente'
                    ? 'bg-gradient-to-r from-indigo-500/25 to-purple-600/25 border border-indigo-400/50 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-4 h-4 text-indigo-400" />
                <span>Agente IA (Voz)</span>
              </button>
            </div>

            {/* ============================================================== */}
            {/* TAB 1: ASISTENTE IA (Textos Grandes -> Solo Hora y Motivo)     */}
            {/* ============================================================== */}
            {activeTab === 'asistente' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Samples */}
                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ejemplos rápidos para probar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_LARGE_TEXTS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadSample(sample.text)}
                        className="px-2.5 py-1 rounded-xl frosted-pill border border-cyan-500/20 text-[10.5px] text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pega aquí un texto grande (WhatsApp, correo o minuta)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
                      >
                        <ClipboardPaste className="w-3 h-3" />
                        <span>Pegar</span>
                      </button>
                      {inputText && (
                        <button
                          type="button"
                          onClick={() => {
                            setInputText('');
                            setExtractedItems([]);
                            setErrorMessage(null);
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Limpiar</span>
                        </button>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {inputText.length} caracteres
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setErrorMessage(null);
                    }}
                    rows={4}
                    placeholder="Ejemplo: 'Hola equipo, nos vemos hoy a las 16:30 para revisar el avance financiero del proyecto...' La IA descartará saludos y extraerá solo la hora y motivo."
                    className="w-full p-3 rounded-2xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-[13px] leading-relaxed focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none shadow-inner"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Analyze CTA */}
                <button
                  type="button"
                  disabled={isAnalyzing || !inputText.trim()}
                  onClick={handleAnalyzeText}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    isAnalyzing || !inputText.trim()
                      ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 border border-slate-700'
                      : 'btn-cyan-glow active:scale-98'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
                      <span>Analizando y extrayendo hora y motivo...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>Reconocer Solo Hora y Motivo</span>
                    </>
                  )}
                </button>

                {/* Extracted Schedule Cards */}
                {extractedItems.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                        <span className="text-[12px] font-bold text-white tracking-tight">
                          Compromisos Detectados ({extractedItems.length})
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-300/80 font-medium">
                        Listo para Calendario & Tareas
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {extractedItems.map((item, idx) => {
                        const isScheduled = !!scheduledIds[idx];

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-[#090e1a] border border-cyan-500/25 space-y-3 shadow-md relative overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div>
                                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                                  🕒 Hora
                                </label>
                                <input
                                  type="time"
                                  value={item.hora}
                                  onChange={(e) => handleUpdateExtracted(idx, 'hora', e.target.value)}
                                  className="w-full h-10 px-2.5 rounded-xl bg-[#050811] border border-cyan-500/30 text-white font-mono text-[14px] font-bold focus:outline-none focus:border-cyan-400 transition"
                                />
                                {item.horaTexto && (
                                  <span className="text-[9.5px] text-slate-400 block mt-0.5">
                                    Texto: "{item.horaTexto}"
                                  </span>
                                )}
                              </div>

                              <div className="sm:col-span-2">
                                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                                  🎯 Motivo Limpio
                                </label>
                                <input
                                  type="text"
                                  value={item.motivo}
                                  onChange={(e) => handleUpdateExtracted(idx, 'motivo', e.target.value)}
                                  placeholder="Motivo esencial"
                                  className="w-full h-10 px-3 rounded-xl bg-[#050811] border border-cyan-500/30 text-white text-[13px] font-semibold focus:outline-none focus:border-cyan-400 transition"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10">
                              <span className="text-[10.5px] text-slate-400">
                                Fecha: <span className="text-white font-mono">{item.fecha || 'Hoy'}</span>
                              </span>

                              <button
                                type="button"
                                disabled={isScheduled}
                                onClick={() => handleScheduleItem(item, idx)}
                                className={`py-2 px-3.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md active:scale-95 ${
                                  isScheduled
                                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 cursor-default'
                                    : 'btn-cyan-glow'
                                }`}
                              >
                                {isScheduled ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>¡Agendado en Calendario y Tareas!</span>
                                  </>
                                ) : (
                                  <>
                                    <CalendarCheck2 className="w-4 h-4 stroke-[2.2]" />
                                    <span>Programar en Calendario y Tareas</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {Object.keys(scheduledIds).length > 0 && onNavigateToTab && (
                      <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-cyan-200">
                          Compromiso agregado con éxito a tu agenda.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateToTab('calendario');
                              setIsOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl btn-cyan-glow text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Ver Agenda</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: AGENTE IA (Voz en Vivo, Comandos y Acciones Directas)  */}
            {/* ============================================================== */}
            {activeTab === 'agente' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Voice Interaction Hero Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1024] to-[#070b18] border border-indigo-500/30 relative overflow-hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse" />
                      <span className="text-[12px] font-extrabold text-indigo-300">
                        Canal de Voz en Tiempo Real
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[10px] font-mono font-bold">
                        {agentPersona === 'direct' ? '⚡ Ejecutivo' : agentPersona === 'mentor' ? '🧠 Mentor' : '🎯 Minimal'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                          showVoiceSettings
                            ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                            : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                        }`}
                        title="Configurar voz, sintetizador, timbres y personalidad del Agente"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Configurar Voz</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition"
                        title={isVoiceMuted ? 'Activar voz hablada' : 'Silenciar voz hablada'}
                      >
                        {isVoiceMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-indigo-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIGURACIÓN COMPLETA DE VOZ Y MOTOR IA (Trasladada al Agente IA) */}
                  {showVoiceSettings && (
                    <div className="p-3.5 rounded-2xl bg-[#080c1a]/95 border border-indigo-500/35 space-y-3.5 animate-in fade-in slide-in-from-top-2 shadow-xl">
                      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                        <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5 text-indigo-400" />
                          Configuración del Agente IA & Voz
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowVoiceSettings(false)}
                          className="text-[10px] text-indigo-300 hover:text-white font-semibold cursor-pointer"
                        >
                          Cerrar
                        </button>
                      </div>

                      {/* Selector de Voz del Sistema */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>Voz del Sintetizador Neural:</span>
                          <span className="text-[9.5px] font-mono text-indigo-300">
                            {availableVoices.length > 0 ? `${availableVoices.length} voces disponibles` : 'Voz del sistema'}
                          </span>
                        </label>
                        <select
                          value={voiceName}
                          onChange={(e) => {
                            setVoiceName(e.target.value);
                            showNotification('Voz actualizada');
                          }}
                          className="w-full h-9 bg-slate-950 border border-indigo-500/30 rounded-xl px-2.5 text-[11.5px] text-slate-200 outline-none focus:border-indigo-400 cursor-pointer"
                        >
                          {availableVoices.length === 0 ? (
                            <option value="">Voz predeterminada del navegador (Español)</option>
                          ) : (
                            availableVoices.map((v, idx) => (
                              <option key={`${v.voiceURI || v.name}-${v.lang}-${idx}`} value={v.name}>
                                {v.name} ({v.lang})
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Velocidad y Tono */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Velocidad / Rate */}
                        <div className="space-y-1">
                          <label className="text-[10.5px] font-bold text-slate-300">
                            Velocidad: <strong className="text-indigo-300 font-mono">{voiceRate}x</strong>
                          </label>
                          <div className="grid grid-cols-4 gap-1">
                            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                onClick={() => setVoiceRate(rate)}
                                className={`py-1 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer ${
                                  voiceRate === rate
                                    ? 'bg-indigo-600 text-white border-indigo-400'
                                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tono / Pitch */}
                        <div className="space-y-1">
                          <label className="text-[10.5px] font-bold text-slate-300">
                            Tono: <strong className="text-indigo-300 font-mono">
                              {voicePitch < 1 ? 'Grave' : voicePitch === 1 ? 'Natural' : 'Agudo'}
                            </strong>
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { val: 0.8, label: 'Grave' },
                              { val: 1.0, label: 'Natural' },
                              { val: 1.2, label: 'Agudo' }
                            ].map((pitch) => (
                              <button
                                key={pitch.val}
                                type="button"
                                onClick={() => setVoicePitch(pitch.val)}
                                className={`py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  voicePitch === pitch.val
                                    ? 'bg-indigo-600 text-white border-indigo-400'
                                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                                }`}
                              >
                                {pitch.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Volumen slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-bold text-slate-300">Volumen de Feedback:</span>
                          <span className="font-mono text-indigo-300 font-bold">{voiceVolume}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={voiceVolume}
                          onChange={(e) => setVoiceVolume(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                        />
                      </div>

                      {/* Timbre Háptico de Confirmación */}
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-bold text-slate-300 flex items-center justify-between">
                          <span>Timbre Háptico al Ejecutar:</span>
                          <span className="text-[9px] text-slate-500 font-mono">Frecuencia no invasiva</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'zen', name: 'Apex Zen 432Hz' },
                            { id: 'cyber', name: 'Cyber 880Hz' },
                            { id: 'breeze', name: 'Breeze 320Hz' },
                            { id: 'hype', name: 'Hype Chime' },
                            { id: 'silent', name: 'Silencioso' }
                          ].map((sound) => (
                            <button
                              key={sound.id}
                              type="button"
                              onClick={() => {
                                setHapticSound(sound.id as any);
                                if (sound.id !== 'silent') {
                                  // Reproducir muestra inmediatamente
                                  if (sound.id === 'zen') playSynthesizedChime(432, 0.45, 'sine');
                                  else if (sound.id === 'cyber') playSynthesizedChime(880, 0.18, 'triangle');
                                  else if (sound.id === 'breeze') playSynthesizedChime(320, 0.5, 'sine');
                                  else if (sound.id === 'hype') playSynthesizedChime(659, 0.35, 'square');
                                }
                              }}
                              className={`p-1.5 rounded-lg text-[9.5px] font-semibold border transition cursor-pointer text-center truncate ${
                                hapticSound === sound.id
                                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              {sound.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personalidad del Agente */}
                      <div className="space-y-1">
                        <label className="text-[10.5px] font-bold text-slate-300">
                          Personalidad del Agente IA:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'direct', label: '⚡ Ejecutivo', desc: 'Directo y conciso' },
                            { id: 'mentor', label: '🧠 Mentor', desc: 'Hábitos y motivación' },
                            { id: 'minimal', label: '🎯 Minimal', desc: 'Solo confirmaciones' }
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setAgentPersona(p.id as any);
                                showNotification(`Personalidad cambiada a ${p.label}`);
                              }}
                              className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col ${
                                agentPersona === p.id
                                  ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm'
                                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              <span className="text-[11px] font-bold">{p.label}</span>
                              <span className="text-[9px] text-slate-400">{p.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Auto-hablar switch & Probar voz */}
                      <div className="flex items-center justify-between pt-1 gap-2 border-t border-indigo-500/20">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={autoSpeakResponse}
                            onChange={(e) => setAutoSpeakResponse(e.target.checked)}
                            className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-700 cursor-pointer accent-indigo-500"
                          />
                          <span className="text-[11px] text-slate-300 font-medium">
                            Hablar respuestas en voz alta
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={testVoiceSample}
                          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                          title="Reproducir prueba de voz"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Probar Voz</span>
                        </button>
                      </div>

                      {/* MCP Protocol Tools status */}
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/20 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-indigo-400" />
                            MCP Protocol & Calendar Sync
                          </span>
                          <span className="text-[9.5px] font-mono text-emerald-400 font-bold">
                            ✓ Activo
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {['task_create', 'task_schedule', 'calendar_sync', 'task_toggle'].map((tool) => (
                            <span
                              key={tool}
                              className="px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 font-mono text-[9px]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Speech Recognition Big Trigger */}
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <button
                      type="button"
                      onClick={toggleVoiceListening}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                        isListening
                          ? 'bg-rose-500 text-white shadow-[0_0_35px_rgba(244,63,94,0.65)] scale-105 animate-pulse'
                          : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:scale-105'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-7 h-7" />
                      ) : (
                        <Mic className="w-7 h-7" />
                      )}

                      {isListening && (
                        <span className="absolute -inset-2 rounded-full border-2 border-rose-400 animate-ping pointer-events-none" />
                      )}
                    </button>

                    <span className="text-[11.5px] font-bold text-slate-300">
                      {isListening ? 'Escuchando... Di tu instrucción ahora' : 'Toca el micrófono para hablar'}
                    </span>
                  </div>

                  {/* Transcript box */}
                  {agentTranscript && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[12px] text-indigo-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Escuchado:
                      </span>
                      {agentTranscript}
                    </div>
                  )}

                  {/* Agent Response */}
                  <div className="p-3 rounded-xl bg-[#080d1e] border border-indigo-500/25 text-[12.5px] text-slate-200 leading-relaxed font-medium">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                      Respuesta del Agente:
                    </span>
                    {agentResponse}
                  </div>
                </div>

                {/* Quick Voice Command Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Órdenes rápidas al Agente:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleExecuteAgentCommand('Programar reunión con inversionistas a las 16:30')}
                      className="p-2 rounded-xl bg-[#090e1c] border border-indigo-500/20 text-left text-[11px] text-slate-300 hover:text-indigo-300 hover:border-indigo-400/40 transition cursor-pointer flex items-center justify-between"
                    >
                      <span>⚡ "Reunión de inversionistas a las 16:30"</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecuteAgentCommand('Agendar entrenamiento de fuerza a las 19:00')}
                      className="p-2 rounded-xl bg-[#090e1c] border border-indigo-500/20 text-left text-[11px] text-slate-300 hover:text-indigo-300 hover:border-indigo-400/40 transition cursor-pointer flex items-center justify-between"
                    >
                      <span>⚡ "Entrenamiento de fuerza a las 19:00"</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecuteAgentCommand('Completar tarea pendiente')}
                      className="p-2 rounded-xl bg-[#090e1c] border border-indigo-500/20 text-left text-[11px] text-slate-300 hover:text-indigo-300 hover:border-indigo-400/40 transition cursor-pointer flex items-center justify-between"
                    >
                      <span>⚡ "Marcar tarea completada"</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecuteAgentCommand('Darme un consejo de productividad y racha')}
                      className="p-2 rounded-xl bg-[#090e1c] border border-indigo-500/20 text-left text-[11px] text-slate-300 hover:text-indigo-300 hover:border-indigo-400/40 transition cursor-pointer flex items-center justify-between"
                    >
                      <span>⚡ "Consejo de productividad de hoy"</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Text command input for when user cannot talk */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (agentVoiceInput.trim()) {
                      handleExecuteAgentCommand(agentVoiceInput);
                    }
                  }}
                  className="flex items-center gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={agentVoiceInput}
                    onChange={(e) => setAgentVoiceInput(e.target.value)}
                    placeholder="O escribe una orden (ej: 'Reunión mañana a las 11:00')..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-[#080d1a] border border-indigo-500/30 text-white placeholder:text-slate-500 text-[12.5px] focus:outline-none focus:border-indigo-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!agentVoiceInput.trim() || isAgentExecuting}
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-[12px] flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ejecutar</span>
                  </button>
                </form>

                {/* Action Logs */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Registro de acciones ejecutadas:
                  </span>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {actionLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded-xl bg-[#080d19] border border-indigo-500/20 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="text-slate-300 font-medium">{log.text}</span>
                        </div>
                        <span className="text-[9.5px] text-slate-500 font-mono flex-shrink-0 ml-2">
                          {log.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
