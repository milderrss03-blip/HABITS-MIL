// Utility for Mobile Task Reminder Notifications with Task Icon and Sound

export type ReminderSoundType = 'crystal' | 'cyber' | 'zen' | 'victory' | 'chime';
export type ReminderIconType = 'check' | 'zap' | 'flame' | 'diamond' | 'briefcase' | 'star' | 'target' | 'bell';
export type ReminderColorType = 'cyan' | 'gold' | 'rose' | 'emerald' | 'purple';

export const REMINDER_SOUND_LABELS: Record<ReminderSoundType, { name: string; desc: string; icon: string }> = {
  crystal: { name: 'Campana de Cristal', desc: 'Armónico cristalino y brillante', icon: '🔔' },
  cyber: { name: 'Pulso Cyberpunk', desc: 'Doble tono futurista de alta energía', icon: '⚡' },
  zen: { name: 'Cuenco Zen Tibetano', desc: 'Frecuencia 528Hz de claridad mental', icon: '🧘' },
  victory: { name: 'Fanfarria de Éxito', desc: 'Acorde triunfal mayor de logro', icon: '🏆' },
  chime: { name: 'Campanilla Dinámica', desc: 'Melodía suave y elegante', icon: '✨' },
};

export const REMINDER_COLOR_CONFIG: Record<ReminderColorType, { name: string; hex: string; border: string; glow: string }> = {
  cyan: { name: 'Cian Neón', hex: '%2306b6d4', border: 'border-cyan-400', glow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]' },
  gold: { name: 'Oro Millonario', hex: '%23f59e0b', border: 'border-amber-400', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]' },
  rose: { name: 'Fuego Carmesí', hex: '%23f43f5e', border: 'border-rose-400', glow: 'shadow-[0_0_25px_rgba(244,63,94,0.4)]' },
  emerald: { name: 'Esmeralda Éxito', hex: '%2310b981', border: 'border-emerald-400', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]' },
  purple: { name: 'Púrpura Imperial', hex: '%23a855f7', border: 'border-purple-400', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]' },
};

// High-resolution SVG data URI for the Task Icon (used in System & Mobile push notifications)
export function getTaskIconDataUri(
  category: string = 'personal',
  priority: string = 'normal',
  iconType: ReminderIconType = 'check',
  colorType?: ReminderColorType
): string {
  const isUrgent = priority === 'urgente';
  let primaryColor = isUrgent ? '%23f43f5e' : '%2306b6d4';
  let accentColor = isUrgent ? '%23fb7185' : '%2338bdf8';

  if (colorType && REMINDER_COLOR_CONFIG[colorType]) {
    primaryColor = REMINDER_COLOR_CONFIG[colorType].hex;
    accentColor = REMINDER_COLOR_CONFIG[colorType].hex;
  }

  // SVG representation of a checklist task with a glowing checkmark or custom icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%230b1329"/>
        <stop offset="100%" stop-color="%23050914"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${accentColor}"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <!-- Background circle -->
    <rect width="128" height="128" rx="36" fill="url(%23bg)"/>
    <!-- Outer Border -->
    <rect x="4" y="4" width="120" height="120" rx="32" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-opacity="0.7"/>
    
    <!-- Task Checklist Frame -->
    <rect x="26" y="24" width="76" height="80" rx="16" fill="%230f1d3d" stroke="${primaryColor}" stroke-width="3"/>
    <rect x="48" y="16" width="32" height="14" rx="7" fill="url(%23accent)"/>
    
    <!-- Task Line 1 Checkmark -->
    <circle cx="42" cy="46" r="8" fill="url(%23accent)" filter="url(%23glow)"/>
    <path d="M38 46 L41 49 L46 43" stroke="%23050914" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="56" y="43" width="34" height="6" rx="3" fill="%23f8fafc"/>
    
    <!-- Task Line 2 -->
    <circle cx="42" cy="66" r="8" fill="none" stroke="${primaryColor}" stroke-width="2.5"/>
    <rect x="56" y="63" width="28" height="6" rx="3" fill="%2394a3b8"/>
    
    <!-- Task Line 3 -->
    <circle cx="42" cy="86" r="8" fill="none" stroke="${primaryColor}" stroke-width="2.5"/>
    <rect x="56" y="83" width="32" height="6" rx="3" fill="%2394a3b8"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${svg}`;
}

// Dedicated Web Audio API sound generator for mobile task reminders
export function playTaskReminderChime(soundType: ReminderSoundType = 'crystal'): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (soundType === 'crystal') {
      // Elegant crystal marimba harmonic chime: C6 (1046.5Hz) -> E6 (1318.5Hz) -> G6 (1568Hz) -> C7 (2093Hz)
      const notes = [
        { freq: 1046.5, time: 0, duration: 0.35, gain: 0.3 },
        { freq: 1318.5, time: 0.1, duration: 0.4, gain: 0.35 },
        { freq: 1568.0, time: 0.22, duration: 0.55, gain: 0.4 },
        { freq: 2093.0, time: 0.35, duration: 0.8, gain: 0.45 },
      ];

      notes.forEach(({ freq, time, duration, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Harmonic overtone for crystal bell timbre
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now + time);

        gainNode.gain.setValueAtTime(0.001, now + time);
        gainNode.gain.exponentialRampToValueAtTime(gain, now + time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        gain2.gain.setValueAtTime(0.001, now + time);
        gain2.gain.exponentialRampToValueAtTime(gain * 0.2, now + time + 0.015);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + time + duration * 0.7);

        osc.connect(gainNode);
        osc2.connect(gain2);
        gainNode.connect(ctx.destination);
        gain2.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration + 0.05);
        osc2.start(now + time);
        osc2.stop(now + time + duration + 0.05);
      });
    } else if (soundType === 'cyber') {
      // Tech double ping: 880Hz -> 1760Hz
      const pings = [
        { freq: 880, time: 0, dur: 0.25 },
        { freq: 1760, time: 0.12, dur: 0.5 },
      ];
      pings.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);
        gainNode.gain.setValueAtTime(0.01, now + time);
        gainNode.gain.exponentialRampToValueAtTime(0.35, now + time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } else if (soundType === 'zen') {
      // Zen harmonic chord (528Hz Solfeggio Love frequency)
      const freqs = [528, 660, 792];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.25);
      });
    } else if (soundType === 'victory') {
      // Triunfal Millionaire Fanfare: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const chord = [
        { freq: 523.25, delay: 0, dur: 0.35 },
        { freq: 659.25, delay: 0.08, dur: 0.4 },
        { freq: 783.99, delay: 0.16, dur: 0.5 },
        { freq: 1046.5, delay: 0.26, dur: 0.9 },
      ];
      chord.forEach(({ freq, delay, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.01, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.35, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + dur + 0.05);
      });
    } else if (soundType === 'chime') {
      // Dynamic bell clock chime: E5 -> G#5 -> B5 -> E6
      const notes = [
        { freq: 659.25, time: 0, dur: 0.3 },
        { freq: 830.61, time: 0.12, dur: 0.35 },
        { freq: 987.77, time: 0.24, dur: 0.4 },
        { freq: 1318.51, time: 0.36, dur: 0.7 },
      ];
      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.3, now + time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    }

    // Trigger mobile haptic vibration if supported on phone
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([140, 80, 220]);
      } catch {
        // Safe fallback if permissions restrict vibration
      }
    }
  } catch (err) {
    console.warn('Audio not available for task reminder', err);
  }
}

// Request system notification permissions on mobile/desktop
export async function requestTaskNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

// Send system notification with task icon, title, body and vibration
export function triggerSystemTaskNotification(task: {
  title: string;
  time?: string;
  category?: string;
  priority?: string;
  tag?: string;
  reminderCustomText?: string;
  reminderIcon?: ReminderIconType;
  reminderColor?: ReminderColorType;
}): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const iconUri = getTaskIconDataUri(task.category, task.priority, task.reminderIcon || 'check', task.reminderColor);
    const timeLabel = task.time ? `⏰ ${task.time}` : '⏰ Ahora';
    const categoryLabel = task.category ? `[${task.category.toUpperCase()}]` : '';
    const customMsg = task.reminderCustomText ? `\n💡 "${task.reminderCustomText}"` : '\nEs momento de avanzar con tu objetivo diario.';
    const bodyText = `${timeLabel} ${categoryLabel}${customMsg}`;

    const notification = new Notification(`✅ ${task.title}`, {
      body: bodyText,
      icon: iconUri,
      badge: iconUri,
      tag: `task-rem-${task.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      silent: false, // Let mobile sound play
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to fire system notification', err);
    return false;
  }
}
