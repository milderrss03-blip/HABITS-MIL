import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check, QrCode, Globe, Shield, Users } from 'lucide-react';
import { GoogleIcon } from './GoogleIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  onSwitchAccount?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
  onSwitchAccount
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use the canonical production/shared URL if available or window.location.href
  const shareUrl = window.location.href;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hábits Mil • Rastreador de Hábitos en la Nube',
          text: '¡Únete a Hábits Mil! Ingresa con tu cuenta de Google o Gmail para guardar tus hábitos y sincronizarlos en la nube.',
          url: shareUrl
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[400px] frosted-card rounded-3xl p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden"
        >
          {/* Top Neon Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full frosted-pill border border-cyan-500/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mt-1 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Share2 className="w-7 h-7 text-cyan-300" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Compartir con Amigos</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              Cualquier amigo puede abrir este enlace, iniciar sesión con su propio correo o cuenta de Google y tener su propia base de datos privada.
            </p>
          </div>

          {/* How multi-account works callout */}
          <div className="p-3 rounded-2xl bg-[#090d16]/80 border border-cyan-500/20 space-y-2 mb-4 text-left">
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11.5px] font-bold text-white block">Cuentas independientes</span>
                <span className="text-[10.5px] text-slate-400 leading-relaxed block">
                  Cada amigo tiene sus propios hábitos, tareas y metas en Firestore. Tus datos nunca se mezclan con los de ellos.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1.5 border-t border-cyan-500/10">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11.5px] font-bold text-white block">Seguro en la nube</span>
                <span className="text-[10.5px] text-slate-400 leading-relaxed block">
                  Si entran desde su propio teléfono, computadora o navegador, sus avances se guardan en tiempo real.
                </span>
              </div>
            </div>
          </div>

          {/* Share Link Input with Copy Button */}
          <div className="space-y-2 mb-4">
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Enlace de la aplicación</span>
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090d16] border border-cyan-500/30">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2.5 text-xs text-slate-200 outline-none select-all truncate font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  copied
                    ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl btn-cyan-glow text-black text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar enlace por WhatsApp / Redes</span>
            </button>

            {onSwitchAccount && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchAccount();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0d1424] hover:bg-[#121c32] border border-cyan-500/25 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Probar entrando con otra cuenta ahora</span>
              </button>
            )}
          </div>

          {currentUserEmail && (
            <p className="text-[10px] text-center text-slate-500 mt-4">
              Sesión activa actual: <span className="text-cyan-400 font-mono">{currentUserEmail}</span>
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
