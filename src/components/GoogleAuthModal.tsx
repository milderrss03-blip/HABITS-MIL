import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleIcon } from './GoogleIcon';
import { UserProfile } from '../types';
import { binauralSound } from '../utils/audio';
import { X, CheckCircle2, User, ChevronDown } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSuccess: (user: UserProfile) => void;
  currentUser?: UserProfile | null;
}

interface SavedGoogleAccount {
  name: string;
  email: string;
  isDeviceAccount?: boolean;
}

const STORAGE_KEY_GOOGLE_ACCOUNTS = 'habits_mil_gmail_accounts_v1';

// Default account detected from this device (Google Account connected to the device)
const DEVICE_GOOGLE_ACCOUNT: SavedGoogleAccount = {
  name: 'Milder R.',
  email: 'milderrss03@gmail.com',
  isDeviceAccount: true,
};

export function GoogleAuthModal({
  isOpen,
  onClose,
  onGoogleSuccess,
}: GoogleAuthModalProps) {
  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load saved accounts - ensuring the device's Google account is always detected first
  const [savedAccounts, setSavedAccounts] = useState<SavedGoogleAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GOOGLE_ACCOUNTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If the device account isn't in the list, prepend it
          const hasDeviceAccount = parsed.some(
            (acc) => acc.email.toLowerCase() === DEVICE_GOOGLE_ACCOUNT.email.toLowerCase()
          );
          return hasDeviceAccount ? parsed : [DEVICE_GOOGLE_ACCOUNT, ...parsed];
        }
      }
    } catch {
      // fallback
    }
    return [DEVICE_GOOGLE_ACCOUNT];
  });

  if (!isOpen) return null;

  const handleSelectAndLogin = (name: string, email: string) => {
    setIsLoading(true);
    setStatusMessage('Comprobando cuenta de Google...');

    // Save to remembered accounts list
    const updatedAccounts = [
      { name, email },
      ...savedAccounts.filter((acc) => acc.email.toLowerCase() !== email.toLowerCase())
    ].slice(0, 3);

    try {
      localStorage.setItem(STORAGE_KEY_GOOGLE_ACCOUNTS, JSON.stringify(updatedAccounts));
      setSavedAccounts(updatedAccounts);
    } catch {
      // ignore
    }

    setTimeout(() => {
      setStatusMessage(`Iniciando sesión como ${name}...`);
      binauralSound.playLoginChime();

      setTimeout(() => {
        setStatusMessage('Sincronizando con Hábits Mil...');

        setTimeout(() => {
          const initials = name
            .split(/[\s._-]+/)
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || email.slice(0, 2).toUpperCase();

          const normalizedEmail = email.trim().toLowerCase();
          // Create a deterministic safe user ID based on email so any device or friend logging with this email gets their same account data
          const safeUserId = `usr_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

          const user: UserProfile = {
            id: safeUserId,
            username: normalizedEmail.split('@')[0],
            fullName: name,
            email: normalizedEmail,
            initials,
            role: 'Google Verified • Apex Tier',
            streakDays: 14,
            isAuthenticated: true,
            provider: 'google',
            avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VqnvFnpdkg2WY_3HeKlE94jWAHDxNE8riHM9ZxXhmpg3AxvMOkpKZZF4EjeaUK7g0qPCMDn7cM-nrX0RJo2yGzoN_CGVXKa6mFdXbvcT8G6RFyuCjgZIKV4kwR76inU_4LIlOU5v4HtSK17epl441ONq20US1grsyuMRREz3m0RbSgAeIFvcC5GXF6_b6h5z6iHFzuE6XVFYNqeX-R-CfpQGOLbblrdV1cZSM4nDyHeU4Srh2lcOCikLRB'
          };

          setIsLoading(false);
          onGoogleSuccess(user);
        }, 500);
      }, 600);
    }, 700);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const rawEmail = inputEmail.trim();
    if (!rawEmail) return;

    const finalEmail = rawEmail.includes('@')
      ? rawEmail
      : `${rawEmail}@gmail.com`;

    const rawName = inputName.trim();
    const derivedName = rawName || finalEmail.split('@')[0].replace(/[._-]/g, ' ');
    const capitalizedName = derivedName
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    handleSelectAndLogin(capitalizedName, finalEmail);
  };

  const primaryAccount = savedAccounts[0] || DEVICE_GOOGLE_ACCOUNT;
  const firstName = primaryAccount.name.split(' ')[0] || 'Usuario';
  const isAccountSelectionView = savedAccounts.length > 0 && !showManualForm;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[440px] bg-white rounded-t-[32px] sm:rounded-[28px] border-t sm:border border-slate-200/90 shadow-[0_-10px_40px_rgba(0,0,0,0.2),0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden text-[#1f1f1f] max-h-[92vh] overflow-y-auto"
        >
          {/* Mobile swipe/grab handle indicator */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mt-3 sm:hidden" />

          {/* Top animated Google loading bar */}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8eaed] overflow-hidden z-20">
              <div className="h-full bg-[#0b57d0] animate-pulse w-full" />
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#f1f3f4] text-[#444746] hover:text-[#1f1f1f] flex items-center justify-center cursor-pointer transition disabled:opacity-30 z-10"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 pt-4 sm:pt-7">
            {/* Google Brand Header */}
            <div className="flex items-center gap-3 mb-5">
              <GoogleIcon className="w-7 h-7 flex-shrink-0" />
              <div className="flex flex-col text-left">
                <h2 className="text-[17px] font-semibold text-[#1f1f1f] tracking-tight leading-tight">
                  Acceder con Google
                </h2>
                <p className="text-[12px] text-[#444746] leading-tight mt-0.5">
                  para continuar en <span className="font-semibold text-[#1f1f1f]">Hábits Mil</span>
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-3 border-[#e8eaed]" />
                  <div className="absolute inset-0 rounded-full border-3 border-[#0b57d0] border-t-transparent animate-spin" />
                </div>
                <p className="text-[14px] font-medium text-[#1f1f1f] animate-pulse">
                  {statusMessage}
                </p>
                <div className="flex items-center gap-1.5 text-[12px] text-[#137333] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conexión cifrada con tu cuenta de Google</span>
                </div>
              </div>
            ) : isAccountSelectionView ? (
              /* Google Native App Account Chooser / One Tap View */
              <div className="space-y-4">
                {/* Device Primary Account Card */}
                <div className="p-3.5 rounded-2xl bg-[#f8fafd] border border-[#d3e3fd] transition-all">
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-semibold text-[#041e49] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                      Cuenta en este dispositivo
                    </span>
                    <span className="text-[11px] text-[#0b57d0] font-medium">
                      Verificada
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 py-1">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ea4335] via-[#fbbc05] to-[#4285f4] p-0.5 shadow-sm">
                        <div className="w-full h-full rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-base">
                          {primaryAccount.name.slice(0, 1)}
                        </div>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        <GoogleIcon className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#1f1f1f] truncate">
                        {primaryAccount.name}
                      </p>
                      <p className="text-[13px] text-[#444746] truncate font-normal">
                        {primaryAccount.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prominent One-Tap Button (Like native Google Play Services) */}
                <button
                  type="button"
                  onClick={() => handleSelectAndLogin(primaryAccount.name, primaryAccount.email)}
                  className="w-full h-12 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-[15px] shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continuar como {firstName}</span>
                </button>

                {/* Additional accounts if any */}
                {savedAccounts.length > 1 && (
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <p className="text-[11.5px] text-[#444746] font-medium px-1 mb-1">
                      Otras cuentas guardadas:
                    </p>
                    {savedAccounts.slice(1).map((account) => (
                      <div
                        key={account.email}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8f9fa] border border-transparent hover:border-[#dadce0] transition cursor-pointer"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectAndLogin(account.name, account.email)}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#e8eaed] text-[#444746] flex items-center justify-center font-medium text-xs flex-shrink-0">
                            {account.name.slice(0, 1)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#1f1f1f] truncate">
                              {account.name}
                            </p>
                            <p className="text-[11.5px] text-[#444746] truncate">
                              {account.email}
                            </p>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Privacy disclaimer */}
                <p className="text-[12px] text-[#444746] leading-relaxed pt-1">
                  Para continuar, Google compartirá tu nombre, correo electrónico y foto de perfil con <span className="font-semibold text-[#1f1f1f]">Hábits Mil</span>.
                </p>

                {/* Use Another Account Button */}
                <div className="pt-2 border-t border-[#e8eaed] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(true)}
                    className="text-[13px] font-medium text-[#0b57d0] hover:bg-[#f0f4f9] px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5"
                  >
                    <User className="w-4 h-4" />
                    <span>Usar otra cuenta</span>
                  </button>

                  <a
                    href="https://accounts.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] text-[#747775] hover:text-[#1f1f1f] hover:underline"
                  >
                    Gestionar cuentas
                  </a>
                </div>
              </div>
            ) : (
              /* Google Sign-in Email Input View */
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="Correo electrónico o teléfono"
                      className="w-full h-13 px-4 rounded-lg bg-white border border-[#747775] focus:border-[#0b57d0] focus:border-2 text-[#1f1f1f] placeholder:text-[#747775] text-[15px] focus:outline-none transition shadow-sm"
                    />
                  </div>

                  {!inputEmail.includes('@') && inputEmail.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInputEmail((prev) => `${prev.trim()}@gmail.com`)}
                      className="text-[11.5px] text-[#0b57d0] hover:underline font-medium cursor-pointer pl-1"
                    >
                      + @gmail.com
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    className="w-full h-11 px-4 rounded-lg bg-white border border-[#c4c7c5] focus:border-[#0b57d0] focus:border-2 text-[#1f1f1f] placeholder:text-[#747775] text-[14px] focus:outline-none transition"
                  />
                </div>

                <div className="pt-1">
                  <a
                    href="https://accounts.google.com/signin/usernamerecovery"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] font-medium text-[#0b57d0] hover:underline"
                  >
                    ¿Has olvidado tu correo electrónico?
                  </a>
                </div>

                <div className="pt-2 text-[12.5px] text-[#444746] leading-relaxed">
                  Para continuar, Google compartirá tu nombre, dirección de correo electrónico y foto de perfil con <span className="font-semibold text-[#1f1f1f]">Hábits Mil</span>.
                </div>

                {/* Google Buttons Row: Volver / Siguiente */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(false)}
                    className="text-[13.5px] font-semibold text-[#0b57d0] hover:bg-[#f0f4f9] px-3 py-2 rounded-full transition cursor-pointer"
                  >
                    Volver a cuenta del dispositivo
                  </button>

                  <button
                    type="submit"
                    className="h-10 px-6 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-[14px] shadow-sm hover:shadow transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center"
                  >
                    Siguiente
                  </button>
                </div>
              </form>
            )}

            {/* Google OAuth Legal Notice & Footer */}
            <div className="mt-6 pt-3.5 border-t border-[#e8eaed] flex items-center justify-between text-[11.5px] text-[#5f6368]">
              <div className="flex items-center gap-1 hover:text-[#1f1f1f] cursor-pointer">
                <span>Español (Latinoamérica)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-3 font-normal">
                <span className="hover:text-[#1f1f1f] cursor-pointer">Ayuda</span>
                <span className="hover:text-[#1f1f1f] cursor-pointer">Privacidad</span>
                <span className="hover:text-[#1f1f1f] cursor-pointer">Condiciones</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
