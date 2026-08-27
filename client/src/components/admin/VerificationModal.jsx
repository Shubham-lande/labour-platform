import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../common/StatusBadge';
import GlassCard from '../common/GlassCard';
import api from '../../services/api';
import {
  X,
  ShieldCheck,
  FileCheck,
  XCircle,
  AlertTriangle,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, verification, onUpdated }) => {
  const { toastSuccess, toastError } = useToast();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !verification) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/admin/verifications/${verification._id}`, {
        status: 'verified',
      });
      if (res.success) {
        toastSuccess(`Documents approved for ${verification.userName || 'Worker'}! Badge issued.`);
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Approval failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toastError('Please provide a specific rejection reason for the worker.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/admin/verifications/${verification._id}`, {
        status: 'rejected',
        rejectionReason,
      });
      if (res.success) {
        toastSuccess(`Verification rejected with feedback sent to worker.`);
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Rejection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status="verified" text="KYC & Trade License Review" />
                <span className="text-[10px] font-mono text-cyan-400">Admin Audit Queue</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Document Inspection — <span className="text-cyan-400">{verification.userName || 'Worker Profile'}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Preview Box */}
          <GlassCard hover={false} className="p-4 space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submitted Document</span>
              <StatusBadge status={verification.status || 'under_review'} />
            </div>

            <p className="text-xs text-slate-300 font-semibold">{verification.docType || 'Aadhaar Identity & Skill Certificate'}</p>

            <div className="h-60 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center relative group">
              <img
                src={verification.docUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c'}
                alt="Document Verification Preview"
                className="w-full h-full object-cover"
              />
              <a
                href={verification.docUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-xs font-bold text-white transition-opacity"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" /> Open Full-Resolution Image
              </a>
            </div>

            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Submitted: {new Date(verification.submissionDate || Date.now()).toLocaleDateString()}</span>
              <span>Worker ID: #{verification.userId || '65f0a02'}</span>
            </div>
          </GlassCard>

          {/* Action Area */}
          {!showRejectForm ? (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" /> Reject Documents
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" /> {loading ? 'Approving...' : 'Approve & Issue Verification Badge'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleReject} className="space-y-4 pt-2 border-t border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Rejection Reason (Required for Worker Notification)
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain issue e.g., Blurred identity card scan, expired trade license, or name mismatch..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-rose-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/25"
                >
                  {loading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VerificationModal;
