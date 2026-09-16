import { useState, useEffect } from 'react';
import { binauralSound } from '../utils/audio';
import { TouchBubblesCanvas } from './TouchBubblesCanvas';
import { BillionairesPlanet } from './BillionairesPlanet';
import { Habit, UserProfile } from '../types';
import { GoogleIcon } from './GoogleIcon';
import {
  Globe,
  LogIn,
  ArrowRight,
  Volume2,
  VolumeX,
  Mail,
  Share2
} from 'lucide-react';

// Billionaire quotes for carousel
const BILLIONAIRE_QUOTES = [
  {
    name: 'Elon Musk',
    role: 'Tesla & SpaceX • $248 B',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    quote: 'Si algo es lo suficientemente importante, debes intentarlo incluso si el resultado probable es el fracaso.'
  },
  {
    name: 'Warren Buffett',
    role: 'Berkshire Hathaway • $138 B',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    quote: 'El interés compuesto no solo aplica al dinero; aplica al conocimiento y a los hábitos que repites a diario.'
  },
  {
    name: 'Jeff Bezos',
    role: 'Amazon & Blue Origin • $204 B',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote: 'Si tomas tres buenas decisiones de alta calidad al día, es suficiente. La calidad supera con creces a la cantidad.'
  },
  {
    name: 'Steve Jobs',
    role: 'Apple • Legado Visionario',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    quote: 'Tu tiempo es limitado, de modo que no lo malgastes viviendo la vida de alguien más.'
  },
  {
    name: 'Jensen Huang',
    role: 'NVIDIA • $118 B',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    quote: 'La perseverancia implacable supera a la inteligencia. Trabaja duro antes de que nadie note la oportunidad.'
  },
  {
    name: 'Bernard Arnault',
    role: 'LVMH • $192 B',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    quote: 'El éxito requiere combinar dos talentos: creatividad desbordante y disciplina financiera férrea.'
  },
  {
    name: 'Mark Zuckerberg',
    role: 'Meta • $175 B',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    quote: 'El mayor riesgo es no asumir ningún riesgo en un mundo que cambia rápidamente.'
  },
  {
    name: 'Bill Gates',
    role: 'Microsoft • $128 B',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    quote: 'La mayoría sobrestima lo que puede hacer en un año y subestima lo que puede lograr en diez.'
  },
  {
    name: 'Amancio Ortega',
    role: 'Inditex / Zara • $110 B',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    quote: 'El optimismo ciego es peligroso; el verdadero éxito es la perseverancia silenciosa y obsesiva.'
  }
];

interface WelcomeScreenProps {
  onEnter: () => void;
  onSkip: () => void;
  onAdoptHabit?: (habit: Omit<Habit, 'id' | 'completed' | 'streak'>) => void;
  onOpenLogin?: () => void;
  onOpenGoogleLogin?: () => void;
  onOpenShare?: () => void;
  currentUser?: UserProfile | null;
}

export function WelcomeScreen({
  onEnter,
  onSkip,
  onAdoptHabit,
  onOpenLogin,
  onOpenGoogleLogin,
  onOpenShare,
  currentUser
}: WelcomeScreenProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const unsubscribe = binauralSound.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleAudio = () => {
    binauralSound.toggle();
  };

  return (
    <main className="relative w-full h-full min-h-[844px] bg-[#070a11] overflow-hidden flex flex-col justify-between select-none font-sans text-slate-100">
      {/* Interactive Physics Miniature Dollar Bills Canvas on Finger / Pointer Movement */}
      <TouchBubblesCanvas interactive={true} />

      {/* Ambient Orbital Background Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-to-b from-cyan-600/15 via-blue-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-cyan-500/10 rounded-full blur-2xl pointer-events-none animate-pulse-glow" />

      {/* TopBarNav */}
      <header className="w-full px-5 pt-5 pb-2 flex items-center justify-between z-30">
        {/* Logo Hábits Mil */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden">
            <img
              alt="Hábits Mil Monograma"
              className="w-full h-full object-cover rounded-xl"
              src="/logo.jpg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-wider text-base text-white">HÁBITS</span>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide border border-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.25)]">
              MIL
            </span>
          </div>
        </div>

        {/* Audio Toggle & Skip/Enter Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAudio}
            className="w-7 h-7 rounded-full bg-slate-800/80 border border-cyan-500/30 text-cyan-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer shadow-sm"
            title={isPlayingAudio ? 'Silenciar audio 432 Hz' : 'Activar frecuencia 432 Hz'}
          >
            {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {onOpenGoogleLogin && !currentUser?.isAuthenticated && (
            <button
              type="button"
              onClick={onOpenGoogleLogin}
              className="px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-sm cursor-pointer active:scale-95 border border-slate-200"
              title="Iniciar sesión con Gmail"
            >
              <div className="relative flex items-center justify-center">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EA4335] text-white flex items-center justify-center text-[6px]">
                  <Mail className="w-1.5 h-1.5" />
                </span>
              </div>
              <span>Gmail</span>
            </button>
          )}

          {onOpenLogin && (
            <button
              type="button"
              onClick={onOpenLogin}
              className="frosted-pill px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 hover:text-white hover:border-cyan-400 transition-all border border-cyan-500/30 shadow-sm cursor-pointer active:scale-95 group"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
              <span>{currentUser?.isAuthenticated ? currentUser.fullName.split(' ')[0] : 'Entrar'}</span>
            </button>
          )}

          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              className="w-7 h-7 rounded-full bg-slate-800/80 border border-cyan-500/30 text-cyan-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer shadow-sm"
              title="Compartir enlace con amigos"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          <button
            onClick={onSkip}
            className="text-xs font-medium text-slate-400 hover:text-white px-1.5 py-1 transition-colors cursor-pointer"
          >
            Saltar
          </button>
        </div>
      </header>

      {/* Mundo Millonario Header Badge */}
      <div className="w-full px-5 py-1 flex items-center justify-center z-30">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Globe className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
            Mundo Millonario
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* Main Content: Mundo Millonario Planet, Central Login & Carrusel de Frases */}
      <div className="flex-1 overflow-hidden flex flex-col justify-between px-3 pt-1 pb-2 z-20">
        {/* Centerpiece: Mundo Millonario Planet */}
        <BillionairesPlanet onAdoptHabit={onAdoptHabit} />

        {/* Central Sign-In Hero Hub (Centered in the screen as requested) */}
        <div className="w-full px-2 my-1.5 flex flex-col items-center justify-center z-25">
          <div className="w-full max-w-[340px] p-2.5 rounded-2xl frosted-card border border-cyan-500/35 bg-[#091220]/90 shadow-[0_0_25px_rgba(6,182,212,0.22)] backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10.5px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Acceso a tu Ecosistema
              </span>
              {currentUser?.isAuthenticated && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ Sesión Activa
                </span>
              )}
            </div>

            {/* Prominent Google Sign In - Centered in screen */}
            {onOpenGoogleLogin && (
              <button
                type="button"
                onClick={onOpenGoogleLogin}
                className="w-full h-11 sm:h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_2px_15px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all cursor-pointer border border-slate-200 group"
              >
                <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-slate-900 font-bold tracking-tight">
                  {(currentUser?.provider === 'google' || currentUser?.provider === 'gmail') && currentUser?.isAuthenticated
                    ? `Continuar como ${currentUser.fullName.split(' ')[0]}`
                    : 'Continuar con Google (Gmail)'}
                </span>
              </button>
            )}

            {/* Quick access with Email / Password or direct continue */}
            <div className="flex items-center gap-2 pt-0.5">
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-900/40 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Usuario / Clave</span>
                </button>
              )}

              <button
                type="button"
                onClick={onEnter}
                className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center gap-1 active:scale-95 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.35)]"
              >
                <span>Entrar Ahora</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Carrusel de Frases de Millonarios en movimiento constante hacia la derecha */}
        <section className="w-full relative overflow-hidden py-1 my-1" data-purpose="carrusel-frases-millonarios">
          {/* Edge gradient masks for seamless fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#070a11] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#070a11] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-right flex gap-3 px-2">
            {/* First Set of Quotes */}
            {BILLIONAIRE_QUOTES.map((q, idx) => (
              <div
                key={`q1-${idx}`}
                className="w-[280px] sm:w-[310px] flex-shrink-0 p-3 rounded-2xl bg-[#091220]/95 border border-cyan-500/35 hover:border-cyan-400/80 shadow-[0_0_16px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between gap-2 select-none cursor-pointer"
              >
                <p className="text-[12px] sm:text-[12.5px] font-medium text-slate-100 leading-snug italic">
                  «{q.quote}»
                </p>
                <div className="flex items-center gap-2 pt-1.5 border-t border-cyan-500/20">
                  <img
                    src={q.avatar}
                    alt={q.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-cyan-400/70 shadow-sm flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-extrabold text-white tracking-tight truncate">
                      {q.name}
                    </span>
                    <span className="text-[9.5px] font-semibold text-amber-300 truncate">
                      {q.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicate Set for Seamless Infinite Loop Moving Right */}
            {BILLIONAIRE_QUOTES.map((q, idx) => (
              <div
                key={`q2-${idx}`}
                className="w-[280px] sm:w-[310px] flex-shrink-0 p-3 rounded-2xl bg-[#091220]/95 border border-cyan-500/35 hover:border-cyan-400/80 shadow-[0_0_16px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between gap-2 select-none cursor-pointer"
              >
                <p className="text-[12px] sm:text-[12.5px] font-medium text-slate-100 leading-snug italic">
                  «{q.quote}»
                </p>
                <div className="flex items-center gap-2 pt-1.5 border-t border-cyan-500/20">
                  <img
                    src={q.avatar}
                    alt={q.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-cyan-400/70 shadow-sm flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-extrabold text-white tracking-tight truncate">
                      {q.name}
                    </span>
                    <span className="text-[9.5px] font-semibold text-amber-300 truncate">
                      {q.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Controls */}
      <footer className="w-full px-5 pt-1 pb-4 bg-gradient-to-t from-[#070a11] via-[#070a11]/95 to-transparent z-30">
        <div className="flex items-center justify-between gap-3 max-w-[340px] mx-auto">
          <button
            type="button"
            onClick={onEnter}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 font-extrabold text-xs tracking-wide flex items-center justify-center gap-1.5 neon-btn-glow active:scale-[0.98] transition shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <span>Explorar Hábits Mil</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              className="py-2.5 px-3 rounded-xl frosted-card border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 font-semibold text-xs tracking-tight flex items-center justify-center gap-1.5 active:scale-[0.98] transition cursor-pointer shadow-sm"
              title="Compartir con amigos"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compartir</span>
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}
