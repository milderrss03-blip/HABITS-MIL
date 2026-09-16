import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  KeyRound,
  Mail
} from 'lucide-react';
import { UserProfile } from '../types';
import { binauralSound } from '../utils/audio';
import { GoogleIcon } from './GoogleIcon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenGoogle?: () => void;
  currentUser?: UserProfile | null;
}

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenGoogle,
  currentUser
}: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Status states: 'idle' | 'scanning' | 'success' | 'error'
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordHint, setPasswordHint] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Por favor introduce tu nombre de usuario o correo');
      setAuthStatus('error');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMessage('La contraseña debe contener al menos 4 caracteres');
      setAuthStatus('error');
      return;
    }

    // Trigger animated verification
    setAuthStatus('scanning');

    setTimeout(() => {
      // Simulate success
      setAuthStatus('success');
      binauralSound.playLoginChime();

      setTimeout(() => {
        const cleanUser = username.trim();
        const isGmail = cleanUser.toLowerCase().includes('@gmail.com');
        const derivedName = fullName.trim() || (cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser);
        const capitalizedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
        const initials = derivedName
          .split(/[\s._-]+/)
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'US';

        const normalizedEmail = (cleanUser.includes('@') ? cleanUser : `${cleanUser.toLowerCase().replace(/\s+/g, '')}@gmail.com`).trim().toLowerCase();
        const safeUserId = `usr_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

        const profile: UserProfile = {
          id: safeUserId,
          username: cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser,
          fullName: mode === 'register' ? fullName.trim() : (fullName.trim() || capitalizedName),
          email: normalizedEmail,
          initials,
          role: isGmail ? 'Gmail Verified • Apex Tier' : 'Apex Member • Nivel 7',
          streakDays: currentUser?.streakDays || 14,
          isAuthenticated: true,
          provider: isGmail ? 'gmail' : 'password'
        };

        onLoginSuccess(profile);
        setAuthStatus('idle');
      }, 900);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        {/* Background glow effects */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[400px] frosted-card rounded-3xl p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden"
        >
          {/* Top Neon Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={authStatus === 'scanning'}
            className="absolute top-4 right-4 w-8 h-8 rounded-full frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Biometric Hologram Badge */}
          <div className="flex flex-col items-center text-center mt-2 mb-4">
            <div className="relative mb-3">
              {/* Outer Pulsing Rings */}
              <div className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
              <div className="w-16 h-16 rounded-2xl frosted-pill border border-cyan-400/50 flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                {authStatus === 'scanning' ? (
                  <div className="flex flex-col items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-cyan-300 animate-pulse" />
                    {/* Scanner laser bar moving vertically */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-300 shadow-[0_0_10px_#22d3ee] animate-[bounce_1.4s_infinite]" />
                  </div>
                ) : authStatus === 'success' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <CheckCircle2 className="w-9 h-9 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                ) : (
                  <div className="relative">
                    <ShieldCheck className="w-8 h-8 text-cyan-400" />
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{mode === 'login' ? 'Iniciar Sesión Apex' : 'Crear Cuenta Apex'}</span>
            </h2>
            <p className="text-[12px] text-slate-400 mt-1 max-w-[280px]">
              {mode === 'login'
                ? 'Accede a tu bóveda de hábitos, rutinas de magnates y métricas.'
                : 'Empieza a forjar tu imperio personal con disciplina diaria.'}
            </p>

            {/* Switch Mode Pills */}
            <div className="flex items-center gap-1 p-1 mt-3 rounded-xl bg-[#090d16] border border-cyan-500/25 w-full">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'btn-cyan-glow text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'btn-cyan-glow text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Registrarme
              </button>
            </div>
          </div>

          {/* Google Sign-in Fast Option - Standard App Style */}
          {onOpenGoogle && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGoogle();
                }}
                className="w-full h-11 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm tracking-normal flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition-all cursor-pointer border border-slate-200 active:scale-[0.98] group"
              >
                <GoogleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Continuar con Google</span>
              </button>

              <div className="flex items-center gap-2 my-3 text-[10.5px] text-slate-400 font-medium">
                <span className="flex-1 h-px bg-slate-800" />
                <span>o con cualquier cuenta o usuario</span>
                <span className="flex-1 h-px bg-slate-800" />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" /> Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Tu Nombre Completo"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Usuario / Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <User className="w-3 h-3 text-cyan-400" /> Correo Gmail o Usuario
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ejemplo@gmail.com o tu usuario"
                  className="w-full h-11 pl-9 pr-3.5 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition shadow-inner"
                />
                <User className="w-4 h-4 text-cyan-400/60 absolute left-3 pointer-events-none" />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" /> Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordHint('Puedes escribir cualquier contraseña de 4 o más caracteres, o iniciar sesión directamente con tu Gmail.')}
                  className="text-[10px] text-cyan-400/80 hover:text-cyan-300 underline cursor-pointer"
                >
                  ¿Olvidaste tu clave?
                </button>
              </div>
              {passwordHint && (
                <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-[11px] text-cyan-200">
                  {passwordHint}
                </div>
              )}
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña..."
                  className="w-full h-11 pl-9 pr-10 rounded-xl bg-[#090d16] border border-cyan-500/25 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition shadow-inner"
                />
                <KeyRound className="w-4 h-4 text-cyan-400/60 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-cyan-300 transition cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-[12px] text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-cyan-500/30 bg-[#090d16] text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
                <span>Recordar credenciales</span>
              </label>

              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cifrado 256-bit
              </span>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-[11.5px] flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Submit Button with Animated Flow */}
            <button
              type="submit"
              disabled={authStatus === 'scanning' || authStatus === 'success'}
              className={`w-full h-12 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.98] ${
                authStatus === 'scanning'
                  ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-400/40 animate-pulse cursor-wait'
                  : authStatus === 'success'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.5)] font-extrabold'
                  : 'btn-cyan-glow text-slate-950 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]'
              }`}
            >
              {authStatus === 'scanning' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                  <span>Verificando Credenciales...</span>
                </div>
              ) : authStatus === 'success' ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>¡Acceso Concedido! Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{mode === 'login' ? 'Iniciar Sesión' : 'Crear Mi Bóveda'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Biometric Security Footer */}
          <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[10.5px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              Sincronización Neural
            </span>
            <span className="text-cyan-400 font-medium">Hábits Mil Cloud v3.4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
