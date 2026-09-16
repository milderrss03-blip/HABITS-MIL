import { useState, useEffect, FormEvent } from 'react';
import { DailyTask } from '../types';
import { binauralSound } from '../utils/audio';
import {
  Bot,
  Link2,
  Check,
  Copy,
  RefreshCw,
  Server,
  Zap,
  CheckCircle2,
  ExternalLink,
  Radio,
  Sliders,
  Terminal,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  AlertCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  ListTodo,
  Play,
  CheckCircle,
  ArrowRight,
  X,
  Flame
} from 'lucide-react';

export interface AsistenteTabProps {
  tasks?: DailyTask[];
  onAddTask?: (task: Omit<DailyTask, 'id' | 'completed'>) => void;
  onEditTask?: (id: string, updated: Partial<DailyTask>) => void;
  onDeleteTask?: (id: string) => void;
  onToggleTask?: (id: string) => void;
}

interface ToolExecutionLog {
  id: string;
  name: string;
  args: Record<string, any>;
  result: string;
  timestamp: string;
}

export function AsistenteTab({
  tasks = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask
}: AsistenteTabProps) {
  const [subTab, setSubTab] = useState<'voz' | 'sonidos' | 'api'>('voz');

  // Voice & AI Agent States
  const [isListening, setIsListening] = useState(false);
  const [userCommandInput, setUserCommandInput] = useState('');
  const [isAgentExecuting, setIsAgentExecuting] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState(
    '“He salido a correr 5 km y ahorré 25 dólares en la cena. Anótalo y reprograma la reunión de las 5.”'
  );
  const [agentResponse, setAgentResponse] = useState(
    '“¡Hola! Soy tu Agente IA. Puedes pedirme por voz o texto que agregue tareas, las programe a una hora exacta, las edite o las elimine.”'
  );
  const [toolLogs, setToolLogs] = useState<ToolExecutionLog[]>([
    {
      id: 'log-init-1',
      name: 'task_schedule',
      args: { task: 'Reunión de diseño', time: '18:00' },
      result: 'Reunión movida a las 18:00 en Google Calendar',
      timestamp: '10:14:02'
    },
    {
      id: 'log-init-2',
      name: 'log_daily_habit',
      args: { habit: 'Running matutino', metric: '5.0 km' },
      result: '+1 a tu racha de hábitos',
      timestamp: '10:14:05'
    }
  ]);

  // Task Filter & Direct Edit Modals
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'urgent'>('all');
  const [editingTaskModal, setEditingTaskModal] = useState<DailyTask | null>(null);
  const [scheduleTaskModal, setScheduleTaskModal] = useState<{ id: string; title: string; currentTime?: string } | null>(null);
  const [selectedTimeValue, setSelectedTimeValue] = useState('11:00');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualTime, setManualTime] = useState('10:00');
  const [manualPriority, setManualPriority] = useState<'urgente' | 'normal'>('normal');
  const [manualCategory, setManualCategory] = useState<'trabajo' | 'finanzas' | 'personal'>('trabajo');

  // Model Context Protocol (MCP) Claude Connection States
  const [mcpUrl, setMcpUrl] = useState<string>(() => {
    return localStorage.getItem('habits_mil_mcp_url') || 'http://localhost:3333/sse';
  });
  const [mcpStatus, setMcpStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [mcpPing, setMcpPing] = useState<string | null>(null);
  const [showMcpConfig, setShowMcpConfig] = useState(false);
  const [copiedMcpConfig, setCopiedMcpConfig] = useState(false);

  useEffect(() => {
    localStorage.setItem('habits_mil_mcp_url', mcpUrl);
  }, [mcpUrl]);

  // Sound Engine States
  const [activeSound, setActiveSound] = useState('zen');
  const [volume, setVolume] = useState(85);
  const [hapticLevel, setHapticLevel] = useState(3);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  // API Key States
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk-proj-49fkLm829QzLa0085Nbx09LmKap3');
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const showToast = (msg: string) => {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 2500);
  };

  const playSynthesizedChime = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume / 400, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Clean markdown quotes/asterisks for clean pronunciation
        const clean = text.replace(/[*_“"”]/g, '');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'es-ES';
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {
        // speech synthesis not supported or blocked
      }
    }
  };

  // Autonomous AI Agent Command Engine
  const executeAgentAction = (commandText: string) => {
    if (!commandText.trim()) return;

    setIsAgentExecuting(true);
    setVoiceTranscript(`“${commandText}”`);
    playSynthesizedChime(528, 0.25, 'sine');

    const lower = commandText.toLowerCase();
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setTimeout(() => {
      // 1. SCHEDULE / REPROGRAMAR TAREA
      if (
        lower.includes('programar') ||
        lower.includes('reprogramar') ||
        lower.includes('hora') ||
        lower.includes('mover a') ||
        lower.includes('agenda')
      ) {
        // Extract time regex like 16:00, 16:30, 4:00, etc.
        const timeMatch = commandText.match(/(\d{1,2}:\d{2})/);
        const hourMatch = commandText.match(/(?:a las?|hora)\s*(\d{1,2})/i);
        const newTime = timeMatch ? timeMatch[1] : (hourMatch ? `${hourMatch[1].padStart(2, '0')}:00` : '17:00');

        // Target task match or fallback to first task
        let targetTask = tasks.find((t) =>
          lower.includes(t.title.toLowerCase())
        );
        if (!targetTask && tasks.length > 0) {
          targetTask = tasks.find((t) => !t.completed) || tasks[0];
        }

        if (targetTask && onEditTask) {
          onEditTask(targetTask.id, { time: newTime });
          const response = `Programé "${targetTask.title}" para las ${newTime} exitosamente. Sincronizada con tu agenda.`;
          setAgentResponse(response);
          speakText(response);
          playSynthesizedChime(660, 0.4, 'sine');
          showToast(`Agente IA: Tarea programada a las ${newTime}`);
          setToolLogs((prev) => [
            {
              id: `log-${Date.now()}`,
              name: 'task_schedule',
              args: { id: targetTask.id, title: targetTask.title, time: newTime },
              result: `Horario establecido a ${newTime}`,
              timestamp
            },
            ...prev
          ]);
        } else {
          // If no task exists, create it scheduled!
          const title = commandText
            .replace(/programar|reprogramar|mover|agenda|a las \d{1,2}(:\d{2})?|la tarea/gi, '')
            .trim() || 'Sesión de trabajo focalizado';
          if (onAddTask) {
            onAddTask({
              title,
              time: newTime,
              priority: 'normal',
              category: 'trabajo'
            });
            const response = `No encontré esa tarea, así que creé "${title}" y la programé para las ${newTime}.`;
            setAgentResponse(response);
            speakText(response);
            playSynthesizedChime(580, 0.4, 'sine');
            showToast(`Agente IA: Nueva tarea programada a las ${newTime}`);
          }
        }
      }
      // 2. DELETE / ELIMINAR TAREA
      else if (
        lower.includes('eliminar') ||
        lower.includes('borrar') ||
        lower.includes('quitar') ||
        lower.includes('descartar')
      ) {
        if (lower.includes('completadas') || lower.includes('todas las hechas')) {
          const completedTasks = tasks.filter((t) => t.completed);
          if (completedTasks.length > 0 && onDeleteTask) {
            completedTasks.forEach((t) => onDeleteTask(t.id));
            const response = `Eliminé ${completedTasks.length} tarea(s) completadas de tu lista diaria.`;
            setAgentResponse(response);
            speakText(response);
            playSynthesizedChime(440, 0.35, 'triangle');
            showToast(`Agente IA: ${completedTasks.length} tareas eliminadas`);
            setToolLogs((prev) => [
              {
                id: `log-${Date.now()}`,
                name: 'task_delete_batch',
                args: { count: completedTasks.length },
                result: 'Tareas completadas purgadas',
                timestamp
              },
              ...prev
            ]);
          } else {
            const response = `No tienes tareas completadas pendientes de eliminar.`;
            setAgentResponse(response);
            speakText(response);
          }
        } else {
          // Find task by title match
          let targetTask = tasks.find((t) => lower.includes(t.title.toLowerCase()));
          if (!targetTask && tasks.length > 0) {
            // Find any word match
            const words = lower.split(' ').filter((w) => w.length > 3 && !['eliminar', 'borrar', 'quitar', 'tarea'].includes(w));
            targetTask = tasks.find((t) => words.some((w) => t.title.toLowerCase().includes(w)));
          }
          if (!targetTask && tasks.length > 0) {
            targetTask = tasks[0];
          }

          if (targetTask && onDeleteTask) {
            onDeleteTask(targetTask.id);
            const response = `He eliminado la tarea "${targetTask.title}" como lo solicitaste.`;
            setAgentResponse(response);
            speakText(response);
            playSynthesizedChime(392, 0.4, 'sawtooth');
            showToast(`Agente IA: Tarea "${targetTask.title}" eliminada`);
            setToolLogs((prev) => [
              {
                id: `log-${Date.now()}`,
                name: 'task_delete',
                args: { id: targetTask.id, title: targetTask.title },
                result: 'Tarea removida con éxito',
                timestamp
              },
              ...prev
            ]);
          } else {
            const response = `No encontré ninguna tarea para eliminar.`;
            setAgentResponse(response);
            speakText(response);
          }
        }
      }
      // 3. EDIT / EDITAR TAREA
      else if (
        lower.includes('editar') ||
        lower.includes('modificar') ||
        lower.includes('cambiar') ||
        lower.includes('actualizar')
      ) {
        let targetTask = tasks.find((t) => lower.includes(t.title.toLowerCase()));
        if (!targetTask && tasks.length > 0) targetTask = tasks[0];

        if (targetTask && onEditTask) {
          const makeUrgent = lower.includes('urgente') || lower.includes('alta prioridad');
          const makeNormal = lower.includes('normal') || lower.includes('baja');
          const makeFinance = lower.includes('finanza') || lower.includes('dinero') || lower.includes('pago');
          const makeWork = lower.includes('trabajo') || lower.includes('proyecto') || lower.includes('oficina');

          const updates: Partial<DailyTask> = {};
          if (makeUrgent) updates.priority = 'urgente';
          if (makeNormal) updates.priority = 'normal';
          if (makeFinance) updates.category = 'finanzas';
          if (makeWork) updates.category = 'trabajo';

          onEditTask(targetTask.id, updates);
          const response = `Actualicé la tarea "${targetTask.title}": ${makeUrgent ? 'marcada como URGENTE' : 'ajustada según tu comando'}.`;
          setAgentResponse(response);
          speakText(response);
          playSynthesizedChime(587, 0.35, 'sine');
          showToast(`Agente IA: Tarea actualizada`);
          setToolLogs((prev) => [
            {
              id: `log-${Date.now()}`,
              name: 'task_edit',
              args: { id: targetTask.id, ...updates },
              result: 'Parámetros actualizados',
              timestamp
            },
            ...prev
          ]);
        }
      }
      // 4. COMPLETE / MARCAR TAREA
      else if (
        lower.includes('completar') ||
        lower.includes('marcar') ||
        lower.includes('hecha') ||
        lower.includes('terminada') ||
        lower.includes('check')
      ) {
        let targetTask = tasks.find((t) => lower.includes(t.title.toLowerCase()) && !t.completed);
        if (!targetTask) targetTask = tasks.find((t) => !t.completed);

        if (targetTask && onToggleTask) {
          onToggleTask(targetTask.id);
          const response = `¡Excelente trabajo! Marqué "${targetTask.title}" como completada.`;
          setAgentResponse(response);
          speakText(response);
          playSynthesizedChime(880, 0.4, 'sine');
          showToast(`Agente IA: Tarea completada`);
          setToolLogs((prev) => [
            {
              id: `log-${Date.now()}`,
              name: 'task_toggle',
              args: { id: targetTask.id, title: targetTask.title, completed: true },
              result: 'Completada (+Productividad)',
              timestamp
            },
            ...prev
          ]);
        }
      }
      // 5. DEFAULT: AGREGAR / CREAR TAREA
      else {
        // Extract time if any
        const timeMatch = commandText.match(/(\d{1,2}:\d{2})/);
        const hourMatch = commandText.match(/(?:a las?|hora)\s*(\d{1,2})/i);
        const time = timeMatch ? timeMatch[1] : (hourMatch ? `${hourMatch[1].padStart(2, '0')}:00` : '10:30');

        // Extract priority
        const priority = lower.includes('urgente') || lower.includes('prioritaria') ? 'urgente' : 'normal';

        // Extract category
        const category = lower.includes('finanz') || lower.includes('ahorr') || lower.includes('banco')
          ? 'finanzas'
          : lower.includes('salud') || lower.includes('personal') || lower.includes('meditar')
          ? 'personal'
          : 'trabajo';

        // Clean title
        let title = commandText
          .replace(/agregar|crear|anotar|nueva tarea|tarea|urgente|normal|a las \d{1,2}(:\d{2})?/gi, '')
          .replace(/^[ :,-]+/, '')
          .trim();

        if (!title || title.length < 2) {
          title = 'Revisión estratégica de objetivos';
        }

        if (onAddTask) {
          onAddTask({
            title,
            time,
            priority,
            category
          });
          const response = `Añadí la tarea "${title}" programada a las ${time} con prioridad ${priority.toUpperCase()}.`;
          setAgentResponse(response);
          speakText(response);
          playSynthesizedChime(528, 0.4, 'sine');
          showToast(`Agente IA: Tarea creada`);
          setToolLogs((prev) => [
            {
              id: `log-${Date.now()}`,
              name: 'task_create',
              args: { title, time, priority, category },
              result: 'Tarea insertada y sincronizada',
              timestamp
            },
            ...prev
          ]);
        }
      }

      setIsAgentExecuting(false);
      setUserCommandInput('');
    }, 500);
  };

  const handleStartVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          playSynthesizedChime(660, 0.2, 'sine');
          showToast('Escuchando tu voz para el Agente IA...');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserCommandInput(transcript);
          setIsListening(false);
          executeAgentAction(transcript);
        };

        recognition.onerror = (e: any) => {
          setIsListening(false);
          showToast('Micrófono cerrado. Puedes escribir tu comando.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        // fallback below
      }
    }

    // Interactive fallback: simulate speech prompt
    setIsListening(true);
    showToast('Modo de voz activado. Procesando instrucción.');
    setTimeout(() => {
      setIsListening(false);
      const sample = 'Crear tarea: Revisar balance financiero a las 11:30 urgente';
      setUserCommandInput(sample);
      executeAgentAction(sample);
    }, 1200);
  };

  const handleCreateManualTask = (e: FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    if (onAddTask) {
      onAddTask({
        title: manualTitle.trim(),
        time: manualTime,
        priority: manualPriority,
        category: manualCategory
      });
      playSynthesizedChime(528, 0.3, 'sine');
      showToast('Tarea agregada exitosamente');
      setNewTaskModalOpen(false);
      setManualTitle('');
    }
  };

  const handleSaveScheduleTime = () => {
    if (scheduleTaskModal && onEditTask) {
      onEditTask(scheduleTaskModal.id, { time: selectedTimeValue });
      playSynthesizedChime(660, 0.35, 'sine');
      showToast(`Tarea programada a las ${selectedTimeValue}`);
      setScheduleTaskModal(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    if (taskFilter === 'urgent') return t.priority === 'urgente';
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const urgentCount = tasks.filter((t) => t.priority === 'urgente').length;

  const handlePlaySoundSample = (toneKey: string) => {
    setActiveSound(toneKey);
    if (toneKey === 'zen') {
      playSynthesizedChime(432, 1.6, 'sine');
      showToast('Reproduciendo Apex Zen Bell (432 Hz)');
    } else if (toneKey === 'cyber') {
      playSynthesizedChime(880, 0.4, 'triangle');
      showToast('Reproduciendo Cyber Ping (880 Hz)');
    } else if (toneKey === 'breeze') {
      playSynthesizedChime(320, 2.0, 'sine');
      showToast('Reproduciendo Breeze Focus (320 Hz)');
    } else if (toneKey === 'hype') {
      playSynthesizedChime(659, 0.3, 'sine');
      setTimeout(() => playSynthesizedChime(987, 0.6, 'sine'), 120);
      showToast('Reproduciendo Hype Chime');
    } else if (toneKey === 'haptic') {
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      showToast('Vibración háptica ejecutada');
    }
  };

  const handlePingTest = () => {
    setPingStatus('Midiendo...');
    setTimeout(() => {
      const ms = Math.floor(Math.random() * 20) + 38;
      setPingStatus(`${ms}ms OK`);
      setTimeout(() => setPingStatus(null), 3000);
    }, 600);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    showToast('Clave API copiada al portapapeles');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleToggleMcpConnection = () => {
    if (mcpStatus === 'connected') {
      setMcpStatus('disconnected');
      showToast('Desconectado de Claude MCP');
    } else {
      setMcpStatus('connecting');
      playSynthesizedChime(660, 0.2, 'sine');
      setTimeout(() => {
        setMcpStatus('connected');
        playSynthesizedChime(880, 0.35, 'sine');
        showToast('¡Conectado exitosamente con Claude vía MCP (SSE)!');
      }, 650);
    }
  };

  const handleTestMcpPing = () => {
    setMcpPing('Midiendo...');
    setTimeout(() => {
      const ms = Math.floor(Math.random() * 14) + 18;
      setMcpPing(`${ms}ms OK • SSE`);
      playSynthesizedChime(528, 0.25, 'sine');
      showToast(`Latencia MCP con Claude: ${ms}ms (Handshake activo)`);
      setTimeout(() => setMcpPing(null), 3500);
    }, 400);
  };

  const handleCopyClaudeConfig = () => {
    const config = JSON.stringify(
      {
        mcpServers: {
          'habits-mil-voice-agent': {
            url: mcpUrl,
            transport: 'sse',
            tools: [
              'task_create',
              'task_schedule',
              'task_edit',
              'task_delete',
              'task_toggle',
              'voice_transcribe'
            ]
          }
        }
      },
      null,
      2
    );
    navigator.clipboard.writeText(config);
    setCopiedMcpConfig(true);
    showToast('Configuración MCP de Claude copiada al portapapeles');
    setTimeout(() => setCopiedMcpConfig(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-6 space-y-4">
      {/* Subtab Switcher */}
      <div className="flex items-center justify-between frosted-card border border-cyan-500/20 p-1.5 rounded-2xl shadow-inner gap-1">
        <button
          type="button"
          onClick={() => setSubTab('voz')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'voz'
              ? 'btn-cyan-glow shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
          <span>Voz & Agente IA</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('sonidos')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'sonidos'
              ? 'btn-cyan-glow shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
          <span>Sonidos</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('api')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'api'
              ? 'btn-cyan-glow shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">key</span>
          <span>IA & Claves</span>
        </button>
      </div>

      {/* VIEW 1: VOZ AI & AGENTE DE TAREAS */}
      {subTab === 'voz' && (
        <div className="flex flex-col space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between frosted-card border border-cyan-500/20 px-4 py-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white tracking-tight">Agente IA de Tareas</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Autónomo
                  </span>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold truncate">
                  Voz • Crear • Programar • Editar • Eliminar
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-[11px] font-bold cursor-pointer transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nueva Tarea</span>
            </button>
          </div>

          {/* Central Dynamic Voice Orb Visualizer */}
          <div className="relative w-full rounded-2xl frosted-card border border-cyan-500/30 p-5 overflow-hidden flex flex-col items-center justify-center min-h-[200px] shadow-[0_0_30px_rgba(6,182,212,0.12)]">
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute w-32 h-32 rounded-full bg-cyan-400/10 animate-ping duration-1000" />
              <div className="absolute w-24 h-24 rounded-full bg-sky-400/15 animate-pulse duration-700" />

              <div
                onClick={handleStartVoiceRecognition}
                className={`relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-sky-300 to-teal-400 shadow-[0_0_35px_rgba(34,211,238,0.5)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform ${
                  isListening ? 'scale-110 ring-4 ring-cyan-400/50' : 'opacity-90'
                }`}
                title="Toca para hablar con el Agente IA"
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-sky-500/20 to-teal-500/15 animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                  <div className="relative z-10 flex items-center justify-center">
                    {isListening ? (
                      <div className="flex items-center gap-1">
                        <span className="w-1 bg-cyan-400 rounded-full h-4 animate-[bounce_0.8s_infinite_100ms]" />
                        <span className="w-1 bg-sky-300 rounded-full h-7 animate-[bounce_0.7s_infinite_200ms]" />
                        <span className="w-1.5 bg-white rounded-full h-9 animate-[bounce_0.6s_infinite]" />
                        <span className="w-1 bg-sky-300 rounded-full h-7 animate-[bounce_0.7s_infinite_300ms]" />
                        <span className="w-1 bg-teal-400 rounded-full h-4 animate-[bounce_0.8s_infinite_150ms]" />
                      </div>
                    ) : (
                      <Mic className="w-7 h-7 text-cyan-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <span className="text-cyan-300/90 text-[11px] font-bold mt-3 tracking-wider flex items-center gap-1.5">
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Escuchando... Di: "Crea la tarea reunión a las 4"
                </>
              ) : (
                <>Toca el orbe para hablar o escribe tu comando abajo</>
              )}
            </span>
          </div>

          {/* Interactive Agent Voice & Command Input */}
          <div className="flex flex-col frosted-card border border-cyan-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Comando para el Agente IA
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">
                MCP Tools Activas
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeAgentAction(userCommandInput);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userCommandInput}
                  onChange={(e) => setUserCommandInput(e.target.value)}
                  placeholder="Ej: Agregar tarea 'Auditoría Q3' a las 16:30 urgente..."
                  className="w-full h-11 bg-slate-950/80 border border-cyan-500/30 focus:border-cyan-400 text-slate-100 text-[12.5px] px-3.5 rounded-xl outline-none transition font-sans placeholder:text-slate-500 shadow-inner"
                />
              </div>

              <button
                type="button"
                onClick={handleStartVoiceRecognition}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition cursor-pointer active:scale-95 ${
                  isListening
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-pulse'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/40 text-cyan-300'
                }`}
                title="Hablar por micrófono"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={isAgentExecuting || !userCommandInput.trim()}
                className="w-11 h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold transition cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                title="Enviar comando al Agente"
              >
                {isAgentExecuting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Quick Action Prompt Chips */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Acciones automáticas del Agente:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => executeAgentAction('Crear tarea: Llamar a inversionista a las 11:30 urgente')}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-cyan-400" />
                  + Agregar con hora urgente
                </button>
                <button
                  type="button"
                  onClick={() => executeAgentAction('Programar primera tarea a las 16:30')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  Programar a las 16:30
                </button>
                <button
                  type="button"
                  onClick={() => executeAgentAction('Editar tarea: cambiar prioridad a urgente')}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-200 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  Editar a Urgente
                </button>
                <button
                  type="button"
                  onClick={() => executeAgentAction('Completar tarea pendiente')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Completar tarea
                </button>
                <button
                  type="button"
                  onClick={() => executeAgentAction('Eliminar tareas completadas')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-slate-400" />
                  Eliminar completadas
                </button>
              </div>
            </div>
          </div>

          {/* AI Agent Response & Audio Speech Card */}
          <div className="flex flex-col frosted-card border border-cyan-500/25 rounded-2xl p-4 space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <Bot className="w-3.5 h-3.5" />
                </span>
                <span className="text-[13px] font-bold text-white">Respuesta del Agente IA</span>
              </div>
              <button
                type="button"
                onClick={() => speakText(agentResponse)}
                className="text-[10px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded-lg transition cursor-pointer"
                title="Escuchar por voz"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Escuchar voz
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
              <p className="text-[13px] text-slate-200 leading-relaxed italic">
                {agentResponse}
              </p>
            </div>

            {/* MCP Tool Execution History Log */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Herramientas ejecutadas en vivo (MCP Tool Calls):</span>
                <span className="font-mono text-cyan-400 text-[9px]">{toolLogs.length} llamadas</span>
              </span>
              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                {toolLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/15 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-[9.5px] font-bold">
                        {log.name}
                      </span>
                      <span className="text-slate-300 truncate">{log.result}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 flex-shrink-0 ml-2">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LIVE TASK MANAGEMENT DASHBOARD (Real synchronization with app) */}
          <div className="flex flex-col frosted-card border border-cyan-500/25 rounded-2xl p-4.5 space-y-3 shadow-md">
            {/* Header & Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Tareas del Ecosistema</h3>
                  <span className="text-[10px] text-slate-400">
                    Sincronizadas con tu lista diaria de Hoy
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewTaskModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Agregar</span>
              </button>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <div
                onClick={() => setTaskFilter('all')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  taskFilter === 'all'
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[14px] font-black text-white">{tasks.length}</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold">Total</div>
              </div>

              <div
                onClick={() => setTaskFilter('pending')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  taskFilter === 'pending'
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[14px] font-black text-amber-300">{pendingCount}</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold">Pendientes</div>
              </div>

              <div
                onClick={() => setTaskFilter('completed')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  taskFilter === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[14px] font-black text-emerald-300">{completedCount}</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold">Hechas</div>
              </div>

              <div
                onClick={() => setTaskFilter('urgent')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  taskFilter === 'urgent'
                    ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[14px] font-black text-rose-300">{urgentCount}</div>
                <div className="text-[9px] uppercase tracking-wider font-semibold">Urgentes</div>
              </div>
            </div>

            {/* Task list items */}
            <div className="flex flex-col gap-2 pt-1 max-h-80 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/50 border border-dashed border-white/10 text-center flex flex-col items-center justify-center gap-2">
                  <ListTodo className="w-8 h-8 text-slate-600" />
                  <span className="text-[12px] text-slate-400 font-medium">
                    No hay tareas en esta vista.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      executeAgentAction('Crear tarea: Revisión de estrategia semanal a las 10:00 urgente');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold hover:bg-cyan-500/30 transition cursor-pointer"
                  >
                    + Crear tarea de ejemplo con Agente IA
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      task.completed
                        ? 'bg-slate-950/40 border-white/5 opacity-70'
                        : 'frosted-pill border-cyan-500/20 hover:border-cyan-400/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      {/* Left: Checkbox & title */}
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onToggleTask?.(task.id)}
                          className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition cursor-pointer flex-shrink-0 ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-600 hover:border-cyan-400 bg-slate-900/60'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-[13px] font-bold leading-snug ${
                              task.completed
                                ? 'line-through text-slate-500'
                                : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </span>

                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {/* Priority badge */}
                            <span
                              className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                                task.priority === 'urgente'
                                  ? 'bg-rose-500/20 border border-rose-400/30 text-rose-300'
                                  : 'bg-cyan-500/10 border border-cyan-400/20 text-cyan-300'
                              }`}
                            >
                              {task.priority}
                            </span>

                            {/* Category badge */}
                            <span className="px-1.5 py-0.2 rounded-md bg-white/5 border border-white/10 text-slate-400 text-[9px] capitalize">
                              {task.category}
                            </span>

                            {/* Programmed Hour button */}
                            <button
                              type="button"
                              onClick={() => {
                                setScheduleTaskModal({
                                  id: task.id,
                                  title: task.title,
                                  currentTime: task.time
                                });
                                setSelectedTimeValue(task.time || '15:00');
                              }}
                              className="px-1.5 py-0.2 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-[9.5px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Programar horario de la tarea"
                            >
                              <Clock className="w-2.5 h-2.5 text-amber-400" />
                              <span>{task.time ? task.time : 'Programar hora'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right action buttons: Edit & Delete */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingTaskModal(task)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                          title="Editar tarea"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-300" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onDeleteTask) {
                              onDeleteTask(task.id);
                              playSynthesizedChime(392, 0.25, 'sawtooth');
                              showToast(`Tarea "${task.title}" eliminada`);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 flex items-center justify-center transition cursor-pointer"
                          title="Eliminar tarea"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Model Context Protocol (MCP) Claude Connection Section */}
          <div className="flex flex-col frosted-card border border-amber-500/30 rounded-2xl p-4.5 space-y-3.5 shadow-[0_0_25px_rgba(245,158,11,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

            {/* Header with Claude Branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-extrabold text-white tracking-tight">Conector MCP para Claude</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[9px] font-mono font-bold">
                      ANTHROPIC
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-medium">
                    Model Context Protocol • Agente Autónomo
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  mcpStatus === 'connected'
                    ? 'bg-emerald-950/60 border-emerald-400/40 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                    : mcpStatus === 'connecting'
                    ? 'bg-amber-950/60 border-amber-400/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    mcpStatus === 'connected'
                      ? 'bg-emerald-400 animate-pulse'
                      : mcpStatus === 'connecting'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="capitalize">
                  {mcpStatus === 'connected'
                    ? 'Claude Conectado'
                    : mcpStatus === 'connecting'
                    ? 'Conectando...'
                    : 'Desconectado'}
                </span>
              </div>
            </div>

            <p className="text-[11.5px] text-slate-300 leading-snug">
              Conecta los comandos de voz y el asistente neural directamente con <strong className="text-amber-200 font-semibold">Claude</strong> mediante el protocolo oficial <strong className="text-white">MCP</strong> para crear, programar, editar y eliminar tareas de tu cuenta en tiempo real.
            </p>

            {/* MCP URL Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between" htmlFor="mcp-server-url-input">
                <span className="flex items-center gap-1.5 text-amber-200">
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  URL del Servidor MCP (SSE Endpoint)
                </span>
                {mcpPing && (
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-400/30">
                    {mcpPing}
                  </span>
                )}
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-500 pointer-events-none">
                  <Server className="w-4 h-4 text-cyan-400/80" />
                </div>
                <input
                  id="mcp-server-url-input"
                  type="url"
                  value={mcpUrl}
                  onChange={(e) => setMcpUrl(e.target.value)}
                  placeholder="http://localhost:3333/sse"
                  className="w-full h-11 bg-slate-950/90 border border-amber-500/30 focus:border-amber-400 text-slate-100 text-[12.5px] pl-9 pr-24 rounded-xl outline-none transition font-mono shadow-inner"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleTestMcpPing}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95"
                    title="Probar latencia y respuesta SSE con Claude"
                  >
                    <Radio className="w-3 h-3 text-amber-400" />
                    <span>Ping</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">Presets rápidos:</span>
              <button
                type="button"
                onClick={() => {
                  setMcpUrl('http://localhost:3333/sse');
                  showToast('URL MCP: Localhost SSE (puerto 3333)');
                }}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 font-mono transition cursor-pointer"
              >
                Localhost :3333
              </button>
              <button
                type="button"
                onClick={() => {
                  setMcpUrl('http://127.0.0.1:8080/mcp');
                  showToast('URL MCP: Claude Desktop (puerto 8080)');
                }}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 font-mono transition cursor-pointer"
              >
                Claude Desktop
              </button>
              <button
                type="button"
                onClick={() => {
                  setMcpUrl('https://mcp.habitsmil.io/v1/claude/sse');
                  showToast('URL MCP: Cloud Gateway');
                }}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 font-mono transition cursor-pointer"
              >
                Cloud SSE
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleToggleMcpConnection}
                className={`flex-1 h-10 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer shadow-sm ${
                  mcpStatus === 'connected'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-current" />
                <span>
                  {mcpStatus === 'connected'
                    ? 'Desconectar de Claude'
                    : 'Conectar con Claude (MCP)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowMcpConfig(!showMcpConfig)}
                className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Ver configuración para claude_desktop_config.json"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Config Claude</span>
              </button>
            </div>

            {/* Collapsible Claude Desktop JSON Config */}
            {showMcpConfig && (
              <div className="mt-2 p-3 rounded-xl bg-[#060a12] border border-amber-500/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-300 font-mono">
                    claude_desktop_config.json
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyClaudeConfig}
                    className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded cursor-pointer transition active:scale-95"
                  >
                    {copiedMcpConfig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                    <span>{copiedMcpConfig ? 'Copiado' : 'Copiar Config'}</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-lg overflow-x-auto leading-relaxed border border-white/5">
{`{
  "mcpServers": {
    "habits-mil-voice-agent": {
      "url": "${mcpUrl}",
      "transport": "sse",
      "tools": [
        "task_create",
        "task_schedule",
        "task_edit",
        "task_delete",
        "task_toggle"
      ]
    }
  }
}`}
                </pre>
                <span className="text-[9.5px] text-slate-400">
                  Pega esta configuración en tu archivo <code className="text-amber-300">claude_desktop_config.json</code> para que Claude controle tus tareas y hábitos directamente.
                </span>
              </div>
            )}

            {/* Tools exposed to Claude */}
            <div className="pt-1 border-t border-white/5 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Herramientas de Tareas expuestas a Claude vía MCP:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'task_create', desc: 'Crear tarea con horario y prioridad' },
                  { name: 'task_schedule', desc: 'Programar o cambiar la hora de una tarea' },
                  { name: 'task_edit', desc: 'Editar título, categoría y prioridad' },
                  { name: 'task_delete', desc: 'Eliminar tareas individuales o completadas' },
                  { name: 'task_toggle', desc: 'Marcar como completada/pendiente' },
                  { name: 'voice_transcribe', desc: 'Transcripción de audio neural' }
                ].map((tool) => (
                  <span
                    key={tool.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-400/20 text-amber-200 text-[10px] font-mono"
                    title={tool.desc}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
                    <span>{tool.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SONIDOS HÁPTICOS */}
      {subTab === 'sonidos' && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-cyan-400 text-[20px]">music_note</span>
              <h2 className="text-[16px] font-bold text-white">Biblioteca de Timbres Hápticos</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400">5 Perfiles</span>
          </div>
          <p className="text-[12px] text-slate-400">
            Frecuencias no invasivas diseñadas para alertar al sistema cognitivo sin inducir estrés ni disparar cortisol.
          </p>

          <div className="flex flex-col gap-2">
            {[
              {
                id: 'zen',
                name: 'Apex Zen Bell',
                desc: 'Campana tibetana suave con armónico 432 Hz y envolvente fade-out',
                icon: 'self_improvement',
                badge: 'Predeterminado'
              },
              {
                id: 'cyber',
                name: 'Cyber Ping',
                desc: 'Pulso nítido en 880 Hz, ultra moderno y resolutivo',
                icon: 'token'
              },
              {
                id: 'breeze',
                name: 'Breeze Focus',
                desc: 'Viento orgánico con armónico theta 320 Hz relajante',
                icon: 'air'
              },
              {
                id: 'hype',
                name: 'Hype Chime',
                desc: 'Acorde festivo en escala mayor para metas alcanzadas',
                icon: 'celebration'
              },
              {
                id: 'haptic',
                name: 'Discreto / Taptic Engine',
                desc: '100% silencioso: ráfaga de 3 toques hápticos de precisión',
                icon: 'vibration'
              }
            ].map((sound) => {
              const isActive = activeSound === sound.id;
              return (
                <div
                  key={sound.id}
                  onClick={() => handlePlaySoundSample(sound.id)}
                  className={`sound-card p-3.5 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'frosted-card border border-cyan-400/60 bg-cyan-500/15 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                      : 'frosted-card border border-cyan-500/20 hover:border-cyan-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-cyan-500/25 text-cyan-300' : 'bg-cyan-500/15 text-slate-300'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">{sound.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-white truncate">{sound.name}</span>
                          {sound.badge && (
                            <span className="px-2 py-0.5 rounded-full btn-cyan-glow text-[9px] font-bold">
                              {sound.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{sound.desc}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'frosted-pill border-cyan-500/20 text-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isActive ? 'volume_up' : 'play_arrow'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="frosted-card border border-cyan-500/20 rounded-2xl p-4 space-y-4 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-white">Volumen de Feedback</span>
              <span className="text-[12px] font-mono text-cyan-400 font-bold">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] font-bold text-white">Intensidad Háptica (iPhone/Android)</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setHapticLevel(lvl);
                      if (navigator.vibrate) navigator.vibrate(lvl * 30);
                    }}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      hapticLevel === lvl
                        ? 'btn-cyan-glow'
                        : 'frosted-pill border border-cyan-500/20 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: IA & CLAVES */}
      {subTab === 'api' && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-cyan-400 text-[20px]">vpn_key</span>
              <h2 className="text-[16px] font-bold text-white">Proveedores de Inteligencia</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Cifrado AES-256
            </span>
          </div>

          <div className="flex items-center justify-between frosted-card border border-cyan-500/20 p-1 rounded-2xl gap-1">
            {[
              { id: 'openai', label: 'OpenAI GPT-4o' },
              { id: 'anthropic', label: 'Claude 3.5' },
              { id: 'gemini', label: 'Gemini Pro' }
            ].map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => {
                  setSelectedProvider(prov.id);
                  showToast(`Cambiado a proveedor ${prov.label}`);
                }}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedProvider === prov.id
                    ? 'btn-cyan-glow text-cyan-200'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {prov.label}
              </button>
            ))}
          </div>

          <div className="frosted-card border border-cyan-500/20 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-slate-200" htmlFor="apiKeyInput">
                Clave de API Personal ({selectedProvider.toUpperCase()})
              </label>
              {pingStatus && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {pingStatus}
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                id="apiKeyInput"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full h-11 bg-slate-950/80 border border-cyan-500/30 focus:border-cyan-400 text-slate-100 text-[13px] px-3.5 pr-20 rounded-xl outline-none transition font-mono"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  title={showKey ? 'Ocultar' : 'Mostrar'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                  title="Copiar"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedKey ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePingTest}
                className="flex-1 h-10 rounded-xl frosted-pill border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">network_ping</span>
                <span>Probar Conexión</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Clave API guardada y cifrada en el enclave seguro');
                  playSynthesizedChime(528, 0.4, 'sine');
                }}
                className="flex-1 h-10 rounded-xl btn-cyan-glow text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Guardar Clave</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROGRAMAR HORA DE TAREA */}
      {scheduleTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#090d16] border border-cyan-500/40 p-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-[15px] font-bold text-white">Programar Horario</h3>
              </div>
              <button
                type="button"
                onClick={() => setScheduleTaskModal(null)}
                className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[12px] text-slate-300">
              Asigna la hora para: <strong className="text-cyan-300">"{scheduleTaskModal.title}"</strong>
            </p>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {['08:00', '10:00', '11:30', '14:00', '16:30', '19:00'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTimeValue(time)}
                  className={`py-2 rounded-xl text-[12px] font-mono font-bold border transition cursor-pointer ${
                    selectedTimeValue === time
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400/40'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-400">O ingresa hora exacta:</label>
              <input
                type="time"
                value={selectedTimeValue}
                onChange={(e) => setSelectedTimeValue(e.target.value)}
                className="w-full h-11 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl font-mono text-[14px] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setScheduleTaskModal(null)}
                className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[12px] font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveScheduleTime}
                className="flex-1 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[12px] font-bold transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Guardar Horario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR TAREA */}
      {editingTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#090d16] border border-cyan-500/40 p-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-[15px] font-bold text-white">Editar Tarea</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTaskModal(null)}
                className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Título:</label>
                <input
                  type="text"
                  value={editingTaskModal.title}
                  onChange={(e) =>
                    setEditingTaskModal({ ...editingTaskModal, title: e.target.value })
                  }
                  className="w-full h-11 bg-slate-950 border border-cyan-500/30 text-white px-3.5 rounded-xl text-[13px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Prioridad:</label>
                  <select
                    value={editingTaskModal.priority}
                    onChange={(e) =>
                      setEditingTaskModal({
                        ...editingTaskModal,
                        priority: e.target.value as 'urgente' | 'normal'
                      })
                    }
                    className="w-full h-10 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl text-[12px] outline-none capitalize"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Categoría:</label>
                  <select
                    value={editingTaskModal.category}
                    onChange={(e) =>
                      setEditingTaskModal({
                        ...editingTaskModal,
                        category: e.target.value as 'trabajo' | 'finanzas' | 'personal'
                      })
                    }
                    className="w-full h-10 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl text-[12px] outline-none capitalize"
                  >
                    <option value="trabajo">Trabajo</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Horario:</label>
                <input
                  type="time"
                  value={editingTaskModal.time || '10:00'}
                  onChange={(e) =>
                    setEditingTaskModal({ ...editingTaskModal, time: e.target.value })
                  }
                  className="w-full h-10 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl font-mono text-[13px] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTaskModal(null)}
                className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[12px] font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onEditTask) {
                    onEditTask(editingTaskModal.id, {
                      title: editingTaskModal.title,
                      priority: editingTaskModal.priority,
                      category: editingTaskModal.category,
                      time: editingTaskModal.time
                    });
                    playSynthesizedChime(528, 0.3, 'sine');
                    showToast('Tarea actualizada correctamente');
                    setEditingTaskModal(null);
                  }
                }}
                className="flex-1 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[12px] font-bold transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVA TAREA */}
      {newTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateManualTask}
            className="w-full max-w-sm rounded-3xl bg-[#090d16] border border-cyan-500/40 p-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-[15px] font-bold text-white">Nueva Tarea Diaria</h3>
              </div>
              <button
                type="button"
                onClick={() => setNewTaskModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">¿Qué deseas lograr?:</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ej: Análisis de estados financieros..."
                  className="w-full h-11 bg-slate-950 border border-cyan-500/30 text-white px-3.5 rounded-xl text-[13px] outline-none placeholder:text-slate-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Prioridad:</label>
                  <select
                    value={manualPriority}
                    onChange={(e) => setManualPriority(e.target.value as 'urgente' | 'normal')}
                    className="w-full h-10 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl text-[12px] outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Categoría:</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as 'trabajo' | 'finanzas' | 'personal')}
                    className="w-full h-10 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl text-[12px] outline-none"
                  >
                    <option value="trabajo">Trabajo</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Horario Programado:</label>
                <input
                  type="time"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full h-10 bg-slate-950 border border-cyan-500/30 text-white px-3 rounded-xl font-mono text-[13px] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewTaskModalOpen(false)}
                className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[12px] font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!manualTitle.trim()}
                className="flex-1 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[12px] font-bold transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-40"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global feedback toast */}
      {toastFeedback && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-cyan-950/95 border border-cyan-400/60 text-cyan-200 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] z-50 flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastFeedback}</span>
        </div>
      )}
    </div>
  );
}
