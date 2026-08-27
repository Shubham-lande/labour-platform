import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../common/StatusBadge';
import GlassCard from '../common/GlassCard';
import api from '../../services/api';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Upload,
  IndianRupee,
  CheckCircle2,
  Building2,
} from 'lucide-react';

const ComplaintModal = ({ isOpen, onClose, project, userInvolved, onComplaintSubmitted }) => {
  const { toastSuccess, toastError } = useToast();
  const [complaintType, setComplaintType] = useState('work_quality_issue');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [amountInvolved, setAmountInvolved] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toastError('Please provide detailed descriptions for the complaint dispute desk.');
      return;
    }

    const numAmount = parseFloat(amountInvolved || 0);
    if (isNaN(numAmount) || numAmount < 0) {
      toastError('Amount involved must be non-negative.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/complaints', {
        projectId: project?._id || project?.id,
        userInvolved: userInvolved?._id || userInvolved?.id || '65f0a0000000000000000006',
        userInvolvedName: userInvolved?.fullName || 'Amitabh Verma (HVAC Tech)',
        complaintType,
        description,
        evidenceUrl,
        amountInvolved: numAmount,
      });

      if (res.success) {
        toastSuccess('Dispute complaint filed! Platform Arbitration Desk notified.');
        if (onComplaintSubmitted) onComplaintSubmitted(res.data);
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit complaint.');
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
          className="w-full max-w-lg bg-[#0F172A] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-500/10 space-y-6 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status="rejected" text="Arbitration Desk" />
                <span className="text-[10px] font-mono text-rose-400">Escrow Dispute Protection</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">Raise Complaint / Dispute</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Complaint Category</label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="work_quality_issue" className="bg-slate-900 text-white">Work Quality Defect / Non-Compliance</option>
                <option value="attendance_absence" className="bg-slate-900 text-white">Unexcused Site Absence / Delay</option>
                <option value="delayed_payout" className="bg-slate-900 text-white">Delayed Milestone Payment Payout</option>
                <option value="safety_violation" className="bg-slate-900 text-white">PPE / Safety Protocol Violation</option>
                <option value="contract_dispute" className="bg-slate-900 text-white">Contractual Scope Dispute</option>
                <option value="other" className="bg-slate-900 text-white">Other Issues</option>
              </select>
            </div>

            {/* User Involved & Project info */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
              <span className="text-slate-400 block font-semibold">Dispute Details:</span>
              <p className="text-white font-bold">
                Project: <span className="text-cyan-400">{project?.name || 'Smart Building Automation'}</span>
              </p>
              <p className="text-slate-300">
                User Involved: <span className="text-rose-400 font-semibold">{userInvolved?.fullName || 'Amitabh Verma (HVAC Tech)'}</span>
              </p>
            </div>

            {/* Amount Involved */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Disputed Escrow Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={amountInvolved}
                onChange={(e) => setAmountInvolved(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Detailed Dispute Report</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe exact site timeline, breach details, and evidence photos..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all custom-scrollbar"
              />
            </div>

            {/* Evidence URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Evidence Photo / Document URL</label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? 'Filing Complaint...' : 'Submit Dispute Complaint'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComplaintModal;
