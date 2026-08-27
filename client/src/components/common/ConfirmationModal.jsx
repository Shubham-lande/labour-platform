import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'success'
  loading = false,
}) => {
  if (!isOpen) return null;

  const iconColors = {
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    danger: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  };

  const btnColors = {
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/20',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-500/20',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md glass-card rounded-3xl border border-white/10 p-6 shadow-2xl z-10 text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${
              iconColors[type] || iconColors.warning
            }`}
          >
            {type === 'success' ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-lg font-extrabold text-white mb-2">{title}</h3>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">{message}</p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`w-1/2 py-3 rounded-xl text-xs font-bold shadow-lg transition-all ${
                btnColors[type] || btnColors.warning
              }`}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
