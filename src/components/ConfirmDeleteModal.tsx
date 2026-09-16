import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemType: 'hábito' | 'tarea' | 'meta' | 'evento';
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  itemType,
  onConfirm,
  onClose
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xs bg-[#0a0f1d] border border-rose-500/30 rounded-3xl p-5 shadow-[0_0_40px_rgba(244,63,94,0.25)] relative animate-in fade-in zoom-in-95 duration-150 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-bold text-white mb-1">¿Eliminar {itemType}?</h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 px-1">
          &quot;<span className="text-rose-300 font-semibold">{title}</span>&quot; se borrará de tu lista diaria.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-[#070a12] text-slate-300 hover:text-white hover:border-slate-600 text-xs font-bold transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
